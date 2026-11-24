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
      <p className="mt-1 text-[1.0625rem] text-ink-soft">The moments that make up your life.</p>

      <section className="mt-4 rounded-2xl bg-sage px-4 py-4">
        <h2 className="font-display text-[1.25rem] font-semibold">
          {dueCount > 0 ? "Remember last week?" : "Look back on a moment"}
        </h2>
        <p className="mt-1 text-[1.0625rem] leading-7">
          {dueCount > 0
            ? "Take a moment to revisit your experiences."
            : "Nothing is waiting right now. You can still open recall whenever you like."}
        </p>
        <Link
          href="/memories/recall"
          className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-action-green px-4 text-[1.0625rem] font-semibold text-white"
        >
          Start memory recall
        </Link>
      </section>

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
