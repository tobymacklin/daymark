const PIXELS = {
  list: 52,
  gallery: 96,
  profile: 72,
  detail: 152,
} as const;

export type ArtworkSize = keyof typeof PIXELS;

/** Displays an approved pin when `src` is set. Otherwise the slot stays empty. */
export function PinImage({
  src,
  title,
  size,
  earned = true,
}: {
  src: string | null;
  title: string;
  size: ArtworkSize;
  earned?: boolean;
}) {
  const px = PIXELS[size];
  return (
    <span className="flex shrink-0 items-center justify-center" style={{ width: px, height: px }}>
      {src ? (
        <img
          src={src}
          alt=""
          width={px}
          height={px}
          className={`h-full w-full object-contain object-center ${earned ? "" : "opacity-40"}`}
        />
      ) : (
        <span
          className="rounded-full border border-dashed border-forest-ink/25"
          style={{ width: Math.round(px * 0.86), height: Math.round(px * 0.86) }}
          role="img"
          aria-label={`${title}. Artwork has not been added yet.`}
        />
      )}
    </span>
  );
}
