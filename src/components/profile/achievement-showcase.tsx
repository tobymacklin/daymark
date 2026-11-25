"use client";

import Link from "next/link";
import { useState } from "react";
import { PinImage } from "@/components/achievements/pin-image";
import { RARITY_LABEL } from "@/lib/theme";
import type { Rarity } from "../../../supabase/seed/collections";

export type ShowcaseItem = {
  slug: string;
  title: string;
  collectionSlug: string;
  rarity: Rarity;
  xp: number;
  art: string | null;
};

export function AchievementShowcase({ items }: { items: ShowcaseItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, 3);

  return (
    <section className="mt-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[1.25rem] font-semibold">Your achievements</h2>
        {items.length > 3 ? (
          <button
            type="button"
            className="min-h-12 text-[0.9375rem] font-medium text-action-green"
            aria-expanded={expanded}
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? "Show less" : "View all"}
          </button>
        ) : null}
      </div>
      {items.length === 0 ? (
        <p className="mt-2 text-[1.0625rem] text-ink-soft">Achievements you earn will show here.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-3 justify-items-center gap-x-3 gap-y-5">
          {visible.map((item) => (
            <li key={`${item.collectionSlug}-${item.slug}`} className="w-full">
              <Link
                href={`/achieve/${item.collectionSlug}/${item.slug}`}
                className="flex min-h-12 flex-col items-center text-center"
              >
                <PinImage src={item.art} title={item.title} size="profile" earned rarity={item.rarity} />
                <span className="mt-2 flex h-8 w-full items-start justify-center text-center text-[0.8125rem] leading-4 font-medium">
                  <span className="line-clamp-2">{item.title}</span>
                </span>
                <span className="mt-0.5 block text-[0.75rem] text-ink-soft">{RARITY_LABEL[item.rarity]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
