import Link from "next/link";
import type { Memory } from "@/features/memories/service";
import { formatMedium } from "@/lib/dates";

export function MemoryCard({ memory }: { memory: Memory }) {
  const sourceLabel =
    memory.source.type === "daily_experience"
      ? memory.source.category
      : memory.source.collectionName;

  return (
    <article className="rounded-[var(--radius-card)] bg-surface px-4 py-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-forest-ink/50">
            {formatMedium(memory.date)}
          </p>
          <h3 className="mt-1 font-display text-2xl leading-tight">{memory.title}</h3>
        </div>
        <span className="rounded-full bg-warm-cream px-2.5 py-1 text-xs text-forest-ink/70">
          {sourceLabel}
        </span>
      </div>
      {memory.note ? (
        <p className="mt-3 text-sm leading-6 text-forest-ink/75">{memory.note}</p>
      ) : null}
      {memory.source.type === "daily_experience" ? (
        <p className="mt-3 text-sm text-forest-ink/60">{memory.source.prompt}</p>
      ) : (
        <p className="mt-3 text-sm text-forest-ink/60">{memory.source.description}</p>
      )}
      <div className="mt-4 flex items-center justify-between text-xs text-forest-ink/55">
        <span className="tabular">+{memory.xp} XP</span>
        {memory.source.type === "achievement" ? (
          <Link
            href={`/achieve/${memory.source.collectionSlug}/${memory.source.achievementSlug}`}
            className="underline-offset-4 hover:underline"
          >
            View achievement
          </Link>
        ) : null}
      </div>
    </article>
  );
}
