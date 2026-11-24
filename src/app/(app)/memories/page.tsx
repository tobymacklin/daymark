import Link from "next/link";
import { MemoryCard } from "@/components/memories/memory-card";
import { MonthCalendar } from "@/components/memories/month-calendar";
import {
  countMemories,
  getMemoryDatesInMonth,
  listMemories,
} from "@/features/memories/service";
import { countDueReviews } from "@/features/recall/service";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { localDateInTimezone, yearMonthOf } from "@/lib/dates";

export const metadata = { title: "Memories" };

export default async function MemoriesPage() {
  const user = await requireUser();
  const db = await getDb();
  const today = localDateInTimezone(new Date(), user.timezone);
  const month = yearMonthOf(today);
  const [memories, markedDates, total, dueCount] = await Promise.all([
    listMemories(db, user.id),
    getMemoryDatesInMonth(db, user.id, month),
    countMemories(db, user.id),
    countDueReviews(db, user.id, today),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-forest-ink/50">Remember</p>
          <h1 className="mt-2 font-display text-4xl leading-tight">Your memories</h1>
          <p className="mt-2 text-sm text-forest-ink/65">
            {total} {total === 1 ? "moment" : "moments"} · private by default
          </p>
        </div>
        {dueCount > 0 ? (
          <Link
            href="/memories/recall"
            className="rounded-full bg-slate px-4 py-2 text-sm text-warm-cream"
          >
            {dueCount} recall{dueCount === 1 ? "" : "s"} ready
          </Link>
        ) : (
          <Link
            href="/memories/recall"
            className="text-sm text-action-green underline-offset-4 hover:underline"
          >
            Try a memory recall
          </Link>
        )}
      </header>

      <MonthCalendar month={month} markedDates={markedDates} today={today} />

      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-[0.16em] text-forest-ink/50">
          Recent moments
        </h2>
        {memories.length === 0 ? (
          <p className="rounded-[var(--radius-card)] bg-warm-cream px-4 py-5 text-sm text-forest-ink/70">
            Complete today’s experience or unlock an achievement to start your archive.
          </p>
        ) : (
          memories.map((memory) => <MemoryCard key={memory.id} memory={memory} />)
        )}
      </section>
    </div>
  );
}
