type RankEmblemProps = {
  level: number;
  title: string;
  face: string;
  mark: string;
  className?: string;
};

/** Profile rank shield. The number is the person’s current level. */
export function RankEmblem({ level, title, face, mark, className }: RankEmblemProps) {
  return (
    <svg
      viewBox="0 0 64 72"
      className={className ?? "h-16 w-14"}
      role="img"
      aria-label={`${title}, level ${level}`}
    >
      <path
        d="M32 4 56 12v18c0 14.5-9.2 26.4-24 34C17.2 56.4 8 44.5 8 30V12Z"
        fill={face}
        stroke={mark}
        strokeWidth="2.5"
      />
      <path
        d="M32 16.5 34.6 23l6.9.6-5.2 4.4 1.6 6.7L32 31.2l-6 3.5 1.6-6.7-5.2-4.4 6.9-.6Z"
        fill={mark}
      />
      <text
        x="32"
        y="50"
        textAnchor="middle"
        fill={mark}
        fontFamily="var(--font-manrope), sans-serif"
        fontSize="13"
        fontWeight="700"
      >
        {level}
      </text>
    </svg>
  );
}
