import { parseMemoryNote } from "@/features/daily/memory-prompts";

/** Shows a saved daily note. Labeled answers stay separate; a free sentence stays a sentence. */
export function MemoryNote({ note, quote = false }: { note: string; quote?: boolean }) {
  const details = parseMemoryNote(note);
  if (!details) {
    return quote ? (
      <p className="font-quote text-[1.125rem] italic leading-7">“{note}”</p>
    ) : (
      <p className="mt-1 text-[1.0625rem] leading-7">{note}</p>
    );
  }

  return (
    <dl className="mt-2 space-y-2">
      {details.map((detail) => (
        <div key={detail.label}>
          <dt className="text-[0.8125rem] font-medium text-ink-soft">{detail.label}</dt>
          <dd className="text-[1.0625rem] leading-7">{detail.value}</dd>
        </div>
      ))}
    </dl>
  );
}
