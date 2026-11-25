"use client";

import Link from "next/link";
import { useState } from "react";
import { MasterySeal } from "@/components/achievements/mastery-seal";
import { PinImage } from "@/components/achievements/pin-image";
import { RARITY_LABEL, RARITY_ORDER } from "@/lib/theme";
import type { Rarity } from "../../../supabase/seed/collections";

export type BoardItem = {
  slug: string;
  title: string;
  rarity: Rarity;
  xp: number;
  state: "unlocked" | "available" | "locked";
  art: string | null;
};

export type BoardMastery = {
  title: string;
  xp: number;
  earned: boolean;
  theme: string;
};

export function AchievementBoard({
  items,
  collectionSlug,
  unlocked,
  total,
  mastery,
}: {
  items: BoardItem[];
  collectionSlug: string;
  unlocked: number;
  total: number;
  mastery: BoardMastery;
}) {
  const [view, setView] = useState<"list" | "gallery">("list");
  const groups = rarityGroups(items);
  const complete = total > 0 && unlocked >= total;
  const width = total === 0 ? 0 : Math.round((unlocked / total) * 100);

  return (
    <div className="mt-4">
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[0.9375rem] font-medium">Collection progress</h2>
          <p className="text-[0.875rem] text-ink-soft">
            <span className="tabular">
              {unlocked} of {total}
            </span>
            {complete ? " · Completed" : ""}
          </p>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-sage"
          role="progressbar"
          aria-valuenow={unlocked}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuetext={`${unlocked} of ${total} achievements`}
          aria-label="Collection progress"
        >
          <div className="bar-fill h-full rounded-full bg-action-green" style={{ width: `${width}%` }} />
        </div>
      </div>

      <div className="mt-4 flex gap-2" role="group" aria-label="Achievement layout">
        <ViewButton active={view === "list"} onClick={() => setView("list")}>
          List
        </ViewButton>
        <ViewButton active={view === "gallery"} onClick={() => setView("gallery")}>
          Gallery
        </ViewButton>
      </div>

      {view === "list" ? (
        <>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1" aria-label="Completion by rarity">
            {groups.map((group) => (
              <div key={group.rarity} className="flex items-baseline justify-between gap-2 text-[0.875rem]">
                <dt>{RARITY_LABEL[group.rarity]}</dt>
                <dd className="tabular text-ink-soft">
                  {group.unlocked} of {group.total}
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-2 text-[0.875rem]">
              <dt>Mastery</dt>
              <dd className="tabular text-ink-soft">{mastery.earned ? "1 of 1" : "0 of 1"}</dd>
            </div>
          </dl>
          <ul className="mt-2 divide-y divide-forest-ink/10">
            {items.map((item) => (
              <li key={item.slug}>
                <AchievementRow item={item} collectionSlug={collectionSlug} />
              </li>
            ))}
            <li>
              <MasteryRow mastery={mastery} collectionSlug={collectionSlug} />
            </li>
          </ul>
        </>
      ) : (
        <div className="mt-4 space-y-6">
          {groups.map((group) => (
            <section key={group.rarity} aria-labelledby={`rarity-${group.rarity}`}>
              <h3 id={`rarity-${group.rarity}`} className="flex items-baseline justify-between gap-3">
                <span className="font-display text-[1.125rem] font-semibold">{RARITY_LABEL[group.rarity]}</span>
                <span className="text-[0.875rem] font-normal text-ink-soft tabular">
                  {group.unlocked} of {group.total}
                </span>
              </h3>
              <ul className="mt-3 grid grid-cols-3 gap-x-2 gap-y-5">
                {group.items.map((item) => (
                  <li key={item.slug} className="min-w-0">
                    <GalleryCard item={item} collectionSlug={collectionSlug} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <section aria-labelledby="rarity-mastery">
            <h3 id="rarity-mastery" className="flex items-baseline justify-between gap-3">
              <span className="font-display text-[1.125rem] font-semibold">Mastery</span>
              <span className="text-[0.875rem] font-normal text-ink-soft tabular">
                {mastery.earned ? "1 of 1" : "0 of 1"}
              </span>
            </h3>
            <ul className="mt-3 grid grid-cols-3 gap-x-2 gap-y-5">
              <li className="min-w-0">
                <Link
                  href={`/achieve/${collectionSlug}/mastery`}
                  className="flex h-full min-h-12 w-full flex-col items-center text-center"
                >
                  <MasterySeal theme={mastery.theme} size="gallery" earned={mastery.earned} />
                  <GalleryTitle>{mastery.title}</GalleryTitle>
                  <XpLine label="Mastery" xp={mastery.xp} />
                </Link>
              </li>
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}

function rarityGroups(items: BoardItem[]) {
  return RARITY_ORDER.map((rarity) => {
    const group = items.filter((item) => item.rarity === rarity);
    return {
      rarity,
      items: group,
      total: group.length,
      unlocked: group.filter((item) => item.state === "unlocked").length,
    };
  }).filter((group) => group.total > 0);
}

function AchievementRow({ item, collectionSlug }: { item: BoardItem; collectionSlug: string }) {
  return (
    <Link href={`/achieve/${collectionSlug}/${item.slug}`} className="flex min-h-16 items-center gap-3 py-2">
      <PinImage src={item.art} title={item.title} size="list" earned={item.state === "unlocked"} rarity={item.rarity} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[1.0625rem] font-medium">{item.title}</span>
        <XpLine label={RARITY_LABEL[item.rarity]} xp={item.xp} />
      </span>
      <span className="text-[0.875rem] text-ink-soft">{statusLabel(item.state)}</span>
    </Link>
  );
}

function MasteryRow({ mastery, collectionSlug }: { mastery: BoardMastery; collectionSlug: string }) {
  return (
    <Link href={`/achieve/${collectionSlug}/mastery`} className="flex min-h-16 items-center gap-3 py-2">
      <MasterySeal theme={mastery.theme} size="list" earned={mastery.earned} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[1.0625rem] font-medium">{mastery.title}</span>
        <XpLine label="Mastery" xp={mastery.xp} />
      </span>
      <span className="text-[0.875rem] text-ink-soft">{mastery.earned ? "Done" : "Ahead"}</span>
    </Link>
  );
}

function GalleryCard({ item, collectionSlug }: { item: BoardItem; collectionSlug: string }) {
  return (
    <Link
      href={`/achieve/${collectionSlug}/${item.slug}`}
      className="flex h-full min-h-12 w-full flex-col items-center text-center"
    >
      <PinImage src={item.art} title={item.title} size="gallery" earned={item.state === "unlocked"} rarity={item.rarity} />
      <GalleryTitle>{item.title}</GalleryTitle>
      <XpLine label={RARITY_LABEL[item.rarity]} xp={item.xp} compact />
    </Link>
  );
}

function GalleryTitle({ children }: { children: string }) {
  return (
    <span className="mt-2 flex h-10 w-full items-start justify-center text-[0.875rem] leading-5 font-medium">
      <span className="line-clamp-2">{children}</span>
    </span>
  );
}

function XpLine({ label, xp, compact = false }: { label: string; xp: number; compact?: boolean }) {
  return (
    <span className={`block w-full text-ink-soft ${compact ? "text-[0.75rem] leading-4" : "text-[0.875rem]"}`}>
      {label}
      <span className="whitespace-nowrap tabular"> · {xp} XP</span>
    </span>
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
