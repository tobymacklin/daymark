import type { CollectionTheme } from "../../supabase/seed/collections";
import type { Rarity } from "../../supabase/seed/collections";

export const COLLECTION_THEME: Record<
  CollectionTheme,
  { cssVar: string; label: string }
> = {
  baker: { cssVar: "var(--theme-baker)", label: "Baker" },
  bookworm: { cssVar: "var(--theme-bookworm)", label: "Bookworm" },
  photographer: { cssVar: "var(--theme-photographer)", label: "Photographer" },
};

export const RARITY_LABEL: Record<Rarity, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
  legendary: "Legendary",
};

export const RARITY_COLOR: Record<Rarity, string> = {
  bronze: "var(--rarity-bronze)",
  silver: "var(--rarity-silver)",
  gold: "var(--rarity-gold)",
  platinum: "var(--rarity-platinum)",
  legendary: "var(--rarity-legendary)",
};

export function isCollectionTheme(value: string): value is CollectionTheme {
  return value === "baker" || value === "bookworm" || value === "photographer";
}

export function themeColor(theme: string): string {
  return isCollectionTheme(theme) ? COLLECTION_THEME[theme].cssVar : "var(--slate)";
}
