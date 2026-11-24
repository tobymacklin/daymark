"use client";

import { useActionState } from "react";
import {
  unlockSelfReportedAchievement,
  type UnlockState,
} from "@/app/actions/achievements";
import { Button } from "@/components/ui/button";

type UnlockFormProps = {
  achievementId: string;
  collectionSlug: string;
  disabled?: boolean;
  disabledReason?: string;
};

const initial: UnlockState = {};

export function UnlockForm({
  achievementId,
  collectionSlug,
  disabled,
  disabledReason,
}: UnlockFormProps) {
  const [state, action, pending] = useActionState(unlockSelfReportedAchievement, initial);

  if (disabled) {
    return (
      <p className="rounded-[var(--radius-control)] bg-warm-cream px-4 py-3 text-sm text-forest-ink/75">
        {disabledReason ?? "This achievement is not available yet."}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="achievementId" value={achievementId} />
      <input type="hidden" name="collectionSlug" value={collectionSlug} />
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Saving…" : "Mark complete"}
      </Button>
      <p className="text-xs leading-5 text-forest-ink/55">
        Honor system for now. Photo assessment comes later as an optional beta.
      </p>
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {typeof state.xpAwarded === "number" && state.xpAwarded > 0 ? (
        <p className="text-sm text-action-green">
          Unlocked. +{state.xpAwarded} XP
          {state.masteryXpAwarded ? ` · Collection mastery +${state.masteryXpAwarded} XP` : ""}.
        </p>
      ) : null}
    </form>
  );
}
