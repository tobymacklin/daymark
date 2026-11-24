"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { updatePersonalMemory, type MemoryEditState } from "@/app/actions/memories";
import { Button } from "@/components/ui/button";
import type { Memory } from "@/features/memories/service";
import { MemoryNote } from "@/components/memories/memory-note";
import { NOTE_MAX_LENGTH } from "@/features/memories/service";
import { hobbyName } from "@/lib/artwork";
import { formatWeekdayDate, type LocalDate } from "@/lib/dates";

const initial: MemoryEditState = {};

export function JournalList({ memories }: { memories: Memory[] }) {
  const groups: Array<{ date: LocalDate; items: Memory[] }> = [];
  for (const memory of memories) {
    const last = groups[groups.length - 1];
    if (last?.date === memory.date) last.items.push(memory);
    else groups.push({ date: memory.date, items: [memory] });
  }

  if (groups.length === 0) {
    return (
      <p className="mt-4 text-[1.0625rem] leading-7 text-ink-soft">
        Your journal starts when you keep today’s experience. Anything you write here stays private.
      </p>
    );
  }

  return (
    <div className="mt-5 space-y-6">
      {groups.map((group) => {
        const moments = group.items.filter((item) => item.source.type === "daily_experience");
        const records = group.items.filter((item) => item.source.type === "achievement");
        return (
          <section key={group.date}>
            <h2 className="text-[0.8125rem] font-medium tracking-wide text-ink-soft">
              {formatWeekdayDate(group.date).toUpperCase()}
            </h2>
            <div className="mt-2 space-y-4">
              {moments.map((memory) => (
                <Moment key={memory.id} memory={memory} />
              ))}
              {records.length > 0 ? (
                <ul className="divide-y divide-forest-ink/10">
                  {records.map((memory) => (
                    <Record key={memory.id} memory={memory} />
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Moment({ memory }: { memory: Memory }) {
  return (
    <article>
      {memory.imagePath ? (
        <img
          src={`/media/memory/${memory.id}`}
          alt="Your photo"
          className="aspect-video max-h-64 w-full rounded-2xl object-cover"
        />
      ) : null}
      <MemoryBody memory={memory} prominent />
    </article>
  );
}

function Record({ memory }: { memory: Memory }) {
  if (memory.source.type !== "achievement") return null;
  return (
    <li className="py-2">
      <MemoryBody memory={memory} prominent={false} />
      <Link
        href={`/achieve/${memory.source.collectionSlug}/${memory.source.achievementSlug}`}
        className="mt-1 inline-flex min-h-12 items-center text-[0.9375rem] text-action-green underline-offset-4 hover:underline"
      >
        {memory.source.collectionName ? hobbyName(memory.source.collectionSlug, memory.source.collectionName) : "Achievement"} achievement
      </Link>
    </li>
  );
}

function MemoryBody({ memory, prominent }: { memory: Memory; prominent: boolean }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState(updatePersonalMemory, initial);

  if (editing) {
    return (
      <form action={action} className="mt-2 space-y-3">
        <input type="hidden" name="memoryId" value={memory.id} />
        <label className="block space-y-1">
          <span className="text-[0.9375rem] font-medium">Title</span>
          <input
            name="title"
            required
            maxLength={120}
            defaultValue={memory.title.replace(/\.$/, "")}
            className="w-full min-h-12 rounded-xl border border-forest-ink/15 bg-white px-3 text-[1.0625rem] outline-none focus-visible:ring-2 focus-visible:ring-action-green"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[0.9375rem] font-medium">Date it happened</span>
          <input
            name="date"
            type="date"
            required
            defaultValue={memory.date}
            className="w-full min-h-12 rounded-xl border border-forest-ink/15 bg-white px-3 text-[1.0625rem] outline-none focus-visible:ring-2 focus-visible:ring-action-green"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[0.9375rem] font-medium">Your reflection</span>
          <textarea
            name="note"
            rows={3}
            maxLength={NOTE_MAX_LENGTH}
            defaultValue={memory.note ?? ""}
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
        {state.saved ? <p className="text-[0.9375rem] text-action-green">Saved.</p> : null}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save memory"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
            Close
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className={memory.imagePath && prominent ? "mt-3" : ""}>
      <h3 className={`font-display font-semibold leading-snug ${prominent ? "text-[1.35rem]" : "text-[1.0625rem]"}`}>
        {memory.title.replace(/\.$/, "")}
      </h3>
      {memory.note ? (
        <MemoryNote note={memory.note} />
      ) : prominent ? (
        <p className="mt-1 text-[1rem] text-ink-soft">No reflection yet.</p>
      ) : null}
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="mt-1 inline-flex min-h-12 items-center text-[1rem] font-semibold text-action-green underline-offset-4 hover:underline"
      >
        Edit memory
      </button>
    </div>
  );
}
