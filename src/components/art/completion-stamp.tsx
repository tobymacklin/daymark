export function CompletionStamp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 88" className={className} aria-hidden>
      <circle cx="44" cy="44" r="40" fill="none" stroke="#8C3B32" strokeWidth="2" />
      <circle cx="44" cy="44" r="33" fill="none" stroke="#8C3B32" strokeWidth="1" />
      <path d="M44 22c6 8 8 14 8 20a8 8 0 1 1-16 0c0-6 2-12 8-20z" fill="#8C3B32" />
      <path d="M28 58h32" stroke="#8C3B32" strokeWidth="1.5" />
    </svg>
  );
}
