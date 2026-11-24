import Link from "next/link";
import type { Achievement } from "@/features/achievements/service";
import { RARITY_LABEL } from "@/lib/theme";
import { AchievementBadge } from "./badge";

type AchievementTileProps = {
  achievement: Achievement;
  collectionSlug: string;
  themeColor: string;
};

export function AchievementTile({
  achievement,
  collectionSlug,
  themeColor,
}: AchievementTileProps) {
  return (
    <Link
      href={`/achieve/${collectionSlug}/${achievement.slug}`}
      className="flex items-center gap-4 rounded-[var(--radius-card)] bg-surface px-4 py-3 shadow-[var(--shadow-soft)] transition-colors duration-[var(--motion-fast)] hover:bg-warm-cream/60"
    >
      <AchievementBadge
        motif={achievement.motif}
        rarity={achievement.rarity}
        themeColor={themeColor}
        state={achievement.state}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate font-medium">{achievement.title}</h3>
          <span className="shrink-0 tabular text-xs text-forest-ink/55">
            {achievement.state === "unlocked" ? "Done" : `+${achievement.xp} XP`}
          </span>
        </div>
        <p className="mt-1 text-sm text-forest-ink/65">
          {RARITY_LABEL[achievement.rarity]}
          {achievement.state === "locked" ? " · Locked" : null}
          {achievement.state === "available" ? " · Ready" : null}
        </p>
      </div>
    </Link>
  );
}
