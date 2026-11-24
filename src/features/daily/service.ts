import { addDays, dailyNumber, localDateInTimezone, type LocalDate } from "@/lib/dates";
import type { Db, Queryable } from "@/lib/database/types";
import { awardXp } from "@/features/progression/service";
import { scheduleFirstReview } from "@/features/recall/service";

/** XP for the day's experience. The accessible alternative earns exactly the same. */
export const DAILY_XP = 20;

/** How far ahead of the requested date the schedule is kept filled. */
const SCHEDULE_AHEAD_DAYS = 14;

export type CompletionMethod = "primary" | "alternative";

export type Experience = {
  id: string;
  slug: string;
  title: string;
  prompt: string;
  steps: string[];
  category: string;
  minutesMin: number;
  minutesMax: number;
  costCents: number;
  setting: string;
  requiredItems: string[];
  accessibilityNote: string | null;
};

export type ScheduledDay = {
  date: LocalDate;
  primary: Experience;
  alternative: Experience | null;
};

export type DailyCompletion = {
  id: string;
  method: CompletionMethod;
  experienceId: string;
  memoryId: string;
  note: string | null;
  completedAt: string;
};

export type TodayView = ScheduledDay & {
  number: number;
  completion: DailyCompletion | null;
};

type ExperienceRow = {
  id: string;
  slug: string;
  title: string;
  prompt: string;
  steps: string[];
  category: string;
  minutes_min: number;
  minutes_max: number;
  cost_cents: number;
  setting: string;
  required_items: string[];
  accessibility_note: string | null;
};

const EXPERIENCE_COLUMNS = `
  e.id, e.slug, e.title, e.prompt, e.steps, e.category, e.minutes_min, e.minutes_max,
  e.cost_cents, e.setting, e.required_items, e.accessibility_note
`;

function toExperience(row: ExperienceRow): Experience {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    prompt: row.prompt,
    steps: row.steps,
    category: row.category,
    minutesMin: row.minutes_min,
    minutesMax: row.minutes_max,
    costCents: row.cost_cents,
    setting: row.setting,
    requiredItems: row.required_items,
    accessibilityNote: row.accessibility_note,
  };
}

/**
 * Fills any unscheduled dates in [from, from + days) from the approved
 * inventory. Experiences that have never been scheduled go first, in seed
 * order. Once every experience has been used, the least recently scheduled
 * one is repeated (a known limitation: see docs/ROADMAP.md).
 */
export async function ensureSchedule(db: Db, from: LocalDate, days: number): Promise<void> {
  const existing = new Set(
    (
      await db.query<{ date: string }>(
        `select local_date::text as date from daily_experience_schedule
         where local_date >= $1::date and local_date < ($1::date + $2::int)`,
        [from, days],
      )
    ).map((row) => row.date),
  );

  for (let offset = 0; offset < days; offset += 1) {
    const date = addDays(from, offset);
    if (existing.has(date)) continue;
    await db.query(
      `insert into daily_experience_schedule (local_date, experience_id, alternative_experience_ids)
       select $1::date, e.id,
              case when e.alternative_id is null then '{}'::uuid[] else array[e.alternative_id] end
       from experiences e
       left join (
         select experience_id, max(local_date) as last_scheduled
         from daily_experience_schedule group by experience_id
       ) used on used.experience_id = e.id
       where e.status = 'approved' and not e.is_alternative
       order by used.last_scheduled asc nulls first, e.sort_order asc
       limit 1
       on conflict (local_date) do nothing`,
      [date],
    );
  }
}

export async function getScheduledDay(db: Db, date: LocalDate): Promise<ScheduledDay | null> {
  const [row] = await db.query<ExperienceRow & { alternative_ids: string[] }>(
    `select ${EXPERIENCE_COLUMNS}, s.alternative_experience_ids as alternative_ids
     from daily_experience_schedule s
     join experiences e on e.id = s.experience_id
     where s.local_date = $1::date and s.publication_status = 'published'`,
    [date],
  );
  if (!row) return null;

  let alternative: Experience | null = null;
  if (row.alternative_ids.length > 0) {
    const [alternativeRow] = await db.query<ExperienceRow>(
      `select ${EXPERIENCE_COLUMNS} from experiences e where e.id = $1`,
      [row.alternative_ids[0]],
    );
    alternative = alternativeRow ? toExperience(alternativeRow) : null;
  }
  return { date, primary: toExperience(row), alternative };
}

/** The scheduled day, filling the schedule first if this date has nothing yet. */
async function getOrScheduleDay(db: Db, date: LocalDate): Promise<ScheduledDay | null> {
  const scheduled = await getScheduledDay(db, date);
  if (scheduled) return scheduled;
  // Start a day early so users in timezones behind the first visitor are covered.
  await ensureSchedule(db, addDays(date, -1), SCHEDULE_AHEAD_DAYS + 2);
  return getScheduledDay(db, date);
}

async function getCompletion(q: Queryable, userId: string, date: LocalDate): Promise<DailyCompletion | null> {
  const [row] = await q.query<{
    id: string;
    completion_method: CompletionMethod;
    experience_id: string;
    completed_at: Date;
    memory_id: string;
    note: string | null;
  }>(
    `select c.id, c.completion_method, c.experience_id, c.completed_at,
            m.id as memory_id, m.note
     from user_experience_completions c
     join memory_entries m
       on m.user_id = c.user_id and m.source_type = 'daily_experience' and m.source_id = c.id
     where c.user_id = $1 and c.scheduled_date = $2::date`,
    [userId, date],
  );
  if (!row) return null;
  return {
    id: row.id,
    method: row.completion_method,
    experienceId: row.experience_id,
    memoryId: row.memory_id,
    note: row.note,
    completedAt: new Date(row.completed_at).toISOString(),
  };
}

/**
 * Today's experience for this user, by their local date. Returns null only if
 * there is no approved content to schedule.
 */
export async function getToday(
  db: Db,
  user: { id: string; timezone: string },
  now: Date,
  launch: LocalDate,
): Promise<TodayView | null> {
  const date = localDateInTimezone(now, user.timezone);
  const scheduled = await getOrScheduleDay(db, date);
  if (!scheduled) return null;
  return {
    ...scheduled,
    number: dailyNumber(date, launch),
    completion: await getCompletion(db, user.id, date),
  };
}

export type CompletionOutcome = {
  /** False when this day was already complete; nothing was awarded again. */
  created: boolean;
  completionId: string;
  memoryId: string;
  xpAwarded: number;
};

/**
 * Records a completion for `date` and everything that follows from it, in one
 * transaction: the memory entry, the XP and the first recall review. A second
 * call for the same user and date changes nothing.
 *
 * Callers are responsible for `date` being a day the user may complete and for
 * `experienceId` being scheduled on it; `completeToday` does both.
 */
export async function recordCompletion(
  db: Db,
  input: {
    userId: string;
    date: LocalDate;
    experienceId: string;
    method: CompletionMethod;
    completedAt: Date;
  },
): Promise<CompletionOutcome> {
  return db.transaction(async (tx) => {
    const [inserted] = await tx.query<{ id: string }>(
      `insert into user_experience_completions
         (user_id, scheduled_date, experience_id, completion_method, completed_at)
       values ($1, $2::date, $3, $4, $5)
       on conflict (user_id, scheduled_date) do nothing
       returning id`,
      [input.userId, input.date, input.experienceId, input.method, input.completedAt],
    );

    if (!inserted) {
      const existing = await getCompletion(tx, input.userId, input.date);
      if (!existing) throw new Error("Completion conflict without an existing completion");
      return { created: false, completionId: existing.id, memoryId: existing.memoryId, xpAwarded: 0 };
    }

    const [memory] = await tx.query<{ id: string }>(
      `insert into memory_entries (user_id, source_type, source_id, title, occurred_on)
       select $1, 'daily_experience', $2, e.title, $3::date from experiences e where e.id = $4
       returning id`,
      [input.userId, inserted.id, input.date, input.experienceId],
    );

    const xpAwarded = await awardXp(tx, {
      userId: input.userId,
      amount: DAILY_XP,
      eventType: "daily_experience",
      sourceId: inserted.id,
      idempotencyKey: `daily:${input.date}`,
    });

    await scheduleFirstReview(tx, { userId: input.userId, memoryId: memory.id, occurredOn: input.date });

    return { created: true, completionId: inserted.id, memoryId: memory.id, xpAwarded };
  });
}

export type CompleteTodayResult =
  | ({ ok: true; slug: string } & CompletionOutcome)
  | { ok: false; reason: "nothing_scheduled" | "no_alternative" };

/** Completes the experience scheduled for the user's current local date. */
export async function completeToday(
  db: Db,
  user: { id: string; timezone: string },
  method: CompletionMethod,
  now: Date,
): Promise<CompleteTodayResult> {
  const date = localDateInTimezone(now, user.timezone);
  const scheduled = await getOrScheduleDay(db, date);
  if (!scheduled) return { ok: false, reason: "nothing_scheduled" };

  const experience = method === "alternative" ? scheduled.alternative : scheduled.primary;
  if (!experience) return { ok: false, reason: "no_alternative" };

  const outcome = await recordCompletion(db, {
    userId: user.id,
    date,
    experienceId: experience.id,
    method,
    completedAt: now,
  });
  return { ok: true, slug: experience.slug, ...outcome };
}
