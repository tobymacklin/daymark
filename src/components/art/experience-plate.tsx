/**
 * Original field-journal plates for the daily edition.
 * Flat color, a few shapes, one subject. Not a photograph and not a stock icon.
 */

type PlateProps = { category: string; title: string };

export function ExperiencePlate({ category, title }: PlateProps) {
  const kind = plateKind(category);
  return (
    <svg
      viewBox="0 0 360 220"
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
      className="h-44 w-full md:h-56"
    >
      <title>{title}</title>
      {kind === "observe" ? <ObservePlate /> : null}
      {kind === "make" ? <MakePlate /> : null}
      {kind === "listen" ? <ListenPlate /> : null}
      {kind === "read" ? <ReadPlate /> : null}
      {kind === "outside" ? <OutsidePlate /> : null}
      {kind === "remember" ? <RememberPlate /> : null}
    </svg>
  );
}

function plateKind(category: string): "observe" | "make" | "listen" | "read" | "outside" | "remember" {
  const value = category.toLowerCase();
  if (["photography", "discovery", "observation", "exploration"].includes(value)) return "observe";
  if (["creativity", "imagination", "problem-solving"].includes(value)) return "make";
  if (["music", "sensory"].includes(value)) return "listen";
  if (["learning"].includes(value)) return "read";
  if (["nature", "movement"].includes(value)) return "outside";
  return "remember";
}

function ObservePlate() {
  return (
    <g>
      <rect width="360" height="220" fill="#243F36" />
      <rect x="0" y="150" width="360" height="70" fill="#1B312A" />
      <rect x="48" y="78" width="92" height="72" rx="2" fill="#E7D7BE" />
      <circle cx="78" cy="108" r="6" fill="#243F36" />
      <circle cx="108" cy="108" r="6" fill="#243F36" />
      <path d="M74 126c10 8 22 8 34 0" fill="none" stroke="#243F36" strokeWidth="3" />
      <path d="M168 96h70v54h-70z" fill="#C4A15A" />
      <circle cx="190" cy="118" r="5" fill="#243F36" />
      <circle cx="214" cy="118" r="5" fill="#243F36" />
      <rect x="196" y="134" width="16" height="3" fill="#243F36" />
      <path d="M250 70c28 0 46 22 46 48v32h-78V108c0-22 14-38 32-38z" fill="#A7C5B6" />
      <circle cx="268" cy="112" r="4" fill="#182B25" />
      <circle cx="286" cy="114" r="4" fill="#182B25" />
      <path d="M270 128h16" stroke="#182B25" strokeWidth="2" />
    </g>
  );
}

function MakePlate() {
  return (
    <g>
      <rect width="360" height="220" fill="#3E2A32" />
      <rect x="0" y="156" width="360" height="64" fill="#2C1D23" />
      <path d="M70 150 150 70l18 14-62 78z" fill="#F4EAD9" />
      <path d="M150 70l40 8-22 28z" fill="#D9B77D" />
      <rect x="196" y="92" width="110" height="72" fill="#F4EAD9" />
      <path d="M210 112h80M210 128h64M210 144h48" stroke="#3E2A32" strokeWidth="2" />
    </g>
  );
}

function ListenPlate() {
  return (
    <g>
      <rect width="360" height="220" fill="#2A3544" />
      <circle cx="180" cy="112" r="54" fill="#1E2833" />
      <circle cx="180" cy="112" r="18" fill="#D9B77D" />
      <path d="M70 150c20-28 40-28 60 0s40 28 60 0 40-28 60 0 40 28 50 8" fill="none" stroke="#A7C5B6" strokeWidth="3" />
    </g>
  );
}

function ReadPlate() {
  return (
    <g>
      <rect width="360" height="220" fill="#4A2C36" />
      <path d="M70 48h100c16 0 28 10 28 24v100c-16-10-32-14-52-14H70V48z" fill="#F4EAD9" />
      <path d="M290 48H190c-16 0-28 10-28 24v100c16-10 32-14 52-14h76V48z" fill="#E7D3B4" />
      <path d="M92 78h70M92 98h58M92 118h64" stroke="#4A2C36" strokeWidth="2" />
    </g>
  );
}

function OutsidePlate() {
  return (
    <g>
      <rect width="360" height="220" fill="#E7C98A" />
      <path d="M0 150 80 78l54 48 46-62 70 70 40-28 70 44v70H0z" fill="#2F5946" />
      <path d="M0 176h360v44H0z" fill="#1E3B30" />
      <circle cx="274" cy="52" r="18" fill="#F4EAD9" />
    </g>
  );
}

function RememberPlate() {
  return (
    <g>
      <rect width="360" height="220" fill="#314B43" />
      <rect x="118" y="36" width="124" height="148" fill="#F4EAD9" />
      <rect x="132" y="52" width="96" height="72" fill="#A7C5B6" />
      <path d="M132 150h96M132 164h70" stroke="#314B43" strokeWidth="2" />
    </g>
  );
}
