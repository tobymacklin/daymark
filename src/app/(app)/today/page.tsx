import { TodayView } from "@/components/experiences/today-view";
import { requireUser } from "@/lib/authentication/current-user";
import { launchDate } from "@/lib/config";
import { getDb } from "@/lib/database";
import { DAILY_XP, getToday } from "@/features/daily/service";
import { getMemory } from "@/features/memories/service";
import { getDueReview } from "@/features/recall/service";
import { getCompletionDates, getUserStats } from "@/features/progression/service";
import { levelForXp } from "@/features/progression/levels";
import { formatWeekdayDate, greetingForHour, hourInTimezone, localDateInTimezone } from "@/lib/dates";

export const instant = false;
export const metadata = { title: "Today" };

type TodayPageProps = {
  searchParams: Promise<{ xp?: string }>;
};

export default async function TodayPage({ searchParams }: TodayPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const db = await getDb();
  const now = new Date();
  const localToday = localDateInTimezone(now, user.timezone);
  const today = await getToday(db, user, now, launchDate());
  const due = await getDueReview(db, user.id, localToday);
  const completedDates = await getCompletionDates(db, user.id);

  if (!today) {
    return (
      <section>
        <h1 className="font-display text-[32px] font-semibold">Nothing scheduled yet</h1>
        <p className="mt-3 text-[17px] leading-7 text-ink-soft">The day’s experience is still loading. Refresh in a moment.</p>
      </section>
    );
  }

  const completed = today.completion;
  const kept = completed ? await getMemory(db, user.id, completed.memoryId) : null;
  const keptAlternative = completed?.method === "alternative" && today.alternative ? today.alternative : null;
  const awarded = Number(params.xp);
  const celebrate = Number.isFinite(awarded) && awarded > 0;
  let levelUpTitle: string | null = null;
  if (celebrate) {
    const stats = await getUserStats(db, user.id, localToday, localDateInTimezone(new Date(user.createdAt), user.timezone));
    const before = levelForXp(stats.level.totalXp - awarded);
    if (before < stats.level.level) levelUpTitle = stats.level.title;
  }

  return (
    <TodayView
      dateLabel={formatWeekdayDate(today.date)}
      greeting={greetingForHour(hourInTimezone(now, user.timezone))}
      numberLabel={`No. ${String(today.number).padStart(3, "0")}`}
      date={today.date}
      primary={keptAlternative ?? today.primary}
      alternative={completed ? null : today.alternative}
      completed={Boolean(completed)}
      note={kept?.note ?? completed?.note ?? null}
      memoryId={completed?.memoryId ?? null}
      userPhoto={kept?.imagePath ? `/media/memory/${kept.id}` : null}
      weekDates={completedDates}
      recallQuestion={due?.question ?? null}
      rewardXp={completed ? DAILY_XP : null}
      celebrate={celebrate}
      levelUpTitle={levelUpTitle}
    />
  );
}
