import { dayOfMonth, diffDays, monthName, weekdayName, type LocalDate } from "@/lib/dates";

/**
 * Recall scheduling.
 *
 * A memory is first revisited a week after it happened, then at widening
 * intervals. This borrows the shape of spaced retrieval to make revisiting
 * enjoyable. It is not a memory-training programme and makes no claim to
 * improve memory.
 */

export const RECALL_INTERVALS = [7, 30, 90, 180, 365] as const;
export const FIRST_INTERVAL_DAYS = RECALL_INTERVALS[0];
export const SHORTEST_INTERVAL_DAYS = 3;
export const SNOOZE_DAYS = 1;

export type RecallResult =
  /** Recalled it unaided. */
  | "remembered"
  /** Picked it out, or remembered it, after seeing the hint options. */
  | "recognized"
  /** Looked at the answer without recalling it. */
  | "revealed";

/** Days until the next review of the same memory. */
export function nextIntervalDays(currentInterval: number, result: RecallResult): number {
  if (result === "recognized") return currentInterval;

  if (result === "remembered") {
    const longer = RECALL_INTERVALS.find((interval) => interval > currentInterval);
    return longer ?? RECALL_INTERVALS[RECALL_INTERVALS.length - 1];
  }

  // Revealed: come back sooner, one step down the ladder.
  const shorter = [...RECALL_INTERVALS].reverse().find((interval) => interval < currentInterval);
  return shorter ?? SHORTEST_INTERVAL_DAYS;
}

/** Phrases the recall question by how long ago the memory happened. */
export function recallQuestion(memoryDate: LocalDate, today: LocalDate): string {
  const age = diffDays(memoryDate, today);
  const weekday = weekdayName(memoryDate);

  if (age === 0) return "What did you do today?";
  if (age === 1) return "What did you do yesterday?";
  if (age < 7) return `What did you do this past ${weekday}?`;
  if (age < 14) return `What did you do last ${weekday}?`;

  const sameYear = memoryDate.slice(0, 4) === today.slice(0, 4);
  const day = `${weekday} ${dayOfMonth(memoryDate)} ${monthName(memoryDate)}`;
  return sameYear
    ? `What did you do on ${day}?`
    : `What did you do on ${day} ${memoryDate.slice(0, 4)}?`;
}
