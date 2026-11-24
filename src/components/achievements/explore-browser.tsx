"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { hobbyImage, hobbyName } from "@/lib/artwork";

export type ExploreHobby = {
  slug: string;
  name: string;
  tagline: string;
  total: number;
  unlocked: number;
};

export function ExploreBrowser({ hobbies }: { hobbies: ExploreHobby[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const labels = useMemo(
    () => hobbies.map((hobby) => ({ slug: hobby.slug, label: hobbyName(hobby.slug, hobby.name) })),
    [hobbies],
  );

  const filtered = hobbies.filter((hobby) => {
    const label = hobbyName(hobby.slug, hobby.name);
    const haystack = `${label} ${hobby.name} ${hobby.tagline}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesCategory = category === "all" || hobby.slug === category;
    return matchesQuery && matchesCategory;
  });
  const started = filtered.filter((hobby) => hobby.unlocked > 0);
  const fresh = filtered.filter((hobby) => hobby.unlocked === 0);

  return (
    <div>
      <h1 className="font-display text-[1.75rem] font-semibold tracking-tight">Explore</h1>
      <p className="mt-1 text-[1.0625rem] text-ink-soft">Find something you’ll love doing.</p>

      <label className="mt-4 block">
        <span className="sr-only">Search hobbies</span>
        <span className="flex min-h-12 items-center gap-2 rounded-2xl bg-white px-4">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink-soft" aria-hidden>
            <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.75" />
            <path d="M16 16.5 20 20.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search hobbies"
            className="min-h-12 w-full bg-transparent text-[1.0625rem] outline-none placeholder:text-ink-soft"
          />
        </span>
      </label>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Hobby categories">
        <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
          All
        </FilterChip>
        {labels.map((item) => (
          <FilterChip key={item.slug} active={category === item.slug} onClick={() => setCategory(item.slug)}>
            {item.label}
          </FilterChip>
        ))}
      </div>

      {started.length > 0 ? (
        <section className="mt-5">
          <h2 className="font-display text-[1.25rem] font-semibold">Your hobbies</h2>
          <ul className="mt-2 divide-y divide-forest-ink/10">
            {started.map((hobby) => (
              <HobbyRow key={hobby.slug} hobby={hobby} />
            ))}
          </ul>
        </section>
      ) : null}

      {fresh.length > 0 ? (
        <section className="mt-6">
          <h2 className="font-display text-[1.25rem] font-semibold">Discover a new interest</h2>
          <ul className="mt-3 grid grid-cols-2 gap-3">
            {fresh.map((hobby) => (
              <DiscoverCard key={hobby.slug} hobby={hobby} />
            ))}
          </ul>
        </section>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-6 text-[1.0625rem] text-ink-soft">No hobbies match that search.</p>
      ) : null}
    </div>
  );
}

function FilterChip({
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
      className={`min-h-12 shrink-0 rounded-full px-4 text-[0.9375rem] font-medium ${
        active ? "bg-action-green text-white" : "bg-white text-forest-ink"
      }`}
    >
      {children}
    </button>
  );
}

function HobbyRow({ hobby }: { hobby: ExploreHobby }) {
  const label = hobbyName(hobby.slug, hobby.name);
  const image = hobbyImage(hobby.slug);
  const complete = hobby.unlocked >= hobby.total && hobby.total > 0;
  const width = hobby.total === 0 ? 0 : Math.round((hobby.unlocked / hobby.total) * 100);

  return (
    <li>
      <Link href={`/achieve/${hobby.slug}`} className="flex min-h-16 items-center gap-3 py-3">
        {image ? (
          <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
        ) : (
          <span className="h-16 w-16 shrink-0 rounded-xl bg-sage" aria-hidden />
        )}
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[1.125rem] font-semibold">{label}</span>
          <span className="mt-0.5 block text-[0.875rem] text-ink-soft">
            {hobby.unlocked} of {hobby.total} achievements
          </span>
          <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-sage">
            <span
              className="block h-full rounded-full"
              style={{ width: `${width}%`, background: complete ? "#294F40" : "#B86C50" }}
            />
          </span>
          {complete ? <span className="mt-1 block text-[0.875rem] font-medium text-action-green">Collection completed</span> : null}
        </span>
        <span aria-hidden className="text-xl text-ink-soft">
          ›
        </span>
      </Link>
    </li>
  );
}

function DiscoverCard({ hobby }: { hobby: ExploreHobby }) {
  const label = hobbyName(hobby.slug, hobby.name);
  const image = hobbyImage(hobby.slug);
  return (
    <li>
      <Link href={`/achieve/${hobby.slug}`} className="block overflow-hidden rounded-2xl bg-white">
        {image ? (
          <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />
        ) : (
          <span className="block aspect-[4/3] bg-sage" aria-hidden />
        )}
        <span className="block px-3 py-3">
          <span className="block font-display text-[1.05rem] font-semibold">{label}</span>
          <span className="mt-0.5 block text-[0.875rem] text-ink-soft">{hobby.total} achievements</span>
        </span>
      </Link>
    </li>
  );
}
