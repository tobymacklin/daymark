"use client";

import { useActionState, useState } from "react";
import {
  chooseHintOption,
  revealMemory,
  snoozeRecall,
  submitFreeRecall,
  type RecallState,
} from "@/app/actions/recall";
import { Button } from "@/components/ui/button";
import type { DueReview, HintOption } from "@/features/recall/service";
import { formatMedium } from "@/lib/dates";

type RecallPanelProps = {
  review: DueReview;
  hints: HintOption[];
};

const initial: RecallState = {};

export function RecallPanel({ review, hints }: RecallPanelProps) {
  const [mode, setMode] = useState<"free" | "hint">("free");
  const [freeState, freeAction, freePending] = useActionState(submitFreeRecall, initial);
  const [hintState, hintAction, hintPending] = useActionState(chooseHintOption, initial);
  const [revealState, revealAction, revealPending] = useActionState(revealMemory, initial);

  const outcome = freeState.revealed
    ? freeState
    : hintState.revealed
      ? hintState
      : revealState.revealed
        ? revealState
        : null;

  if (outcome?.revealed) {
    const tone =
      outcome.result === "remembered"
        ? "Here’s what you did — and you remembered it."
        : outcome.result === "recognized"
          ? "Here’s what you did — recognized from the hint."
          : "Here’s what you did.";
    return (
      <section className="rounded-[var(--radius-card)] bg-slate px-5 py-6 text-warm-cream shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-[0.16em] text-sage">Your week in moments</p>
        <h2 className="mt-3 font-display text-3xl leading-tight">{tone}</h2>
        <p className="mt-5 text-sm text-warm-cream/70">{formatMedium(outcome.revealed.date)}</p>
        <p className="mt-2 font-display text-2xl">{outcome.revealed.title}</p>
        <p className="mt-3 text-sm leading-6 text-warm-cream/85">{outcome.revealed.prompt}</p>
        {outcome.revealed.note ? (
          <p className="mt-4 whitespace-pre-line rounded-[var(--radius-control)] bg-white/10 px-3 py-2 text-sm leading-6">
            {outcome.revealed.note}
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <section className="rounded-[var(--radius-card)] bg-slate px-5 py-6 text-warm-cream shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.16em] text-sage">Your week in moments</p>
      <h2 className="mt-3 font-display text-3xl leading-tight">{review.question}</h2>
      <p className="mt-3 text-sm leading-6 text-warm-cream/75">
        Take a moment to remember before you look for a clue.
      </p>

      {mode === "free" ? (
        <form action={freeAction} className="mt-5 space-y-3">
          <input type="hidden" name="reviewId" value={review.id} />
          <label className="block space-y-2">
            <span className="sr-only">What you remember</span>
            <textarea
              name="response"
              rows={3}
              placeholder="Write what you remember…"
              className="w-full rounded-[var(--radius-control)] border border-white/15 bg-white/10 px-3 py-2 text-sm leading-6 text-warm-cream outline-none placeholder:text-warm-cream/45 focus:border-sage"
            />
          </label>
          <Button type="submit" disabled={freePending} className="w-full sm:w-auto">
            {freePending ? "Saving…" : "I remembered"}
          </Button>
        </form>
      ) : (
        <form action={hintAction} className="mt-5 space-y-3">
          <input type="hidden" name="reviewId" value={review.id} />
          <div className="grid gap-2">
            {hints.map((option) => (
              <button
                key={option.id}
                type="submit"
                name="optionId"
                value={option.id}
                disabled={hintPending}
                className="rounded-[var(--radius-control)] border border-white/15 bg-white/10 px-4 py-3 text-left text-sm transition-colors hover:bg-white/15 disabled:opacity-60"
              >
                {option.title}
              </button>
            ))}
          </div>
        </form>
      )}

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        {mode === "free" ? (
          <button
            type="button"
            className="underline-offset-4 hover:underline"
            onClick={() => setMode("hint")}
          >
            I would like a hint
          </button>
        ) : (
          <button
            type="button"
            className="underline-offset-4 hover:underline"
            onClick={() => setMode("free")}
          >
            Back to free recall
          </button>
        )}
        <form action={revealAction}>
          <input type="hidden" name="reviewId" value={review.id} />
          <button type="submit" disabled={revealPending} className="underline-offset-4 hover:underline">
            Reveal the memory
          </button>
        </form>
        <form action={snoozeRecall}>
          <input type="hidden" name="reviewId" value={review.id} />
          <button type="submit" className="underline-offset-4 hover:underline">
            Skip for now
          </button>
        </form>
      </div>

      {freeState.error || hintState.error || revealState.error ? (
        <p className="mt-3 text-sm text-[#f0c7c7]">
          {freeState.error || hintState.error || revealState.error}
        </p>
      ) : null}
    </section>
  );
}
