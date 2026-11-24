import { CompleteForm } from "@/components/experiences/complete-form";
import { JournalToday } from "@/components/experiences/journal-today";
import { requireUser } from "@/lib/authentication/current-user";
import { launchDate } from "@/lib/config";
import { getDb } from "@/lib/database";
import { DAILY_XP, getToday } from "@/features/daily/service";
import { getDueReview } from "@/features/recall/service";
import { getCompletionDates } from "@/features/progression/service";
import { localDateInTimezone } from "@/lib/dates";

export const metadata = { title: "Today" };

type TodayPageProps = {
  searchParams: Promise<{ done?: string; xp?: string }>;
};

export default async function TodayPage({ searchParams }: TodayPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const db = await getDb();
  const now = new Date();
  const localToday = localDateInTimezone(now, user.timezone);
  const today = await getToday(db, user, now, launchDate());
  const due = await getDueReview(db, user.id, localToday);
  const completedDates = new Set(await getCompletionDates(db, user.id));

  if (!today) {
    return (
      <section>
        <h1 className="font-display text-3xl">Nothing on the page yet</h1>
        <p className="mt-3 text-sm leading-6 text-forest-ink/70">
          The edition list is still loading. Refresh in a moment.
        </p>
      </section>
    );
  }

  const completed = today.completion;
  const shown =
    completed?.method === "alternative" && today.alternative ? today.alternative : today.primary;
  const xp = params.xp ? Number(params.xp) : DAILY_XP;

  return (
    <div>
      <JournalToday
        date={today.date}
        number={today.number}
        experience={shown}
        isAlternative={completed?.method === "alternative"}
        completed={Boolean(completed)}
        note={completed?.note}
        xp={completed ? xp : undefined}
        weekDates={completedDates}
        memoryHref={completed ? "/memories" : undefined}
        recallHref={due ? "/memories/recall" : undefined}
      />
      {completed ? null : (
        <div className="mt-8 border-t border-forest-ink/10 pt-6">
          <CompleteForm primary={today.primary} alternative={today.alternative} />
        </div>
      )}
    </div>
  );
}
