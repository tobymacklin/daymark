"use client";

import { useActionState } from "react";
import { updatePersonalMemory, type MemoryEditState } from "@/app/actions/memories";
import { Button } from "@/components/ui/button";
import { NOTE_MAX_LENGTH } from "@/features/memories/service";

const initial: MemoryEditState = {};

export function AchievementPhotoForm({
  memoryId,
  title,
  date,
  note,
}: {
  memoryId: string;
  title: string;
  date: string;
  note: string;
}) {
  const [state, action, pending] = useActionState(updatePersonalMemory, initial);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="memoryId" value={memoryId} />
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="date" value={date} />
      <label className="block space-y-1">
        <span className="text-[0.9375rem] font-medium">
          Note <span className="font-normal text-ink-soft">optional</span>
        </span>
        <textarea
          name="note"
          rows={3}
          maxLength={NOTE_MAX_LENGTH}
          defaultValue={note}
          className="w-full rounded-xl border border-forest-ink/15 bg-white px-3 py-2 text-[1.0625rem] leading-7 outline-none focus-visible:ring-2 focus-visible:ring-action-green"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-[0.9375rem] font-medium">Photo</span>
        <input
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-[0.9375rem] file:mr-3 file:min-h-12 file:rounded-xl file:border-0 file:bg-sage file:px-4 file:font-semibold file:text-action-green"
        />
      </label>
      {state.error ? (
        <p className="text-[0.9375rem] text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.saved ? <p className="text-[0.9375rem] text-action-green">Saved with this achievement.</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Add photo"}
      </Button>
    </form>
  );
}
