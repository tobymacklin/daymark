import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { AchievementShowcase } from "@/components/profile/achievement-showcase";
import { RankEmblem } from "@/components/progression/rank-emblem";
import { listCollections, listRecentUnlocks } from "@/features/achievements/service";
import { listMemories } from "@/features/memories/service";
import { getUserStats } from "@/features/progression/service";
import { rankColors } from "@/features/progression/levels";
import { requireUser } from "@/lib/authentication/current-user";
import { MemoryNote } from "@/components/memories/memory-note";
import { achievementArtSrc } from "@/lib/achievement-art";
import { hobbyName } from "@/lib/artwork";
import { getDb } from "@/lib/database";
import { formatMedium, formatMonth, localDateInTimezone, yearMonthOf } from "@/lib/dates";

export const instant = false;
export const metadata = { title: "You" };

export default async function ProfilePage() {
  const user = await requireUser();
  const db = await getDb();
  const today = localDateInTimezone(new Date(), user.timezone);
  const joinedOn = localDateInTimezone(new Date(user.createdAt), user.timezone);
  const [stats, memories, unlocks, collections] = await Promise.all([
    getUserStats(db, user.id, today, joinedOn),
    listMemories(db, user.id, 100),
    listRecentUnlocks(db, user.id, 24),
    listCollections(db, user.id),
  ]);
  const moments = memories.filter((memory) => memory.source.type === "daily_experience");
  const recent = moments.slice(0, 3);
  const hobbies = collections.filter((collection) => collection.unlocked > 0);
  const colors = rankColors(stats.level.title);
  const remaining = Math.max(0, stats.level.xpForNextLevel - stats.level.xpIntoLevel);
  const percent = Math.round(stats.level.fraction * 100);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-action-green" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="12" cy="9" r="3" />
              <path d="M6.5 18.5c1.1-2.5 2.9-3.7 5.5-3.7s4.4 1.2 5.5 3.7" strokeLinecap="round" />
            </svg>
          </span>
          <h1 className="font-display text-[1.65rem] font-semibold leading-tight tracking-tight">Your journey</h1>
        </div>
        <div className="flex items-center gap-1">
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center px-3 text-[1rem] font-semibold text-ink-soft"
            >
              Sign out
            </button>
          </form>
        <Link
          href="/profile/settings"
          aria-label="Settings"
          className="flex h-12 w-12 items-center justify-center rounded-full text-ink-soft"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
            <circle cx="12" cy="12" r="3" />
            <path
              strokeLinecap="round"
              d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18"
            />
          </svg>
        </Link>
        </div>
      </div>
      <p className="mt-2 text-[0.9375rem] text-ink-soft">Exploring life since {formatMonth(yearMonthOf(joinedOn))}</p>
      {user.emailAccount ? null : (
        <p className="mt-3 text-[1.0625rem] leading-7">
          <Link href="/profile/settings" className="font-medium text-action-green underline-offset-4 hover:underline">
            Add an email and password
          </Link>{" "}
          so this profile can be opened on another device.
        </p>
      )}

      <section className="mt-4 rounded-2xl bg-action-green px-4 py-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.75rem] font-semibold tracking-[0.14em]">LEVEL {stats.level.level}</p>
            <h2 className="mt-1 font-display text-[1.75rem] font-semibold leading-none">{stats.level.title}</h2>
            <p className="mt-2 text-[0.9375rem] text-white/85">
              <span className="tabular">{stats.level.totalXp.toLocaleString("en-US")}</span> lifetime XP
            </p>
          </div>
          <RankEmblem
            level={stats.level.level}
            title={stats.level.title}
            face={colors.face}
            mark={colors.mark}
            className="h-[4.5rem] w-16 shrink-0"
          />
        </div>
        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/25"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={stats.level.xpForNextLevel}
          aria-valuenow={stats.level.xpIntoLevel}
          aria-label={`${stats.level.xpIntoLevel} of ${stats.level.xpForNextLevel} XP toward the next level`}
        >
          <div
            className="bar-fill h-full rounded-full bg-muted-gold"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-2 flex items-baseline justify-between text-[0.8125rem] text-white/85">
          <p className="tabular">
            {stats.level.xpIntoLevel} / {stats.level.xpForNextLevel} XP
          </p>
          <p className="tabular">{remaining} XP to next level</p>
        </div>
      </section>

      <ul className="mt-5 grid grid-cols-3 gap-2 text-center">
        <Stat icon="book" value={moments.length} label={moments.length === 1 ? "Moment" : "Moments"} />
        <Stat icon="compass" value={hobbies.length} label={hobbies.length === 1 ? "Hobby" : "Hobbies"} />
        <Stat
          icon="ribbon"
          value={stats.achievementsUnlocked}
          label={stats.achievementsUnlocked === 1 ? "Achievement" : "Achievements"}
        />
      </ul>

      <AchievementShowcase
        items={unlocks.map((item) => ({
          ...item,
          art: achievementArtSrc(item.slug),
        }))}
      />

      {hobbies.length > 0 ? (
        <section className="mt-6">
          <h2 className="font-display text-[1.25rem] font-semibold">Your hobbies</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {hobbies.map((hobby) => (
              <li key={hobby.id}>
                <Link
                  href={`/achieve/${hobby.slug}`}
                  className={`inline-flex min-h-12 items-center rounded-full px-4 text-[1rem] font-medium ${
                    hobby.slug === "baker" ? "bg-[#F3E0D6] text-[#7A4632]" : "bg-sage text-action-green"
                  }`}
                >
                  {hobbyName(hobby.slug, hobby.name)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[1.25rem] font-semibold">Recent memories</h2>
          <Link href="/memories" className="text-[0.9375rem] font-medium text-action-green">
            Memories
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-2 text-[1.0625rem] text-ink-soft">Your moments will gather here.</p>
        ) : (
          <ul className="mt-2 divide-y divide-forest-ink/10">
            {recent.map((memory) => (
              <li key={memory.id} className="py-3">
                <p className="text-[0.75rem] font-medium tracking-wide text-ink-soft">
                  {formatMedium(memory.date).toUpperCase()}
                </p>
                <p className="mt-1 font-display text-[1.125rem] font-semibold">{memory.title.replace(/\.$/, "")}</p>
                {memory.note ? <MemoryNote note={memory.note} quote /> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: "book" | "compass" | "ribbon"; value: number; label: string }) {
  return (
    <li>
      <span className="mx-auto flex h-8 items-center justify-center text-ink-soft" aria-hidden>
        {icon === "book" ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 6.2c-2.1-1.1-4.4-1.4-7-.6v12.1c2.6-.8 4.9-.5 7 .6 2.1-1.1 4.4-1.4 7-.6V5.6c-2.6-.8-4.9-.5-7 .6z" />
            <path d="M12 6.2v12.1" />
          </svg>
        ) : icon === "compass" ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round">
            <circle cx="12" cy="12" r="7.25" />
            <path d="m14.7 9.3-1.5 4-4 1.4 1.5-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="9.5" r="4" />
            <path d="M9.1 13.2 7.8 19.2 12 16.8l4.2 2.4-1.3-6" />
          </svg>
        )}
      </span>
      <p className="font-display text-[1.5rem] font-semibold tabular leading-none">{value}</p>
      <p className="mt-1 text-[0.875rem] text-ink-soft">{label}</p>
    </li>
  );
}
