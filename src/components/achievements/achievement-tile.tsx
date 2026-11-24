import Link from "next/link";
import type { Achievement } from "@/features/achievements/service";
import { RARITY_LABEL } from "@/lib/theme";
import { AchievementArtwork } from "./achievement-artwork";

type AchievementTileProps = {
  achievement: Achievement;
  collectionSlug: string;
};

export function AchievementTile({ achievement, collectionSlug }: AchievementTileProps) {
  const status =
    achievement.state === "unlocked" ? "Done" : achievement.state === "available" ? "Ready" : "Still ahead";

  return (
    <Link
      href={`/achieve/${collectionSlug}/${achievement.slug}`}
      className="flex min-h-16 items-center gap-3 py-2"
    >
      <AchievementArtwork
        slug={achievement.slug}
        title={achievement.title}
        size="list"
        earned={achievement.state === "unlocked"}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[1.0625rem] font-medium">{achievement.title}</span>
        <span className="block text-[0.875rem] text-ink-soft">
          {RARITY_LABEL[achievement.rarity]} · {achievement.xp} XP · {status}
        </span>
      </span>
    </Link>
  );
}
