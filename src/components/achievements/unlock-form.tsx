"use client";

import { useActionState } from "react";
import { unlockSelfReportedAchievement, type UnlockState } from "@/app/actions/achievements";
import { PinImage } from "@/components/achievements/pin-image";
import { Button } from "@/components/ui/button";

type UnlockFormProps = {
  achievementId: string;
  collectionSlug: string;
  disabled?: boolean;
  disabledReason?: string;
  artworkSrc: string | null;
  title: string;
  rarityLabel: string;
  xp: number;
  collectionLabel: string;
};

const initial: UnlockState = {};

export function UnlockForm({
  achievementId,
  collectionSlug,
  disabled,
  disabledReason,
  artworkSrc,
  title,
  rarityLabel,
  xp,
  collectionLabel,
}: UnlockFormProps) {
  const [state, action, pending] = useActionState(unlockSelfReportedAchievement, initial);

  if (disabled) {
    return (
      <p className="rounded-xl bg-sage px-4 py-3 text-[1rem] leading-6 text-forest-ink">
        {disabledReason ?? "This achievement is not available yet."}
      </p>
    );
  }

  if (state.created && (state.xpAwarded ?? 0) > 0) {
    return (
      <section className="check-pop rounded-2xl bg-sage px-4 py-4" aria-live="polite">
        <p className="text-[0.875rem] font-semibold tracking-wide text-action-green">Achievement earned</p>
        <div className="mt-3 flex items-center gap-4">
          <span className="check-pop">
            <PinImage src={artworkSrc} title={title} size="gallery" earned />
          </span>
          <div>
            <h2 className="font-display text-[1.35rem] font-semibold leading-tight">{title}</h2>
            <p className="mt-1 text-[1rem]">
              {rarityLabel} · <span className="xp-rise inline-block font-semibold text-action-green">+{state.xpAwarded} XP</span>
            </p>
            {typeof state.unlocked === "number" && typeof state.total === "number" ? (
              <p className="mt-1 text-[0.9375rem] text-ink-soft">
                {state.unlocked} of {state.total} in {collectionLabel}
              </p>
            ) : null}
            {state.masteryXpAwarded ? (
              <p className="mt-1 text-[0.9375rem] font-medium text-action-green">
                Collection completed · +{state.masteryXpAwarded} XP
              </p>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="achievementId" value={achievementId} />
      <input type="hidden" name="collectionSlug" value={collectionSlug} />
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Saving…" : "Mark complete"}
      </Button>
      <p className="text-[0.9375rem] leading-6 text-ink-soft">
        A photo is optional. It can support the accomplishment, and it is not required.
      </p>
      {state.error ? (
        <p className="text-[0.9375rem] text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
      <p className="text-[0.875rem] text-ink-soft">
        {rarityLabel} · {xp} XP
      </p>
    </form>
  );
}
