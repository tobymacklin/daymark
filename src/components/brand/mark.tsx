type MarkProps = {
  className?: string;
  title?: string;
};

/** Horizon-dot mark from the Design Bible. */
export function DaymarkMark({ className, title = "Daymark" }: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        d="M4 20.5c4.2-3.4 8.8-5.1 12-5.1s7.8 1.7 12 5.1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="16" cy="11.5" r="2.4" fill="currentColor" />
    </svg>
  );
}

export function DaymarkWordmark({ className }: { className?: string }) {
  return (
    <span className={`font-display tracking-tight ${className ?? ""}`}>
      daymark<span className="text-muted-gold">.</span>
    </span>
  );
}
