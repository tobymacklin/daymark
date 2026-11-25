import type { Rarity } from "../../../supabase/seed/collections";
import { achievementArtSrc } from "@/lib/achievement-art";
import { PinImage, type ArtworkSize } from "./pin-image";

export function AchievementArtwork({
  slug,
  title,
  size,
  earned,
  rarity,
}: {
  slug: string;
  title: string;
  size: ArtworkSize;
  earned: boolean;
  rarity?: Rarity;
}) {
  return <PinImage src={achievementArtSrc(slug)} title={title} size={size} earned={earned} rarity={rarity} />;
}
