/**
 * Level curve.
 *
 * Cumulative XP needed to reach level L is 60(L-1) + 10(L-1)(L-2): each level
 * costs 20 XP more than the one before (60, 80, 100, ...). With a daily
 * experience worth 20 XP that is three days to level 2, a few weeks to level
 * 10 (1,260 XP), and years of steady use to reach 100 (102,960 XP).
 */

export const LEVEL_TITLES: ReadonlyArray<{ level: number; title: string }> = [
  { level: 1, title: "Curious" },
  { level: 5, title: "Discoverer" },
  { level: 10, title: "Explorer" },
  { level: 20, title: "Adventurer" },
  { level: 35, title: "Experience Collector" },
  { level: 50, title: "Wayfinder" },
  { level: 75, title: "Life Explorer" },
  { level: 100, title: "Master of Moments" },
];

export function xpForLevel(level: number): number {
  const steps = Math.max(0, Math.floor(level) - 1);
  return 60 * steps + 10 * steps * (steps - 1);
}

export function levelForXp(xp: number): number {
  const total = Math.max(0, xp);
  // Invert 10n^2 + 50n = xp, then correct for floating point at boundaries.
  let level = Math.floor((-50 + Math.sqrt(2500 + 40 * total)) / 20) + 1;
  while (xpForLevel(level + 1) <= total) level += 1;
  while (level > 1 && xpForLevel(level) > total) level -= 1;
  return level;
}

export function titleForLevel(level: number): string {
  let title = LEVEL_TITLES[0].title;
  for (const entry of LEVEL_TITLES) {
    if (level >= entry.level) title = entry.title;
  }
  return title;
}

export type LevelProgress = {
  level: number;
  title: string;
  totalXp: number;
  /** XP earned since reaching the current level. */
  xpIntoLevel: number;
  /** XP between the current level and the next. */
  xpForNextLevel: number;
  /** 0 to 1. */
  fraction: number;
};

export function levelProgress(totalXp: number): LevelProgress {
  const level = levelForXp(totalXp);
  const floor = xpForLevel(level);
  const ceiling = xpForLevel(level + 1);
  const xpIntoLevel = Math.max(0, totalXp) - floor;
  const xpForNextLevel = ceiling - floor;
  return {
    level,
    title: titleForLevel(level),
    totalXp: Math.max(0, totalXp),
    xpIntoLevel,
    xpForNextLevel,
    fraction: xpIntoLevel / xpForNextLevel,
  };
}
