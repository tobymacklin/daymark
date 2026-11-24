"use client";

import { useActionState, useEffect, useState } from "react";
import { startOnboarding, type OnboardingState } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";

const initial: OnboardingState = {};

export function StartForm() {
  const [timezone, setTimezone] = useState("UTC");
  const [state, action, pending] = useActionState(startOnboarding, initial);

  useEffect(() => {
    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    } catch {
      setTimezone("UTC");
    }
  }, []);

  return (
    <form action={action} className="mx-auto w-full max-w-md space-y-5">
      <label className="block space-y-2">
        <span className="text-sm font-medium">What should we call you?</span>
        <input
          name="displayName"
          required
          maxLength={40}
          placeholder="Your first name is fine"
          className="w-full rounded-[var(--radius-control)] border border-border-soft bg-surface px-3 py-3 text-base outline-none focus:border-action-green"
        />
      </label>
      <input type="hidden" name="timezone" value={timezone} />
      <p className="text-sm text-forest-ink/65">
        We’ll use your local day ({timezone}) so today’s experience matches your calendar.
      </p>
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Starting…" : "Begin"}
      </Button>
    </form>
  );
}
