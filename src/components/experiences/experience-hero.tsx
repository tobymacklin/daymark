import type { Experience } from "@/features/daily/service";
import { formatDailyNumber, formatStamp, type LocalDate } from "@/lib/dates";

type ExperienceHeroProps = {
  date: LocalDate;
  number: number;
  experience: Experience;
  isAlternative?: boolean;
};

export function ExperienceHero({
  date,
  number,
  experience,
  isAlternative = false,
}: ExperienceHeroProps) {
  const timeLabel =
    experience.minutesMin === experience.minutesMax
      ? `${experience.minutesMin} min`
      : `${experience.minutesMin}–${experience.minutesMax} min`;
  const costLabel = experience.costCents === 0 ? "$0" : `$${(experience.costCents / 100).toFixed(0)}`;

  return (
    <article className="overflow-hidden rounded-[var(--radius-hero)] bg-action-green text-warm-cream shadow-[var(--shadow-soft)]">
      <div className="relative px-6 pb-8 pt-7 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 85% 15%, rgba(217,183,125,0.45), transparent 45%), radial-gradient(circle at 10% 90%, rgba(167,197,182,0.35), transparent 40%)",
          }}
          aria-hidden
        />
        <p className="relative text-xs font-medium uppercase tracking-[0.16em] text-sage">
          {formatStamp(date)} / {formatDailyNumber(number)}
          {isAlternative ? " · Alternative" : ""}
        </p>
        <h1 className="relative mt-5 font-display text-[34px] leading-[1.12] tracking-tight sm:text-[40px] sm:leading-[1.1]">
          {experience.title}
        </h1>
        <p className="relative mt-4 max-w-xl text-base leading-7 text-warm-cream/90">
          {experience.prompt}
        </p>
        <dl className="relative mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-sage">
          <div>
            <dt className="sr-only">Time</dt>
            <dd>{timeLabel}</dd>
          </div>
          <div aria-hidden>·</div>
          <div>
            <dt className="sr-only">Cost</dt>
            <dd>{costLabel}</dd>
          </div>
          <div aria-hidden>·</div>
          <div>
            <dt className="sr-only">Setting</dt>
            <dd>{experience.setting}</dd>
          </div>
          <div aria-hidden>·</div>
          <div>
            <dt className="sr-only">Category</dt>
            <dd>{experience.category}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
