import type { ReactNode, SVGProps } from "react";

type MotifProps = SVGProps<SVGSVGElement> & { title?: string };

function Base({ title, children, ...props }: MotifProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" role="img" aria-label={title} {...props}>
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

const stroke = {
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function MotifOpenBook(props: MotifProps) {
  return (
    <Base title="Open book" {...props}>
      <path d="M12 18h16c4 0 8 3 8 7v21c-4-3-8-4-12-4H12V18Z" {...stroke} />
      <path d="M52 18H36c-4 0-8 3-8 7v21c4-3 8-4 12-4h12V18Z" {...stroke} />
    </Base>
  );
}

export function MotifLeaningBook(props: MotifProps) {
  return (
    <Base title="Leaning book" {...props}>
      <path d="M20 14l18 4v34l-18-4V14Z" {...stroke} />
      <path d="M38 18l10-2v34l-10 2V18Z" {...stroke} />
    </Base>
  );
}

export function MotifStackedBooks(props: MotifProps) {
  return (
    <Base title="Stacked books" {...props}>
      <rect x="14" y="38" width="36" height="10" rx="2" {...stroke} />
      <rect x="16" y="28" width="32" height="10" rx="2" {...stroke} />
      <rect x="18" y="18" width="28" height="10" rx="2" {...stroke} />
    </Base>
  );
}

export function MotifBookmark(props: MotifProps) {
  return (
    <Base title="Bookmark" {...props}>
      <path d="M22 12h20v40l-10-8-10 8V12Z" {...stroke} />
    </Base>
  );
}

export function MotifGlobeBook(props: MotifProps) {
  return (
    <Base title="World book" {...props}>
      <circle cx="32" cy="30" r="16" {...stroke} />
      <path d="M16 30h32M32 14c6 6 6 26 0 32M32 14c-6 6-6 26 0 32" {...stroke} />
      <path d="M20 48h24" {...stroke} />
    </Base>
  );
}

export function MotifQuill(props: MotifProps) {
  return (
    <Base title="Quill" {...props}>
      <path d="M18 46l28-28" {...stroke} />
      <path d="M40 14l10 10-6 2-6-6 2-6Z" {...stroke} />
      <path d="M16 50l8-2" {...stroke} />
    </Base>
  );
}

export function MotifLibrary(props: MotifProps) {
  return (
    <Base title="Library" {...props}>
      <path d="M12 48h40" {...stroke} />
      <path d="M16 48V20h8v28M28 48V16h8v32M40 48V24h8v24" {...stroke} />
    </Base>
  );
}

export function MotifLantern(props: MotifProps) {
  return (
    <Base title="Lantern" {...props}>
      <path d="M26 18h12v6H26z" {...stroke} />
      <path d="M24 24h16l-2 24H26l-2-24Z" {...stroke} />
      <path d="M32 12v6" {...stroke} />
      <path d="M28 34h8" {...stroke} />
    </Base>
  );
}

export function MotifCookie(props: MotifProps) {
  return (
    <Base title="Cookie" {...props}>
      <circle cx="32" cy="32" r="16" {...stroke} />
      <circle cx="26" cy="28" r="1.5" fill="currentColor" />
      <circle cx="36" cy="26" r="1.5" fill="currentColor" />
      <circle cx="30" cy="36" r="1.5" fill="currentColor" />
      <circle cx="38" cy="36" r="1.5" fill="currentColor" />
    </Base>
  );
}

export function MotifLoaf(props: MotifProps) {
  return (
    <Base title="Loaf" {...props}>
      <path d="M14 36c0-10 8-18 18-18s18 8 18 18v8H14v-8Z" {...stroke} />
      <path d="M22 28c3-2 8-3 12-1" {...stroke} />
    </Base>
  );
}

export function MotifMuffin(props: MotifProps) {
  return (
    <Base title="Muffin" {...props}>
      <path d="M20 30c0-8 5-14 12-14s12 6 12 14" {...stroke} />
      <path d="M18 30h28l-4 18H22l-4-18Z" {...stroke} />
    </Base>
  );
}

export function MotifBrownie(props: MotifProps) {
  return (
    <Base title="Brownie" {...props}>
      <rect x="16" y="22" width="32" height="22" rx="3" {...stroke} />
      <path d="M16 33h32M32 22v22" {...stroke} />
    </Base>
  );
}

export function MotifWhisk(props: MotifProps) {
  return (
    <Base title="Whisk" {...props}>
      <path d="M32 12v18" {...stroke} />
      <path d="M22 30c0 10 4 18 10 18s10-8 10-18" {...stroke} />
      <path d="M24 34c4 2 12 2 16 0M24 40c4 2 12 2 16 0" {...stroke} />
    </Base>
  );
}

export function MotifCake(props: MotifProps) {
  return (
    <Base title="Layer cake" {...props}>
      <path d="M18 44h28v6H18z" {...stroke} />
      <path d="M20 34h24v10H20z" {...stroke} />
      <path d="M22 24h20v10H22z" {...stroke} />
      <path d="M32 14v10M28 18h8" {...stroke} />
    </Base>
  );
}

export function MotifDough(props: MotifProps) {
  return (
    <Base title="Dough" {...props}>
      <ellipse cx="32" cy="34" rx="18" ry="12" {...stroke} />
      <path d="M20 32c4 4 20 4 24 0" {...stroke} />
    </Base>
  );
}

export function MotifRoll(props: MotifProps) {
  return (
    <Base title="Cinnamon roll" {...props}>
      <circle cx="32" cy="32" r="16" {...stroke} />
      <path d="M32 32c6 0 10-4 10-8M32 32c-4 4-2 10 2 12M32 32c-6-2-10 2-8 8" {...stroke} />
    </Base>
  );
}

export function MotifCupcake(props: MotifProps) {
  return (
    <Base title="Cupcake" {...props}>
      <path d="M22 30h20l-3 18H25l-3-18Z" {...stroke} />
      <path d="M20 30c0-8 5-14 12-14s12 6 12 14" {...stroke} />
      <circle cx="32" cy="18" r="2" fill="currentColor" />
    </Base>
  );
}

export function MotifRecipe(props: MotifProps) {
  return (
    <Base title="Recipe" {...props}>
      <rect x="18" y="14" width="28" height="36" rx="3" {...stroke} />
      <path d="M24 24h16M24 32h16M24 40h10" {...stroke} />
    </Base>
  );
}

export function MotifMacaron(props: MotifProps) {
  return (
    <Base title="Macaron" {...props}>
      <path d="M16 30c0-8 7-14 16-14s16 6 16 14" {...stroke} />
      <path d="M16 34c0 8 7 14 16 14s16-6 16-14" {...stroke} />
      <path d="M16 32h32" {...stroke} />
    </Base>
  );
}

export function MotifStarter(props: MotifProps) {
  return (
    <Base title="Starter jar" {...props}>
      <path d="M24 16h16v6H24z" {...stroke} />
      <path d="M22 22h20v28H22z" {...stroke} />
      <path d="M26 34c3-4 9-4 12 0" {...stroke} />
    </Base>
  );
}

export function MotifPie(props: MotifProps) {
  return (
    <Base title="Pie" {...props}>
      <path d="M14 34h36l-4 14H18l-4-14Z" {...stroke} />
      <path d="M18 34c0-10 6-16 14-16s14 6 14 16" {...stroke} />
      <path d="M32 18v16" {...stroke} />
    </Base>
  );
}

export function MotifCandleCake(props: MotifProps) {
  return (
    <Base title="Celebration cake" {...props}>
      <path d="M18 42h28v8H18z" {...stroke} />
      <path d="M20 32h24v10H20z" {...stroke} />
      <path d="M26 20v12M32 16v16M38 20v12" {...stroke} />
      <circle cx="26" cy="18" r="1.5" fill="currentColor" />
      <circle cx="32" cy="14" r="1.5" fill="currentColor" />
      <circle cx="38" cy="18" r="1.5" fill="currentColor" />
    </Base>
  );
}

export function MotifSignature(props: MotifProps) {
  return (
    <Base title="Signature" {...props}>
      <path d="M14 40c8-12 12-4 18-10s8-2 18 8" {...stroke} />
      <path d="M18 48h28" {...stroke} />
    </Base>
  );
}

export function MotifWorldBake(props: MotifProps) {
  return (
    <Base title="World bake" {...props}>
      <circle cx="32" cy="28" r="14" {...stroke} />
      <path d="M18 28h28M32 14c5 5 5 23 0 28M32 14c-5 5-5 23 0 28" {...stroke} />
      <path d="M20 46h24v4H20z" {...stroke} />
    </Base>
  );
}

export function MotifBadgeStar(props: MotifProps) {
  return (
    <Base title="Collection badge" {...props}>
      <circle cx="32" cy="32" r="18" {...stroke} />
      <path d="M32 18l3.5 8.5H45l-7 5.5 2.5 9L32 35l-8.5 6 2.5-9-7-5.5h9.5L32 18Z" {...stroke} />
    </Base>
  );
}

export function MotifCamera(props: MotifProps) {
  return (
    <Base title="Camera" {...props}>
      <rect x="12" y="22" width="40" height="26" rx="4" {...stroke} />
      <circle cx="32" cy="35" r="8" {...stroke} />
      <path d="M22 22l4-6h12l4 6" {...stroke} />
    </Base>
  );
}

export function MotifSunrise(props: MotifProps) {
  return (
    <Base title="Sunrise" {...props}>
      <path d="M12 40h40" {...stroke} />
      <path d="M20 40a12 12 0 0 1 24 0" {...stroke} />
      <path d="M32 16v6M14 28l4 3M50 28l-4 3" {...stroke} />
    </Base>
  );
}

export function MotifReflection(props: MotifProps) {
  return (
    <Base title="Reflection" {...props}>
      <path d="M16 18h32v16H16z" {...stroke} />
      <path d="M16 38l8-4 8 6 8-8 8 6v8H16v-8Z" {...stroke} />
    </Base>
  );
}

export function MotifSilhouette(props: MotifProps) {
  return (
    <Base title="Silhouette" {...props}>
      <path d="M12 46c6-16 12-24 20-24s14 8 20 24" {...stroke} />
      <circle cx="32" cy="18" r="6" {...stroke} />
    </Base>
  );
}

export function MotifAngle(props: MotifProps) {
  return (
    <Base title="Unusual angle" {...props}>
      <path d="M14 44V20h24" {...stroke} />
      <path d="M20 38l24-24" {...stroke} />
      <circle cx="44" cy="14" r="3" {...stroke} />
    </Base>
  );
}

export function MotifMono(props: MotifProps) {
  return (
    <Base title="Black and white" {...props}>
      <circle cx="32" cy="32" r="16" {...stroke} />
      <path d="M32 16v32A16 16 0 0 0 32 16Z" fill="currentColor" />
    </Base>
  );
}

export function MotifShadow(props: MotifProps) {
  return (
    <Base title="Shadow" {...props}>
      <circle cx="26" cy="26" r="10" {...stroke} />
      <ellipse cx="40" cy="42" rx="14" ry="6" {...stroke} />
    </Base>
  );
}

export function MotifSeasons(props: MotifProps) {
  return (
    <Base title="Seasons" {...props}>
      <circle cx="22" cy="22" r="8" {...stroke} />
      <circle cx="42" cy="22" r="8" {...stroke} />
      <circle cx="22" cy="42" r="8" {...stroke} />
      <circle cx="42" cy="42" r="8" {...stroke} />
    </Base>
  );
}

export function MotifThemeSet(props: MotifProps) {
  return (
    <Base title="Photo set" {...props}>
      <rect x="14" y="18" width="18" height="14" rx="2" {...stroke} />
      <rect x="32" y="18" width="18" height="14" rx="2" {...stroke} />
      <rect x="23" y="34" width="18" height="14" rx="2" {...stroke} />
    </Base>
  );
}

export function MotifStory(props: MotifProps) {
  return (
    <Base title="Visual story" {...props}>
      <rect x="12" y="20" width="14" height="24" rx="2" {...stroke} />
      <rect x="28" y="20" width="14" height="24" rx="2" {...stroke} />
      <rect x="44" y="20" width="8" height="24" rx="2" {...stroke} />
    </Base>
  );
}

export function MotifPortfolio(props: MotifProps) {
  return (
    <Base title="Portfolio" {...props}>
      <rect x="14" y="16" width="36" height="32" rx="3" {...stroke} />
      <path d="M14 24h36" {...stroke} />
      <path d="M22 16v8M42 16v8" {...stroke} />
    </Base>
  );
}

export function MotifEmblemBookworm(props: MotifProps) {
  return (
    <Base title="Bookworm emblem" {...props}>
      <path d="M18 16h20c5 0 8 3 8 8v24c-5-3-10-4-16-4H18V16Z" {...stroke} />
      <path d="M24 26h14M24 34h10" {...stroke} />
    </Base>
  );
}

export function MotifEmblemBaker(props: MotifProps) {
  return (
    <Base title="Baker emblem" {...props}>
      <path d="M18 40c0-10 6-18 14-18s14 8 14 18" {...stroke} />
      <path d="M16 40h32v8H16z" {...stroke} />
      <path d="M32 14v8M26 18h12" {...stroke} />
    </Base>
  );
}

export function MotifEmblemPhotographer(props: MotifProps) {
  return (
    <Base title="Photographer emblem" {...props}>
      <circle cx="32" cy="34" r="10" {...stroke} />
      <rect x="12" y="22" width="40" height="28" rx="4" {...stroke} />
      <path d="M22 22l3-6h14l3 6" {...stroke} />
    </Base>
  );
}

const MOTIFS: Record<string, (props: MotifProps) => ReactNode> = {
  // Bookworm
  "open-book": MotifOpenBook,
  "leaning-book": MotifLeaningBook,
  "speech-book": MotifOpenBook,
  "bookmark-return": MotifBookmark,
  quill: MotifQuill,
  globe: MotifGlobeBook,
  lightbulb: MotifLantern,
  "book-stack": MotifStackedBooks,
  "five-spines": MotifLibrary,
  "library-arch": MotifLibrary,
  // Baker
  cookie: MotifCookie,
  loaf: MotifLoaf,
  muffin: MotifMuffin,
  whisk: MotifWhisk,
  "rolling-pin": MotifDough,
  "spiral-roll": MotifRoll,
  "layer-cake": MotifCake,
  macaron: MotifMacaron,
  boule: MotifStarter,
  toque: MotifCandleCake,
  // Photographer
  sunrise: MotifSunrise,
  reflection: MotifReflection,
  "long-shadow": MotifShadow,
  silhouette: MotifSilhouette,
  "tilted-frame": MotifAngle,
  "half-tone": MotifMono,
  "three-frames": MotifStory,
  "five-frames": MotifThemeSet,
  "four-seasons": MotifSeasons,
  aperture: MotifCamera,
  // Collection emblems
  "emblem-bookworm": MotifEmblemBookworm,
  "emblem-baker": MotifEmblemBaker,
  "emblem-photographer": MotifEmblemPhotographer,
  // Fallbacks used by older references
  brownie: MotifBrownie,
  recipe: MotifRecipe,
  cupcake: MotifCupcake,
  pie: MotifPie,
  signature: MotifSignature,
  "world-bake": MotifWorldBake,
  "badge-star": MotifBadgeStar,
  portfolio: MotifPortfolio,
};

export function AchievementMotif({
  motif,
  className,
  title,
}: {
  motif: string;
  className?: string;
  title?: string;
}) {
  const Component = MOTIFS[motif] ?? MotifBadgeStar;
  return <Component className={className} title={title} />;
}
