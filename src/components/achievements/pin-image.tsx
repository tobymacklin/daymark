import type { CSSProperties } from "react";
import type { Rarity } from "../../../supabase/seed/collections";

export const ARTWORK_PIXELS = {
  list: 52,
  gallery: 96,
  profile: 72,
  detail: 152,
} as const;

export type ArtworkSize = keyof typeof ARTWORK_PIXELS;

const PEARL: CSSProperties = {
  backgroundImage:
    "linear-gradient(118deg, transparent 34%, rgba(255,255,255,0.15) 42%, rgba(255,255,255,0.72) 49%, rgba(176,214,255,0.55) 53%, rgba(255,196,226,0.4) 58%, transparent 70%)",
  opacity: 0.8,
};

const LEGEND_SHEEN: CSSProperties = {
  backgroundImage:
    "linear-gradient(120deg, transparent 32%, rgba(255,214,140,0.4) 44%, rgba(255,246,220,0.95) 50%, rgba(233,182,107,0.75) 57%, transparent 72%)",
  mixBlendMode: "soft-light",
};

/** Displays an approved pin when `src` is set. Otherwise the slot stays empty. */
export function PinImage({
  src,
  title,
  size,
  earned = true,
  rarity,
}: {
  src: string | null;
  title: string;
  size: ArtworkSize;
  earned?: boolean;
  rarity?: Rarity;
}) {
  const px = ARTWORK_PIXELS[size];
  const finish = src ? rarity : undefined;
  const slot: CSSProperties = {
    width: px,
    height: px,
    isolation: "isolate",
    background:
      finish === "legendary"
        ? "radial-gradient(circle, rgba(233, 182, 107, 0.62) 0%, rgba(233, 182, 107, 0) 68%)"
        : undefined,
  };
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center ${earned ? "" : "opacity-40"}`}
      data-rarity={finish}
      style={slot}
    >
      {src ? (
        <img
          src={src}
          alt=""
          width={px}
          height={px}
          className="h-full w-full object-contain object-center"
          style={
            finish === "legendary"
              ? {
                  filter:
                    "drop-shadow(0 0 1px rgba(140, 88, 28, 0.75)) drop-shadow(0 0 8px rgba(233, 182, 107, 0.95))",
                }
              : undefined
          }
        />
      ) : (
        <span
          className="rounded-full border border-dashed border-forest-ink/25"
          style={{ width: Math.round(px * 0.86), height: Math.round(px * 0.86) }}
          role="img"
          aria-label={`${title}. Artwork has not been added yet.`}
        />
      )}
      {finish === "platinum" || finish === "legendary" ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            ...(finish === "platinum" ? PEARL : LEGEND_SHEEN),
            maskImage: `url("${src}")`,
            WebkitMaskImage: `url("${src}")`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      ) : null}
    </span>
  );
}
