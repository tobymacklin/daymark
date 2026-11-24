"use client";

import { useActionState, useState } from "react";
import { completeDailyExperience, type CompleteState } from "@/app/actions/daily";
import { Button } from "@/components/ui/button";
import type { Experience } from "@/features/daily/service";
import { NOTE_MAX_LENGTH } from "@/features/memories/service";

type CompleteFormProps = {
  primary: Experience;
  alternative: Experience | null;
};

const initial: CompleteState = {};

export function CompleteForm({ primary, alternative }: CompleteFormProps) {
  const [method, setMethod] = useState<"primary" | "alternative">("primary");
  const [started, setStarted] = useState(false);
  const [state, action, pending] = useActionState(completeDailyExperience, initial);

  const active = method === "alternative" && alternative ? alternative : primary;

  return (
    <div className="space-y-5">
      {!started ? (
        <div className="space-y-3">
          <Button className="w-full sm:w-auto" onClick={() => setStarted(true)}>
            Begin experience
          </Button>
          {alternative ? (
            <button
              type="button"
              className="block text-sm text-forest-ink/70 underline-offset-4 hover:underline"
              onClick={() => {
                setMethod("alternative");
                setStarted(true);
              }}
            >
              Choose an alternative
            </button>
          ) : null}
        </div>
      ) : (
        <form action={action} className="space-y-5">
          <input type="hidden" name="method" value={method} />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-forest-ink/55">
              {method === "alternative" ? "Accessible alternative" : "While you are away"}
            </p>
            <h2 className="mt-2 font-display text-2xl leading-snug">{active.title}</h2>
            <p className="mt-2 text-sm leading-6 text-forest-ink/75">{active.prompt}</p>
          </div>

          {active.steps.length > 0 ? (
            <ol className="space-y-2 text-sm leading-6 text-forest-ink/80">
              {active.steps.map((step) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-action-green" aria-hidden />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          ) : null}

          {active.requiredItems.length > 0 ? (
            <p className="text-sm text-forest-ink/70">
              Useful to have: {active.requiredItems.join(", ")}.
            </p>
          ) : (
            <p className="text-sm text-forest-ink/70">No special items required.</p>
          )}

          {active.accessibilityNote ? (
            <p className="rounded-[var(--radius-control)] bg-warm-cream px-3 py-2 text-sm text-forest-ink/80">
              {active.accessibilityNote}
            </p>
          ) : null}

          {method === "primary" && alternative ? (
            <button
              type="button"
              className="text-sm text-action-green underline-offset-4 hover:underline"
              onClick={() => setMethod("alternative")}
            >
              Switch to the alternative
            </button>
          ) : null}
          {method === "alternative" ? (
            <button
              type="button"
              className="text-sm text-action-green underline-offset-4 hover:underline"
              onClick={() => setMethod("primary")}
            >
              Back to today’s primary experience
            </button>
          ) : null}

          <label className="block space-y-2">
            <span className="text-sm font-medium">Add a note (optional)</span>
            <textarea
              name="note"
              rows={3}
              maxLength={NOTE_MAX_LENGTH}
              placeholder="A sentence about what you noticed…"
              className="w-full rounded-[var(--radius-control)] border border-border-soft bg-paper px-3 py-2 text-sm leading-6 outline-none focus:border-action-green"
            />
          </label>

          {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending ? "Saving…" : "Mark complete"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={() => setStarted(false)}
            >
              Not yet
            </Button>
          </div>
          <p className="text-xs leading-5 text-forest-ink/55">
            Leave the app while you do it. No timer, no required photo.
          </p>
        </form>
      )}
    </div>
  );
}
