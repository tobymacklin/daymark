"use client";

import Link from "next/link";
import { useActionState } from "react";
import { unlockSelfReportedAchievement, type UnlockState } from "@/app/actions/achievements";
import { PinImage } from "@/components/achievements/pin-image";
import { Button } from "@/components/ui/button";
import { NOTE_MAX_LENGTH } from "@/features/memories/service";
import type { Rarity } from "../../../supabase/seed/collections";

type UnlockFormProps = {
  achievementId: string;
  collectionSlug: string;
  disabled?: boolean;
  disabledReason?: string;
  artworkSrc: string | null;
  title: string;
  rarity?: Rarity;
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
  rarity,
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
            <PinImage src={artworkSrc} title={title} size="gallery" earned rarity={rarity} />
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
                <Link href={`/achieve/${collectionSlug}/mastery`} className="underline underline-offset-4">
                  {collectionLabel} Mastery
                </Link>{" "}
                earned
                <span className="whitespace-nowrap"> · +{state.masteryXpAwarded} XP</span>
              </p>
            ) : null}
          </div>
        </div>
        {state.photoSaved && state.memoryId ? (
          <img
            src={`/media/memory/${state.memoryId}`}
            alt={`Your photo for ${title}`}
            className="mt-4 aspect-video max-h-64 w-full rounded-2xl object-cover"
          />
        ) : null}
        {state.error ? (
          <p className="mt-3 text-[0.9375rem] text-danger" role="alert">
            {state.error}
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="achievementId" value={achievementId} />
      <input type="hidden" name="collectionSlug" value={collectionSlug} />
      <label className="block space-y-1">
        <span className="text-[0.9375rem] font-medium">
          Note <span className="font-normal text-ink-soft">optional</span>
        </span>
        <textarea
          name="note"
          rows={3}
          maxLength={NOTE_MAX_LENGTH}
          className="w-full rounded-xl border border-forest-ink/15 bg-white px-3 py-2 text-[1.0625rem] leading-7 outline-none focus-visible:ring-2 focus-visible:ring-action-green"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-[0.9375rem] font-medium">
          Photo <span className="font-normal text-ink-soft">optional</span>
        </span>
        <input
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-[0.9375rem] file:mr-3 file:min-h-12 file:rounded-xl file:border-0 file:bg-sage file:px-4 file:font-semibold file:text-action-green"
        />
      </label>
      <p className="text-[0.9375rem] leading-6 text-ink-soft">
        A photo and a note can support the accomplishment. Neither is required.
      </p>
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Saving…" : "Mark complete"}
      </Button>
      {state.error ? (
        <p className="text-[0.9375rem] text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
      <p className="text-[0.875rem] text-ink-soft">
        {rarityLabel}
        <span className="whitespace-nowrap tabular"> · {xp} XP</span>
      </p>
    </form>
  );
}
