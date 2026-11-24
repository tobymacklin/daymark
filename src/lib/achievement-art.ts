import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/** Public file for an achievement pin, when one has been added. */
export function achievementArtSrc(slug: string): string | null {
  const dir = path.join(process.cwd(), "public", "achievements");
  if (existsSync(path.join(dir, `${slug}.webp`))) return `/achievements/${slug}.webp`;
  if (existsSync(path.join(dir, `${slug}.png`))) return `/achievements/${slug}.png`;
  return null;
}
