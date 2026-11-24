import { addDays, type LocalDate } from "@/lib/dates";
import type { Db, Queryable } from "@/lib/database/types";
import { askLabel, noteHasLabel } from "@/features/daily/memory-prompts";
import {
  FIRST_INTERVAL_DAYS,
  nextIntervalDays,
  recallQuestion,
  SNOOZE_DAYS,
  type RecallResult,
} from "./scheduling";

/**
 * Memory recall.
 *
 * Only daily-experience memories are reviewed for now, because the question
 * "What did you do last Monday?" has exactly one answer for them.
 */

export type DueReview = {
  id: string;
  memoryId: string;
  memoryDate: LocalDate;
  question: string;
};

export type RevealedMemory = {
  memoryId: string;
  title: string;
  prompt: string;
  note: string | null;
  date: LocalDate;
};

export type HintOption = { id: string; title: string };

/** Schedules the first review of a new memory. Call inside the completion transaction. */
export async function scheduleFirstReview(
  q: Queryable,
  input: { userId: string; memoryId: string; occurredOn: LocalDate },
): Promise<void> {
  await q.query(
    `insert into memory_reviews (user_id, memory_entry_id, interval_days, due_on)
     values ($1, $2, $3, $4::date)`,
    [input.userId, input.memoryId, FIRST_INTERVAL_DAYS, addDays(input.occurredOn, FIRST_INTERVAL_DAYS)],
  );
}

/** The oldest review that is due, if any. */
export async function getDueReview(db: Db, userId: string, today: LocalDate): Promise<DueReview | null> {
  const [row] = await db.query<{ id: string; memory_id: string; memory_date: string; note: string | null; slug: string | null }>(
    `select r.id, m.id as memory_id, m.occurred_on::text as memory_date, m.note, e.slug
     from memory_reviews r
     join memory_entries m on m.id = r.memory_entry_id
     left join user_experience_completions c
       on c.id = m.source_id and m.source_type = 'daily_experience'
     left join experiences e on e.id = c.experience_id
     where r.user_id = $1 and r.completed_at is null and r.due_on <= $2::date
     order by r.due_on, m.occurred_on
     limit 1`,
    [userId, today],
  );
  if (!row) return null;
  const focus = row.slug ? askLabel(row.slug) : null;
  return {
    id: row.id,
    memoryId: row.memory_id,
    memoryDate: row.memory_date,
    question: recallQuestion(row.memory_date, today, focus && noteHasLabel(row.note, focus) ? focus : null),
  };
}

export async function countDueReviews(db: Db, userId: string, today: LocalDate): Promise<number> {
  const [row] = await db.query<{ count: number }>(
    `select count(*)::int as count from memory_reviews
     where user_id = $1 and completed_at is null and due_on <= $2::date`,
    [userId, today],
  );
  return row.count;
}

type ReviewTarget = RevealedMemory & { experienceId: string };

function toMemory(target: ReviewTarget): RevealedMemory {
  return {
    memoryId: target.memoryId,
    title: target.title,
    prompt: target.prompt,
    note: target.note,
    date: target.date,
  };
}

/** The memory behind a pending review that belongs to this user. */
async function getReviewTarget(q: Queryable, userId: string, reviewId: string): Promise<ReviewTarget | null> {
  const [row] = await q.query<{
    memory_id: string;
    title: string;
    prompt: string;
    note: string | null;
    date: string;
    experience_id: string;
  }>(
    `select m.id as memory_id, m.title, e.prompt, m.note, m.occurred_on::text as date,
            e.id as experience_id
     from memory_reviews r
     join memory_entries m on m.id = r.memory_entry_id
     join user_experience_completions c on c.id = m.source_id and m.source_type = 'daily_experience'
     join experiences e on e.id = c.experience_id
     where r.id = $1 and r.user_id = $2 and r.completed_at is null`,
    [reviewId, userId],
  );
  if (!row) return null;
  return {
    memoryId: row.memory_id,
    title: row.title,
    prompt: row.prompt,
    note: row.note,
    date: row.date,
    experienceId: row.experience_id,
  };
}

/**
 * Four experience titles, one of which is the memory being recalled, in an
 * order that is stable for a given review.
 */
export async function getHintOptions(db: Db, userId: string, reviewId: string): Promise<HintOption[] | null> {
  const target = await getReviewTarget(db, userId, reviewId);
  if (!target) return null;

  return db.query<HintOption>(
    `select id, title from (
       (select e.id, e.title from experiences e where e.id = $1)
       union all
       (select e.id, e.title from experiences e
        where e.id <> $1 and e.title <> $3 and e.status = 'approved'
        order by md5(e.id::text || $2::text)
        limit 3)
     ) options
     order by md5($2::text || id::text)`,
    [target.experienceId, reviewId, target.title],
  );
}

export type ReviewOutcome = {
  memory: RevealedMemory;
  result: RecallResult;
  nextDueOn: LocalDate;
};

/**
 * Closes a pending review with a result and schedules the next one. Returns
 * null if the review does not exist, is not this user's, or is already closed.
 */
export async function completeReview(
  db: Db,
  input: {
    userId: string;
    reviewId: string;
    result: RecallResult;
    response?: string | null;
    today: LocalDate;
    now?: Date;
  },
): Promise<ReviewOutcome | null> {
  return db.transaction(async (tx) => {
    const target = await getReviewTarget(tx, input.userId, input.reviewId);
    if (!target) return null;

    const response = input.response?.trim() ? input.response.trim().slice(0, 2000) : null;
    const [closed] = await tx.query<{ interval_days: number }>(
      `update memory_reviews
       set completed_at = $3, result = $4, user_response = $5
       where id = $1 and user_id = $2 and completed_at is null
       returning interval_days`,
      [input.reviewId, input.userId, input.now ?? new Date(), input.result, response],
    );
    if (!closed) return null;

    const interval = nextIntervalDays(closed.interval_days, input.result);
    const nextDueOn = addDays(input.today, interval);
    await tx.query(
      `insert into memory_reviews (user_id, memory_entry_id, interval_days, due_on)
       values ($1, $2, $3, $4::date)`,
      [input.userId, target.memoryId, interval, nextDueOn],
    );

    return { memory: toMemory(target), result: input.result, nextDueOn };
  });
}

/**
 * Resolves a hint choice: picking the right title counts as recognized, any
 * other choice simply reveals the memory.
 */
export async function answerHint(
  db: Db,
  input: { userId: string; reviewId: string; optionId: string; today: LocalDate; now?: Date },
): Promise<(ReviewOutcome & { correct: boolean }) | null> {
  const target = await getReviewTarget(db, input.userId, input.reviewId);
  if (!target) return null;
  const correct = target.experienceId === input.optionId;
  const outcome = await completeReview(db, {
    userId: input.userId,
    reviewId: input.reviewId,
    result: correct ? "recognized" : "revealed",
    today: input.today,
    now: input.now,
  });
  return outcome ? { ...outcome, correct } : null;
}

/** Shows the memory without closing the review, so the user can say how it went. */
export async function peekReview(db: Db, userId: string, reviewId: string): Promise<RevealedMemory | null> {
  const target = await getReviewTarget(db, userId, reviewId);
  if (!target) return null;
  return toMemory(target);
}

/** Skip for now: the same review comes back tomorrow, with no other effect. */
export async function snoozeReview(
  db: Db,
  input: { userId: string; reviewId: string; today: LocalDate },
): Promise<boolean> {
  const rows = await db.query(
    `update memory_reviews set due_on = $3::date
     where id = $1 and user_id = $2 and completed_at is null
     returning id`,
    [input.reviewId, input.userId, addDays(input.today, SNOOZE_DAYS)],
  );
  return rows.length > 0;
}
