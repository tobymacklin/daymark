import Link from "next/link";
import type { CollectionSummary } from "@/features/achievements/service";
import { themeColor } from "@/lib/theme";
import { AchievementMotif } from "./motifs";

export function CollectionCard({ collection }: { collection: CollectionSummary }) {
  const color = themeColor(collection.theme);
  return (
    <Link
      href={`/achieve/${collection.slug}`}
      className="group block overflow-hidden rounded-[var(--radius-card)] border border-transparent transition-transform duration-[var(--motion-fast)] hover:-translate-y-0.5 focus-visible:border-action-green"
      style={{ background: color, color: "var(--warm-cream)" }}
    >
      <div className="flex min-h-[180px] flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-warm-cream/70">
              Collection / {String(collection.number).padStart(3, "0")}
            </p>
            <h2 className="mt-2 font-display text-[28px] leading-tight">{collection.name}</h2>
            <p className="mt-2 max-w-[16rem] text-sm leading-6 text-warm-cream/85">
              {collection.tagline}
            </p>
          </div>
          <AchievementMotif
            motif={collection.emblem}
            className="h-12 w-12 shrink-0 opacity-90 transition-transform duration-[var(--motion-fast)] group-hover:scale-105"
          />
        </div>
        <p className="tabular text-sm text-warm-cream/85">
          {collection.unlocked} / {collection.total} unlocked
        </p>
      </div>
    </Link>
  );
}
