import { addDays, diffDays, type LocalDate } from "@/lib/dates";

/**
 * Streaks, derived from completion dates rather than stored.
 *
 * A streak counts completed days. One missed day does not end it: the gap is
 * bridged by a grace day, as long as no other grace day fell within the
 * previous seven days. Two missed days in a row, or a second miss inside the
 * same week, starts a new streak. Nothing is taken away from the user: the
 * longest streak and lifetime count are unaffected.
 */

export const GRACE_WINDOW_DAYS = 7;

export type StreakSummary = {
  /** Completed days in the streak that is still alive today, or 0. */
  current: number;
  longest: number;
  completedToday: boolean;
};

function graceAllowed(lastGraceDay: LocalDate | null, missedDay: LocalDate): boolean {
  return lastGraceDay === null || diffDays(lastGraceDay, missedDay) >= GRACE_WINDOW_DAYS;
}

export function computeStreak(completionDates: readonly LocalDate[], today: LocalDate): StreakSummary {
  const dates = [...new Set(completionDates)].filter((date) => diffDays(date, today) >= 0).sort();

  if (dates.length === 0) {
    return { current: 0, longest: 0, completedToday: false };
  }

  let run = 0;
  let longest = 0;
  let lastGraceDay: LocalDate | null = null;
  let previous: LocalDate | null = null;

  for (const date of dates) {
    if (previous === null) {
      run = 1;
    } else {
      const gap = diffDays(previous, date);
      const missedDay = addDays(previous, 1);
      if (gap === 1) {
        run += 1;
      } else if (gap === 2 && graceAllowed(lastGraceDay, missedDay)) {
        lastGraceDay = missedDay;
        run += 1;
      } else {
        run = 1;
      }
    }
    longest = Math.max(longest, run);
    previous = date;
  }

  const sinceLast = diffDays(dates[dates.length - 1], today);

  // Alive if the last completion was today, or yesterday (today is still
  // open), or two days ago with yesterday's miss still bridgeable.
  const alive =
    sinceLast <= 1 || (sinceLast === 2 && graceAllowed(lastGraceDay, addDays(today, -1)));

  return { current: alive ? run : 0, longest, completedToday: sinceLast === 0 };
}
