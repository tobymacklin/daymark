import Link from "next/link";
import { CompletionStamp } from "@/components/art/completion-stamp";
import { ExperiencePlate } from "@/components/art/experience-plate";
import { WeekMarks } from "@/components/art/week-marks";
import type { Experience } from "@/features/daily/service";
import { formatDailyNumber, formatStamp, type LocalDate } from "@/lib/dates";

type JournalTodayProps = {
  date: LocalDate;
  number: number;
  experience: Experience;
  isAlternative?: boolean;
  completed?: boolean;
  note?: string | null;
  xp?: number;
  weekDates: ReadonlySet<string>;
  memoryHref?: string;
  recallHref?: string;
};

export function JournalToday({
  date,
  number,
  experience,
  isAlternative,
  completed,
  note,
  xp,
  weekDates,
  memoryHref,
  recallHref,
}: JournalTodayProps) {
  const time =
    experience.minutesMin === experience.minutesMax
      ? `${experience.minutesMin} min`
      : `${experience.minutesMin}–${experience.minutesMax} min`;
  const cost = experience.costCents === 0 ? "Free" : `$${(experience.costCents / 100).toFixed(0)}`;

  return (
    <article>
      <header className="flex items-end justify-between gap-4 border-b border-forest-ink/15 pb-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-forest-ink/55">
          {formatStamp(date)}
          {isAlternative ? " · Alternative" : ""}
        </p>
        <p className="font-display text-lg tabular text-forest-ink">{formatDailyNumber(number)}</p>
      </header>

      <div className="relative mt-5 overflow-hidden">
        <ExperiencePlate category={experience.category} title={experience.title} />
        {completed ? (
          <CompletionStamp className="absolute right-3 top-3 h-16 w-16 rotate-6 opacity-90" />
        ) : null}
      </div>

      <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-forest-ink/50">{experience.category}</p>
      <h1 className="mt-2 max-w-xl font-display text-[2.35rem] leading-[1.05] tracking-tight md:text-5xl">
        {experience.title}
      </h1>
      <p className="mt-3 max-w-lg text-base leading-7 text-forest-ink/80">{experience.prompt}</p>

      <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-y border-forest-ink/10 py-3 text-sm text-forest-ink/70">
        <div>
          <dt className="sr-only">Time</dt>
          <dd>{time}</dd>
        </div>
        <div>
          <dt className="sr-only">Cost</dt>
          <dd>{cost}</dd>
        </div>
        <div>
          <dt className="sr-only">Setting</dt>
          <dd>{experience.setting}</dd>
        </div>
      </dl>

      {completed ? (
        <section className="mt-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C3B32]">Kept</p>
          <h2 className="mt-2 font-display text-3xl leading-tight">A moment kept.</h2>
          <p className="mt-2 text-sm text-forest-ink/70">
            Today is marked{typeof xp === "number" ? ` · +${xp} XP` : ""}.
          </p>
          {note ? (
            <blockquote className="mt-4 border-l-2 border-muted-gold pl-4 font-display text-xl leading-snug text-forest-ink">
              {note}
            </blockquote>
          ) : (
            <p className="mt-4 text-sm text-forest-ink/55">No note added. The day still counts.</p>
          )}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {memoryHref ? (
              <Link href={memoryHref} className="underline decoration-forest-ink/30 underline-offset-4">
                Open in the journal
              </Link>
            ) : null}
            {recallHref ? (
              <Link href={recallHref} className="underline decoration-forest-ink/30 underline-offset-4">
                A recall is waiting
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-forest-ink/50">This week</h2>
        <div className="mt-3">
          <WeekMarks today={date} completed={weekDates} />
        </div>
      </section>
    </article>
  );
}
