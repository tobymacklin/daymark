/**
 * Calendar-date helpers.
 *
 * Daymark's local-date policy: one experience is scheduled per calendar date,
 * and each user sees the one for the current date in their own timezone. A
 * "local date" is therefore a plain `YYYY-MM-DD` string with no time or zone
 * attached, and all arithmetic on it is done in UTC so it never drifts.
 */
export type LocalDate = string;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toUtc(date: LocalDate): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function fromUtc(date: Date): LocalDate {
  return date.toISOString().slice(0, 10);
}

export function isLocalDate(value: string): boolean {
  return DATE_PATTERN.test(value) && fromUtc(toUtc(value)) === value;
}

export function addDays(date: LocalDate, days: number): LocalDate {
  const utc = toUtc(date);
  utc.setUTCDate(utc.getUTCDate() + days);
  return fromUtc(utc);
}

/** Whole days from `from` to `to`. Positive when `to` is later. */
export function diffDays(from: LocalDate, to: LocalDate): number {
  return Math.round((toUtc(to).getTime() - toUtc(from).getTime()) / 86_400_000);
}

export function isValidTimezone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

/** The calendar date at instant `now` for someone in `timezone`. */
export function localDateInTimezone(now: Date, timezone: string): LocalDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function weekdayName(date: LocalDate): string {
  return WEEKDAYS[toUtc(date).getUTCDay()];
}

/** 0 = Sunday. */
export function weekdayIndex(date: LocalDate): number {
  return toUtc(date).getUTCDay();
}

export function dayOfMonth(date: LocalDate): number {
  return toUtc(date).getUTCDate();
}

export function monthName(date: LocalDate): string {
  return MONTHS[toUtc(date).getUTCMonth()];
}

/** "MON 23 NOV" */
export function formatStamp(date: LocalDate): string {
  const weekday = weekdayName(date).slice(0, 3);
  const month = monthName(date).slice(0, 3);
  return `${weekday} ${dayOfMonth(date)} ${month}`.toUpperCase();
}

/** Hour 0–23 in a timezone. */
export function hourInTimezone(now: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  return Number(parts.find((part) => part.type === "hour")?.value ?? 0);
}

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning.";
  if (hour < 17) return "Good afternoon.";
  return "Good evening.";
}

/** "Monday, November 23" */
export function formatWeekdayDate(date: LocalDate): string {
  return `${weekdayName(date)}, ${monthName(date)} ${dayOfMonth(date)}`;
}

/** "Monday 23 November 2026" */
export function formatLong(date: LocalDate): string {
  return `${weekdayName(date)} ${dayOfMonth(date)} ${monthName(date)} ${date.slice(0, 4)}`;
}

/** "23 November 2026" */
export function formatMedium(date: LocalDate): string {
  return `${dayOfMonth(date)} ${monthName(date)} ${date.slice(0, 4)}`;
}

// --- Months ("YYYY-MM") ------------------------------------------------------

export type YearMonth = string;

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export function isYearMonth(value: string): boolean {
  return MONTH_PATTERN.test(value);
}

export function yearMonthOf(date: LocalDate): YearMonth {
  return date.slice(0, 7);
}

export function addMonths(month: YearMonth, count: number): YearMonth {
  const [year, monthNumber] = month.split("-").map(Number);
  const utc = new Date(Date.UTC(year, monthNumber - 1 + count, 1));
  return utc.toISOString().slice(0, 7);
}

export function daysInMonth(month: YearMonth): number {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
}

/** "November 2026" */
export function formatMonth(month: YearMonth): string {
  return `${monthName(`${month}-01`)} ${month.slice(0, 4)}`;
}

// --- Daily numbering ---------------------------------------------------------

/** The first day is No. 1. Dates before launch give zero or a negative number. */
export function dailyNumber(date: LocalDate, launchDate: LocalDate): number {
  return diffDays(launchDate, date) + 1;
}

/** "NO. 048" */
export function formatDailyNumber(number: number): string {
  return `NO. ${String(number).padStart(3, "0")}`;
}
