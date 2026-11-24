import type { Rarity } from "../../../supabase/seed/collections";

const INK = "#F4EAD9";
const PLUM = "#4A2C36";
const GOLD = "#C4A15A";

type GlyphProps = { motif: string };

/** Filled central illustrations for The Bookworm. One motif, no letters. */
export function BookwormGlyph({ motif }: GlyphProps) {
  switch (motif) {
    case "leaning-book":
      return (
        <g>
          <path d="M18 14 46 22v40L18 50Z" fill={INK} />
          <path d="M46 22 58 18v40l-12 4Z" fill={GOLD} />
        </g>
      );
    case "speech-book":
      return (
        <g>
          <path d="M16 18h28v24H28l-8 8v-8h-4Z" fill={INK} />
          <path d="M22 26h16M22 34h10" stroke={PLUM} strokeWidth="2" />
        </g>
      );
    case "bookmark-return":
      return (
        <g>
          <path d="M24 10h22v46l-11-8-11 8Z" fill={INK} />
          <path d="M30 22h10" stroke={PLUM} strokeWidth="2" />
        </g>
      );
    case "quill":
      return (
        <g>
          <path d="M18 52 46 16l8 8-22 28Z" fill={INK} />
          <path d="M46 16 58 22 50 26Z" fill={GOLD} />
        </g>
      );
    case "globe":
      return (
        <g>
          <circle cx="36" cy="32" r="18" fill={INK} />
          <path d="M18 32h36M36 14c6 6 6 30 0 36M36 14c-6 6-6 30 0 36" stroke={PLUM} strokeWidth="1.6" fill="none" />
        </g>
      );
    case "lightbulb":
      return (
        <g>
          <path d="M36 12a16 16 0 0 1 8 30v6H28v-6a16 16 0 0 1 8-30Z" fill={INK} />
          <rect x="28" y="50" width="16" height="6" fill={GOLD} />
        </g>
      );
    case "book-stack":
      return (
        <g>
          <rect x="14" y="40" width="44" height="10" fill={GOLD} />
          <rect x="18" y="28" width="40" height="10" fill={INK} />
          <rect x="22" y="16" width="36" height="10" fill="#E7D3B4" />
        </g>
      );
    case "five-spines":
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={12 + i * 11} y={16 + (i % 2) * 6} width="8" height={36 - (i % 2) * 6} fill={i % 2 ? GOLD : INK} />
          ))}
        </g>
      );
    case "library-arch":
      return (
        <g>
          <path d="M12 54V28h12v26M28 54V18h16v36M48 54V26h12v28" fill={INK} />
          <path d="M10 54h52" stroke={GOLD} strokeWidth="3" />
        </g>
      );
    case "emblem-bookworm":
      return (
        <g>
          <path d="M14 16h24c8 0 14 6 14 14v28c-8-4-16-6-24-6H14Z" fill={INK} />
          <path d="M22 28h18M22 36h12" stroke={PLUM} strokeWidth="2" />
        </g>
      );
    default:
      return (
        <g>
          <path d="M12 18h22c6 0 12 5 12 12v26c-6-4-12-6-18-6H12Z" fill={INK} />
          <path d="M60 18H38c-6 0-12 5-12 12v26c6-4 12-6 18-6h16Z" fill={GOLD} />
        </g>
      );
  }
}

const FRAME: Record<Rarity, { outer: string; inner: string; label: string }> = {
  bronze: { outer: "#8C6239", inner: "#5C3E24", label: "Bronze" },
  silver: { outer: "#C5CDD6", inner: "#6E7884", label: "Silver" },
  gold: { outer: "#E0C27A", inner: "#8C6A2F", label: "Gold" },
  platinum: { outer: "#D5DEE8", inner: "#44566A", label: "Platinum" },
  legendary: { outer: "#F0D7A2", inner: "#6B3E28", label: "Legendary" },
};

export function BookwormBadge({
  motif,
  rarity,
  locked,
  title,
}: {
  motif: string;
  rarity: Rarity;
  locked: boolean;
  title: string;
}) {
  const frame = FRAME[rarity];
  return (
    <svg viewBox="0 0 120 148" role="img" aria-label={`${title}, ${frame.label}${locked ? ", locked" : ", unlocked"}`} className="h-auto w-full">
      <title>{title}</title>
      {rarity === "platinum" ? (
        <path d="M60 8 100 28v48c0 28-18 46-40 56-22-10-40-28-40-56V28Z" fill={locked ? "#2A2422" : "#3A2A30"} stroke={frame.outer} strokeWidth="3" />
      ) : rarity === "legendary" ? (
        <path d="M60 6 104 22 96 78c-4 28-20 46-36 56-16-10-32-28-36-56L16 22Z" fill={locked ? "#2A2422" : "#3A2A30"} stroke={frame.outer} strokeWidth="3" />
      ) : (
        <circle cx="60" cy="62" r="50" fill={locked ? "#2A2422" : "#3A2A30"} stroke={frame.outer} strokeWidth={rarity === "gold" ? 4 : 3} />
      )}
      {rarity === "silver" || rarity === "gold" ? (
        <circle cx="60" cy="62" r="42" fill="none" stroke={frame.inner} strokeWidth="1.25" />
      ) : null}
      {rarity === "gold" || rarity === "legendary" ? (
        <path d="M28 96c8 6 16 8 32 8s24-2 32-8" fill="none" stroke={frame.outer} strokeWidth="1.5" />
      ) : null}
      <g transform="translate(24,30)" opacity={locked ? 0.38 : 1}>
        <BookwormGlyph motif={motif} />
      </g>
      <text
        x="60"
        y="138"
        textAnchor="middle"
        fill="#182B25"
        fontSize="11"
        fontFamily="Lato, sans-serif"
        letterSpacing="1.5"
      >
        {frame.label.toUpperCase()}
      </text>
    </svg>
  );
}

export function BookwormCover() {
  return (
    <svg viewBox="0 0 360 240" className="h-auto w-full" role="img" aria-label="A reading nook: lamp, open book, and a window">
      <rect width="360" height="240" fill="#4A2C36" />
      <rect x="196" y="28" width="132" height="150" fill="#E7D7BE" />
      <rect x="208" y="42" width="108" height="92" fill="#7FA392" />
      <path d="M208 150h108" stroke="#4A2C36" strokeWidth="2" />
      <path d="M28 168h150v40H28z" fill="#2C1A20" />
      <path d="M40 168c8-28 28-46 52-46 18 0 30 10 38 24 10-20 28-32 48-24v46H40z" fill="#F4EAD9" />
      <path d="M92 122c0-22 10-36 22-36 8 0 14 6 16 14" fill="none" stroke="#E0C27A" strokeWidth="4" />
      <circle cx="118" cy="86" r="8" fill="#E0C27A" />
      <rect x="250" y="156" width="28" height="46" fill="#C4A15A" />
      <rect x="282" y="148" width="22" height="54" fill="#F4EAD9" />
    </svg>
  );
}
