import { ARTWORK_PIXELS, type ArtworkSize } from "./pin-image";

/** Soft enamel fields. The gold frame stays shared; the color is the hobby. */
const ENAMEL: Record<string, { field: string; star: string }> = {
  bookworm: { field: "#b76d7c", star: "#f7eef0" },
  baker: { field: "#d4895a", star: "#fbf4ea" },
  photographer: { field: "#6f95ad", star: "#eef4f7" },
};

function enamelFor(theme: string) {
  return ENAMEL[theme] ?? { field: "#8a93a0", star: "#f4f1ea" };
}

/** Exclusive collection seal. The frame marks prestige; the enamel color is the hobby. */
export function MasterySeal({
  theme,
  size,
  earned,
}: {
  theme: string;
  size: ArtworkSize;
  earned: boolean;
}) {
  const px = ARTWORK_PIXELS[size];
  const enamel = enamelFor(theme);
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center ${earned ? "" : "opacity-40"}`}
      data-rarity="mastery"
      style={{
        width: px,
        height: px,
        isolation: "isolate",
        background: "radial-gradient(circle, rgba(233, 182, 107, 0.8) 0%, rgba(233, 182, 107, 0) 72%)",
      }}
    >
      <svg
        viewBox="0 0 96 96"
        width={px}
        height={px}
        aria-hidden
        style={{ filter: "drop-shadow(0 0 5px rgba(233, 182, 107, 0.9))" }}
      >
        <circle cx="48" cy="48" r="45" fill="#c4a15a" />
        <circle cx="48" cy="48" r="40" fill="#f7f1e4" />
        <circle cx="48" cy="48" r="35.5" fill={enamel.field} />
        <circle cx="48" cy="48" r="35.5" fill="none" stroke="#e7d7b0" strokeWidth="1.4" />
        <ellipse cx="30" cy="20" rx="9" ry="3.5" fill="#fff" opacity="0.2" />
        <path fill={enamel.star} d="M48 33 L51.18 44.82 L63 48 L51.18 51.18 L48 63 L44.82 51.18 L33 48 L44.82 44.82 Z" />
        <circle cx="48" cy="24" r="1.35" fill="#e7d3a4" />
        <circle cx="72" cy="48" r="1.35" fill="#e7d3a4" />
        <circle cx="48" cy="72" r="1.35" fill="#e7d3a4" />
        <circle cx="24" cy="48" r="1.35" fill="#e7d3a4" />
      </svg>
    </span>
  );
}
