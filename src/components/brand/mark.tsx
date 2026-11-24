type MarkProps = {
  className?: string;
  title?: string;
};

/** Official Daymark tile: gold sun, cream horizon, on forest green. */
export function DaymarkMark({ className, title = "Daymark" }: MarkProps) {
  return (
    <img
      src="/brand/mark.png"
      alt={title}
      width={128}
      height={128}
      className={className ?? "h-8 w-8"}
    />
  );
}

export function DaymarkWordmark({ className }: { className?: string }) {
  return <span className={`font-display font-bold tracking-tight text-action-green ${className ?? ""}`}>daymark.</span>;
}
