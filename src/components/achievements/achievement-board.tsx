"use client";

import Link from "next/link";
import { useState } from "react";
import { PinImage } from "@/components/achievements/pin-image";
import { RARITY_LABEL } from "@/lib/theme";
import type { Rarity } from "../../../supabase/seed/collections";

export type BoardItem = {
  slug: string;
  title: string;
  rarity: Rarity;
  xp: number;
  state: "unlocked" | "available" | "locked";
  art: string | null;
};

export function AchievementBoard({
  items,
  collectionSlug,
}: {
  items: BoardItem[];
  collectionSlug: string;
}) {
  const [view, setView] = useState<"list" | "gallery">("list");

  return (
    <div className="mt-4">
      <div className="flex gap-2" role="group" aria-label="Achievement layout">
        <ViewButton active={view === "list"} onClick={() => setView("list")}>
          List
        </ViewButton>
        <ViewButton active={view === "gallery"} onClick={() => setView("gallery")}>
          Gallery
        </ViewButton>
      </div>

      {view === "list" ? (
        <ul className="mt-2 divide-y divide-forest-ink/10">
          {items.map((item) => (
            <li key={item.slug}>
              <Link href={`/achieve/${collectionSlug}/${item.slug}`} className="flex min-h-16 items-center gap-3 py-2">
                <PinImage src={item.art} title={item.title} size="list" earned={item.state === "unlocked"} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[1.0625rem] font-medium">{item.title}</span>
                  <span className="block text-[0.875rem] text-ink-soft">
                    {RARITY_LABEL[item.rarity]} · {item.xp} XP
                  </span>
                </span>
                <span className="text-[0.875rem] text-ink-soft">{statusLabel(item.state)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-4 grid grid-cols-3 gap-3">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/achieve/${collectionSlug}/${item.slug}`}
                className="flex min-h-12 flex-col items-center text-center"
              >
                <PinImage src={item.art} title={item.title} size="gallery" earned={item.state === "unlocked"} />
                <span className="mt-1 block text-[0.875rem] font-medium leading-5">{item.title}</span>
                <span className="block text-[0.75rem] text-ink-soft">
                  {RARITY_LABEL[item.rarity]} · {item.xp} XP
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function statusLabel(state: BoardItem["state"]): string {
  if (state === "unlocked") return "Done";
  if (state === "available") return "Ready";
  return "Ahead";
}

function ViewButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-12 rounded-full px-4 text-[0.9375rem] font-medium ${
        active ? "bg-action-green text-white" : "bg-white text-forest-ink"
      }`}
    >
      {children}
    </button>
  );
}
