import Link from "next/link";
import { JournalList } from "@/components/memories/journal-list";
import { MonthCalendar } from "@/components/memories/month-calendar";
import { countDueReviews } from "@/features/recall/service";
import { getMemoryDatesInMonth, listMemories } from "@/features/memories/service";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { formatMonth, localDateInTimezone, yearMonthOf } from "@/lib/dates";

export const instant = false;
export const metadata = { title: "Memories" };

export default async function MemoriesPage() {
  const user = await requireUser();
  const db = await getDb();
  const today = localDateInTimezone(new Date(), user.timezone);
  const month = yearMonthOf(today);
  const [memories, markedDates, dueCount] = await Promise.all([
    listMemories(db, user.id),
    getMemoryDatesInMonth(db, user.id, month),
    countDueReviews(db, user.id, today),
  ]);

  return (
    <div>
      <h1 className="font-display text-[1.75rem] font-semibold tracking-tight">Memories</h1>
      <p className="mt-1 text-[1.0625rem] leading-7 text-ink-soft">
        A private journal of moments from Today and achievements you complete.
      </p>
      <p className="mt-3 text-[1.0625rem] leading-7">
        {dueCount > 0 ? "A moment from last week is ready to revisit." : "Nothing is waiting to revisit."}{" "}
        <Link href="/memories/recall" className="font-semibold text-action-green underline-offset-4 hover:underline">
          {dueCount > 0 ? "Start recall" : "Open recall"}
        </Link>
      </p>

      <div className="mt-6 flex items-baseline justify-between">
        <h2 className="font-display text-[1.35rem] font-semibold">{formatMonth(month)}</h2>
      </div>

      <JournalList memories={memories} />

      <details className="mt-8 rounded-2xl bg-white px-4 py-3">
        <summary className="min-h-12 cursor-pointer list-none text-[1.0625rem] font-semibold [&::-webkit-details-marker]:hidden">
          Calendar
        </summary>
        <div className="pb-2">
          <MonthCalendar month={month} markedDates={markedDates} today={today} />
        </div>
      </details>
    </div>
  );
}
