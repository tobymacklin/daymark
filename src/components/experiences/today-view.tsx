"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { completeDailyExperience, type CompleteState } from "@/app/actions/daily";
import { Button } from "@/components/ui/button";
import type { Experience } from "@/features/daily/service";
import { promptsFor } from "@/features/daily/memory-prompts";
import { MemoryNote } from "@/components/memories/memory-note";
import { experienceImage } from "@/lib/artwork";
import { addDays, weekdayIndex, weekdayName, type LocalDate } from "@/lib/dates";

type TodayViewProps = {
  dateLabel: string;
  greeting: string;
  numberLabel: string;
  date: LocalDate;
  primary: Experience;
  alternative: Experience | null;
  completed: boolean;
  note: string | null;
  memoryId: string | null;
  userPhoto: string | null;
  weekDates: string[];
  recallQuestion: string | null;
  rewardXp: number | null;
  celebrate: boolean;
  levelUpTitle: string | null;
};

function displayTitle(title: string): string {
  return title.replace(/\.$/, "");
}

function minutesLabel(experience: Experience): string {
  if (experience.minutesMin === experience.minutesMax) {
    return experience.minutesMin === 1 ? "1 min" : `${experience.minutesMin} min`;
  }
  return `${experience.minutesMin}–${experience.minutesMax} min`;
}

function costLabel(cents: number): string {
  if (cents <= 0) return "Free";
  const dollars = cents / 100;
  return dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Meta({ experience }: { experience: Experience }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.9375rem] text-ink-soft">
      <li className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
          <circle cx="12" cy="12" r="7.25" {...stroke} />
          <path d="M12 8.5V12l2.5 1.5" {...stroke} />
        </svg>
        {minutesLabel(experience)}
      </li>
      <li className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
          <path d="M5 10.5 12 5l7 5.5V19H5z" {...stroke} />
        </svg>
        {experience.setting}
      </li>
      <li className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
          <circle cx="12" cy="12" r="7.25" {...stroke} />
          <path d="M8.5 12.2 11 14.5 15.5 9.5" {...stroke} />
        </svg>
        {costLabel(experience.costCents)}
      </li>
    </ul>
  );
}

function WeekRow({ today, completed }: { today: LocalDate; completed: ReadonlySet<string> }) {
  const index = weekdayIndex(today);
  const mondayOffset = index === 0 ? -6 : 1 - index;
  const monday = addDays(today, mondayOffset);
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const count = days.filter((date) => completed.has(date)).length;

  return (
    <section className="mt-4" aria-label="Your week">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[1.25rem] font-semibold tracking-tight">Your week</h2>
        <p className="text-[0.9375rem] text-ink-soft">
          {count} {count === 1 ? "moment" : "moments"}
        </p>
      </div>
      <ol className="mt-3 grid grid-cols-7 gap-1">
        {days.map((date) => {
          const kept = completed.has(date);
          const isToday = date === today;
          return (
            <li key={date} className="text-center">
              <span className="block text-[0.875rem] text-ink-soft">{weekdayName(date).slice(0, 1)}</span>
              <span
                className={`mx-auto mt-1.5 flex h-10 w-10 items-center justify-center rounded-full text-[0.875rem] tabular ${
                  kept
                    ? "bg-action-green text-white"
                    : isToday
                      ? "bg-sage text-forest-ink ring-2 ring-action-green"
                      : "bg-sage/80 text-ink-soft"
                }`}
              >
                {kept ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                    <path d="M6 12.5 10 16.5 18 8" {...stroke} />
                  </svg>
                ) : (
                  date.slice(8).replace(/^0/, "")
                )}
                <span className="sr-only">
                  {weekdayName(date)}
                  {kept ? ", kept" : isToday ? ", today" : ""}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

const initial: CompleteState = {};

export function TodayView({
  dateLabel,
  greeting,
  numberLabel,
  date,
  primary,
  alternative,
  completed,
  note,
  memoryId,
  userPhoto,
  weekDates,
  recallQuestion,
  rewardXp,
  celebrate,
  levelUpTitle,
}: TodayViewProps) {
  const [method, setMethod] = useState<"primary" | "alternative">("primary");
  const [started, setStarted] = useState(false);
  const [state, action, pending] = useActionState(completeDailyExperience, initial);
  const active = method === "alternative" && alternative ? alternative : primary;
  const photo = userPhoto ?? experienceImage(active.slug);

  return (
    <div>
      <p className="text-[0.9375rem] text-ink-soft">{dateLabel}</p>
      <h1 className="mt-0.5 font-display text-[1.75rem] font-semibold leading-tight tracking-tight">{greeting}</h1>
      <p className="text-[1.0625rem] text-ink-soft">Make a little time for life.</p>

      <article className="mt-4 overflow-hidden rounded-2xl bg-white">
        {photo ? (
          <img
            src={photo}
            alt={userPhoto ? "Your photo of this moment" : ""}
            className="aspect-video max-h-36 w-full object-cover"
          />
        ) : null}
        <div className="px-4 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[0.875rem] text-ink-soft">{completed ? "Today’s moment" : "Today’s experience"}</p>
            <p className="text-[0.875rem] text-ink-soft">{numberLabel}</p>
          </div>
          <h2 className="mt-1 font-display text-[1.5rem] font-semibold leading-snug tracking-tight">
            {displayTitle(active.title)}
          </h2>
          <p className="mt-1 text-[1.0625rem] leading-7">{active.prompt}</p>
          <Meta experience={active} />
          {active.requiredItems.length > 0 ? (
            <p className="mt-2 text-[0.9375rem] text-ink-soft">You’ll need: {active.requiredItems.join(", ")}.</p>
          ) : null}

          {completed ? (
            <div className="mt-4">
              {note ? <MemoryNote note={note} quote /> : null}
              <div className="mt-3 flex items-center gap-3">
                <span className="check-pop flex h-10 w-10 items-center justify-center rounded-full bg-action-green text-white" aria-hidden>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.25">
                    <path d="M6 12.5 10 16.5 18 8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                  <span className="block text-[1rem] font-medium">Moment kept</span>
                  {rewardXp ? (
                    <span className={`${celebrate ? "xp-rise" : ""} block text-[0.9375rem] font-semibold text-action-green`}>
                      +{rewardXp} XP
                    </span>
                  ) : (
                    <span className="block text-[0.9375rem] text-ink-soft">Saved to your memories.</span>
                  )}
                </span>
              </div>
              {levelUpTitle ? (
                <p className="xp-rise mt-2 text-[0.9375rem] font-medium text-action-green">
                  Level reached · {levelUpTitle}
                </p>
              ) : null}
              {memoryId && !userPhoto ? (
                <Link
                  href="/memories"
                  className="mt-2 inline-flex min-h-12 items-center text-[1rem] font-semibold text-action-green underline-offset-4 hover:underline"
                >
                  Add a photo in your memories
                </Link>
              ) : null}
            </div>
          ) : !started ? (
            <div className="mt-4">
              <Button className="w-full" onClick={() => setStarted(true)}>
                Start experience
              </Button>
              {alternative ? (
                <button
                  type="button"
                  className="mx-auto mt-1 block min-h-12 px-3 text-[1rem] text-ink-soft underline-offset-4 hover:underline"
                  onClick={() => {
                    setMethod("alternative");
                    setStarted(true);
                  }}
                >
                  Choose an alternative
                </button>
              ) : null}
            </div>
          ) : (
            <form action={action} className="mt-4 space-y-3">
              <input type="hidden" name="method" value={method} />
              {method === "alternative" ? (
                <p className="text-[0.9375rem] font-medium text-action-green">Accessible alternative</p>
              ) : null}
              {active.steps.length > 0 ? (
                <ol className="space-y-1.5 text-[1.0625rem] leading-7">
                  {active.steps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="w-5 shrink-0 tabular text-ink-soft">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
              {active.accessibilityNote ? (
                <p className="rounded-xl bg-sage px-3 py-2 text-[0.9375rem] leading-6">{active.accessibilityNote}</p>
              ) : null}
              <fieldset key={active.slug} className="space-y-3">
                <legend className="text-[0.9375rem] leading-6 text-ink-soft">
                  Optional. A few details make this easier to remember later.
                </legend>
                {promptsFor(active.slug).map((prompt) => (
                  <label key={prompt.label} className="block space-y-1">
                    <span className="text-[0.9375rem] font-medium">{prompt.label}</span>
                    <input type="hidden" name="detailLabel" value={prompt.label} />
                    <input
                      name="detailValue"
                      maxLength={240}
                      className="w-full min-h-12 rounded-xl border border-forest-ink/15 bg-paper px-3 text-[1.0625rem] outline-none focus-visible:ring-2 focus-visible:ring-action-green"
                    />
                  </label>
                ))}
              </fieldset>
              {state.error ? (
                <p className="text-[0.9375rem] text-danger" role="alert">
                  {state.error}
                </p>
              ) : null}
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Saving…" : "Save this moment"}
              </Button>
              <div className="flex flex-col">
                {alternative && method === "primary" ? (
                  <button
                    type="button"
                    className="min-h-12 text-[1rem] text-action-green underline-offset-4 hover:underline"
                    onClick={() => setMethod("alternative")}
                  >
                    Choose an alternative
                  </button>
                ) : null}
                {method === "alternative" ? (
                  <button
                    type="button"
                    className="min-h-12 text-[1rem] text-action-green underline-offset-4 hover:underline"
                    onClick={() => setMethod("primary")}
                  >
                    Back to today’s experience
                  </button>
                ) : null}
                <button
                  type="button"
                  className="min-h-12 text-[1rem] text-ink-soft underline-offset-4 hover:underline"
                  onClick={() => setStarted(false)}
                >
                  Not yet
                </button>
              </div>
            </form>
          )}
        </div>
      </article>

      <WeekRow today={date} completed={new Set(weekDates)} />

      {recallQuestion ? (
        <Link
          href="/memories/recall"
          className="mt-4 flex min-h-16 items-center justify-between gap-4 rounded-2xl bg-sage px-4 py-3"
        >
          <span>
            <span className="flex items-center gap-2 text-[1rem] font-semibold text-forest-ink">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-action-green" aria-hidden>
                <path d="M7 5.5h7.2L18 9.2V18.5H7z" {...stroke} />
                <path d="M14.2 5.6V9H18" {...stroke} />
              </svg>
              Look back on a moment
            </span>
            <span className="mt-0.5 block text-[1.0625rem] leading-snug text-ink-soft">{recallQuestion}</span>
          </span>
          <span aria-hidden className="text-xl text-action-green">
            ›
          </span>
        </Link>
      ) : null}
    </div>
  );
}
