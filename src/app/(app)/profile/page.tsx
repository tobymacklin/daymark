import { resetLocalProfile } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { getUserStats } from "@/features/progression/service";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { formatMedium, localDateInTimezone } from "@/lib/dates";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requireUser();
  const today = localDateInTimezone(new Date(), user.timezone);
  const joinedOn = localDateInTimezone(new Date(user.createdAt), user.timezone);
  const stats = await getUserStats(await getDb(), user.id, today, joinedOn);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.16em] text-forest-ink/50">Profile</p>
        <h1 className="mt-2 font-display text-4xl leading-tight">{user.displayName}</h1>
        <p className="mt-2 text-sm text-forest-ink/65">
          Joined {formatMedium(joinedOn)} · {user.timezone}
        </p>
      </header>

      <section className="rounded-[var(--radius-card)] bg-action-green px-5 py-6 text-warm-cream shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-[0.16em] text-sage">Level {stats.level.level}</p>
        <h2 className="mt-2 font-display text-3xl">{stats.level.title}</h2>
        <p className="mt-2 tabular text-sm text-warm-cream/80">
          {stats.level.totalXp} XP · {stats.level.xpIntoLevel}/{stats.level.xpForNextLevel} to next
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/20">
          <div
            className="h-full rounded-full bg-muted-gold"
            style={{ width: `${Math.round(stats.level.fraction * 100)}%` }}
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "Current streak", value: stats.streak.current },
          { label: "Longest streak", value: stats.streak.longest },
          { label: "Experiences", value: stats.experiencesCompleted },
          { label: "Achievements", value: stats.achievementsUnlocked },
          { label: "Collections started", value: stats.collectionsStarted },
          { label: "Days with moments", value: stats.daysWithMoments },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[var(--radius-card)] bg-surface px-4 py-4 shadow-[var(--shadow-soft)]"
          >
            <p className="tabular text-2xl font-medium">{item.value}</p>
            <p className="mt-1 text-xs text-forest-ink/60">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[var(--radius-card)] bg-warm-cream/80 px-5 py-5">
        <h2 className="font-display text-2xl">This month</h2>
        <p className="mt-2 text-sm text-forest-ink/70">
          {stats.month.completed} of {stats.month.days} days completed so far.
          Missing a day is not failure — lifetime moments still count.
        </p>
      </section>

      <section className="rounded-[var(--radius-card)] border border-border-soft px-5 py-5">
        <h2 className="font-display text-2xl">Local profile</h2>
        <p className="mt-2 text-sm leading-6 text-forest-ink/70">
          This prototype stores your session on this device only. Resetting
          deletes your local profile, memories, and progress.
        </p>
        <form action={resetLocalProfile} className="mt-4">
          <Button type="submit" variant="danger">
            Reset local profile
          </Button>
        </form>
      </section>
    </div>
  );
}
