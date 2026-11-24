import { diffDays, yearMonthOf, type LocalDate } from "@/lib/dates";
import type { Db, Queryable } from "@/lib/database/types";
import { levelProgress, type LevelProgress } from "./levels";
import { computeStreak, type StreakSummary } from "./streaks";

export type XpEventType = "daily_experience" | "achievement" | "collection_mastery";

/**
 * Adds an entry to the XP ledger. Returns the amount actually awarded: 0 when
 * an entry with the same idempotency key already exists for this user.
 */
export async function awardXp(
  q: Queryable,
  input: {
    userId: string;
    amount: number;
    eventType: XpEventType;
    sourceId: string | null;
    idempotencyKey: string;
  },
): Promise<number> {
  const rows = await q.query(
    `insert into xp_transactions (user_id, amount, event_type, source_id, idempotency_key)
     values ($1, $2, $3, $4, $5)
     on conflict (user_id, idempotency_key) do nothing
     returning id`,
    [input.userId, input.amount, input.eventType, input.sourceId, input.idempotencyKey],
  );
  return rows.length > 0 ? input.amount : 0;
}

export async function getTotalXp(q: Queryable, userId: string): Promise<number> {
  const [row] = await q.query<{ total: number }>(
    `select coalesce(sum(amount), 0)::int as total from xp_transactions where user_id = $1`,
    [userId],
  );
  return row.total;
}

export async function getCompletionDates(q: Queryable, userId: string): Promise<LocalDate[]> {
  const rows = await q.query<{ date: string }>(
    `select scheduled_date::text as date from user_experience_completions
     where user_id = $1 order by scheduled_date`,
    [userId],
  );
  return rows.map((row) => row.date);
}

export async function getStreak(q: Queryable, userId: string, today: LocalDate): Promise<StreakSummary> {
  return computeStreak(await getCompletionDates(q, userId), today);
}

export type UserStats = {
  level: LevelProgress;
  streak: StreakSummary;
  experiencesCompleted: number;
  achievementsUnlocked: number;
  collectionsStarted: number;
  collectionsMastered: number;
  /** Distinct dates with at least one memory. */
  daysWithMoments: number;
  /** Daily experiences completed this calendar month, and the days elapsed in it. */
  month: { completed: number; days: number };
};

/**
 * Statistics are derived on read from the completion records and the XP
 * ledger, which stay authoritative. There is no cached statistics table yet.
 */
export async function getUserStats(
  db: Db,
  userId: string,
  today: LocalDate,
  /** The user's local date when they joined. */
  joinedOn: LocalDate,
): Promise<UserStats> {
  const [totalXp, completionDates, [achievementRow], collectionRows, [momentsRow]] = await Promise.all([
    getTotalXp(db, userId),
    getCompletionDates(db, userId),
    db.query<{ count: number }>(`select count(*)::int as count from user_achievements where user_id = $1`, [
      userId,
    ]),
    db.query<{ total: number; unlocked: number }>(
      `select count(a.id)::int as total, count(ua.id)::int as unlocked
       from hobby_collections c
       join achievements a on a.collection_id = c.id and a.status = 'published'
       left join user_achievements ua on ua.achievement_id = a.id and ua.user_id = $1
       where c.status = 'published'
       group by c.id`,
      [userId],
    ),
    db.query<{ count: number }>(
      `select count(distinct occurred_on)::int as count from memory_entries where user_id = $1`,
      [userId],
    ),
  ]);

  // Month so far, counted from the day the user joined if that was this month.
  const monthStart = `${yearMonthOf(today)}-01`;
  const countFrom = diffDays(monthStart, joinedOn) > 0 ? joinedOn : monthStart;
  const monthDays = Math.max(1, diffDays(countFrom, today) + 1);
  const monthCompleted = completionDates.filter(
    (date) => diffDays(countFrom, date) >= 0 && diffDays(date, today) >= 0,
  ).length;

  return {
    level: levelProgress(totalXp),
    streak: computeStreak(completionDates, today),
    experiencesCompleted: completionDates.length,
    achievementsUnlocked: achievementRow.count,
    collectionsStarted: collectionRows.filter((row) => row.unlocked > 0).length,
    collectionsMastered: collectionRows.filter((row) => row.total > 0 && row.unlocked === row.total).length,
    daysWithMoments: momentsRow.count,
    month: { completed: monthCompleted, days: monthDays },
  };
}
