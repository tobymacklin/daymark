import { isLocalDate, type LocalDate } from "./dates";

/**
 * The date of daily experience No. 1.
 *
 * Daymark has not launched, so this default is a development epoch. Set
 * DAYMARK_LAUNCH_DATE (YYYY-MM-DD) to the real launch date before release.
 */
const DEFAULT_LAUNCH_DATE: LocalDate = "2026-11-01";

export function launchDate(): LocalDate {
  const configured = process.env.DAYMARK_LAUNCH_DATE;
  return configured && isLocalDate(configured) ? configured : DEFAULT_LAUNCH_DATE;
}

export const isDevelopment = process.env.NODE_ENV === "development";
