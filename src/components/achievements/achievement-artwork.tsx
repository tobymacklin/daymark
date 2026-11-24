import { achievementArtSrc } from "@/lib/achievement-art";
import { PinImage, type ArtworkSize } from "./pin-image";

export function AchievementArtwork({
  slug,
  title,
  size,
  earned,
}: {
  slug: string;
  title: string;
  size: ArtworkSize;
  earned: boolean;
}) {
  return <PinImage src={achievementArtSrc(slug)} title={title} size={size} earned={earned} />;
}
