import type { Rarity } from "../../../supabase/seed/collections";
import { RARITY_COLOR, RARITY_LABEL } from "@/lib/theme";
import { AchievementMotif } from "./motifs";

type BadgeProps = {
  motif: string;
  rarity: Rarity;
  themeColor: string;
  state: "locked" | "available" | "unlocked";
  size?: "sm" | "md" | "lg";
  label?: string;
};

const SIZE = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-24 w-24",
};

export function AchievementBadge({
  motif,
  rarity,
  themeColor,
  state,
  size = "md",
  label,
}: BadgeProps) {
  const locked = state === "locked";
  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        className={`relative flex ${SIZE[size]} items-center justify-center rounded-full border-[3px] ${
          locked ? "opacity-55 grayscale" : ""
        }`}
        style={{
          background: locked
            ? "color-mix(in srgb, var(--charcoal) 88%, white)"
            : `color-mix(in srgb, ${themeColor} 88%, black)`,
          borderColor: locked ? "color-mix(in srgb, var(--muted-gold) 35%, transparent)" : RARITY_COLOR[rarity],
          color: locked ? "var(--sage)" : "var(--warm-cream)",
        }}
        aria-label={label ?? `${RARITY_LABEL[rarity]} badge`}
      >
        <AchievementMotif motif={motif} className="h-[70%] w-[70%]" />
        {locked ? (
          <span className="absolute -bottom-1 rounded-full bg-charcoal px-1.5 text-[10px] uppercase tracking-wide text-warm-cream">
            Locked
          </span>
        ) : null}
      </div>
    </div>
  );
}
