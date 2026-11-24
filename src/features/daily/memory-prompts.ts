/**
 * Optional questions asked when a daily experience is saved.
 * The first prompt marked `ask` is the detail recall can ask about later.
 * Alternatives use the slug `{experience}--alternative`.
 */

export type MemoryPrompt = {
  label: string;
  /** When this answer was saved, recall can ask about it. */
  ask?: boolean;
};

const PROMPTS: Record<string, MemoryPrompt[]> = {
  "the-ordinary-reimagined": [
    { label: "Object", ask: true },
    { label: "What you noticed" },
  ],
  "the-ordinary-reimagined--alternative": [
    { label: "Object", ask: true },
    { label: "What surprised you" },
  ],
  "a-face-in-the-ordinary": [
    { label: "What you found", ask: true },
    { label: "Where it was" },
  ],
  "a-face-in-the-ordinary--alternative": [
    { label: "Object", ask: true },
    { label: "Its personality" },
  ],
  "a-song-older-than-you-remember": [
    { label: "Song", ask: true },
    { label: "Artist" },
    { label: "What you thought" },
  ],
  "a-song-older-than-you-remember--alternative": [
    { label: "What you found", ask: true },
    { label: "The year" },
  ],
  "six-words-one-life": [{ label: "Your six words" }],
  "six-words-one-life--alternative": [{ label: "Your six words" }],
  "where-did-this-come-from": [
    { label: "Object", ask: true },
    { label: "How it became yours" },
  ],
  "where-did-this-come-from--alternative": [
    { label: "Object", ask: true },
    { label: "Where it went" },
  ],
  "the-other-hand": [{ label: "How it felt" }],
  "the-other-hand--alternative": [{ label: "Your five words" }],
  "the-window-you-stopped-seeing": [{ label: "What you noticed" }],
  "the-window-you-stopped-seeing--alternative": [{ label: "What you noticed" }],
  "a-handshake-nobody-knows": [
    { label: "The greeting" },
    { label: "Person", ask: true },
  ],
  "a-handshake-nobody-knows--alternative": [{ label: "The greeting" }],
  "cleared-for-takeoff": [{ label: "How it flew" }],
  "cleared-for-takeoff--alternative": [
    { label: "The aircraft" },
    { label: "What it does" },
  ],
  "three-of-a-kind": [
    { label: "The connection" },
    { label: "The three things" },
  ],
  "three-of-a-kind--alternative": [
    { label: "The connection" },
    { label: "The three places" },
  ],
  "two-minutes-of-listening": [{ label: "What you heard" }],
  "two-minutes-of-listening--alternative": [{ label: "What you touched" }],
  "the-secret-life-of-a-stapler": [
    { label: "Object", ask: true },
    { label: "Its name" },
    { label: "Its story" },
  ],
  "the-secret-life-of-a-stapler--alternative": [
    { label: "The sound" },
    { label: "Its name" },
  ],
  "hello-again": [
    { label: "Language", ask: true },
    { label: "How you said hello" },
  ],
  "hello-again--alternative": [
    { label: "Language", ask: true },
    { label: "How hello is written" },
  ],
  "a-small-scene-from-long-ago": [{ label: "The memory" }],
  "a-small-scene-from-long-ago--alternative": [{ label: "The memory" }],
  "chapter-one": [{ label: "The opening line" }],
  "chapter-one--alternative": [
    { label: "The title" },
    { label: "The blurb" },
  ],
  "a-photo-you-forgot-you-had": [
    { label: "Who is in it" },
    { label: "The story" },
  ],
  "a-photo-you-forgot-you-had--alternative": [{ label: "What is in the frame" }],
  "a-gallery-of-five": [
    { label: "The title" },
    { label: "What you used" },
  ],
  "a-gallery-of-five--alternative": [
    { label: "The title" },
    { label: "The five things" },
  ],
  "dear-later": [{ label: "Your message" }],
  "dear-later--alternative": [{ label: "Your message" }],
  "four-lines-entirely-yours": [{ label: "Your poem" }],
  "four-lines-entirely-yours--alternative": [{ label: "Your rhyme" }],
  "five-minutes-with-the-overlooked": [
    { label: "Object", ask: true },
    { label: "What you noticed" },
  ],
  "five-minutes-with-the-overlooked--alternative": [{ label: "What you attended to" }],
  "todays-sky-reported": [{ label: "Your report" }],
  "todays-sky-reported--alternative": [{ label: "Your forecast" }],
  "a-thank-you-overdue": [
    { label: "Person", ask: true },
    { label: "What you thanked them for" },
  ],
  "a-thank-you-overdue--alternative": [
    { label: "Object", ask: true },
    { label: "What it does for you" },
  ],
  "the-map-in-your-head": [
    { label: "Place", ask: true },
    { label: "The spot that mattered" },
  ],
  "the-map-in-your-head--alternative": [{ label: "Place", ask: true }],
  "the-oldest-thing-here": [
    { label: "Object", ask: true },
    { label: "How old it might be" },
  ],
  "the-oldest-thing-here--alternative": [
    { label: "Object", ask: true },
    { label: "Where you held it" },
  ],
  "one-slow-bite": [
    { label: "What you tasted" },
    { label: "What you noticed" },
  ],
  "one-slow-bite--alternative": [
    { label: "The scent" },
    { label: "Three words" },
  ],
  "new-names-for-old-colours": [{ label: "The new names" }],
  "new-names-for-old-colours--alternative": [{ label: "The new names" }],
  "thirty-seconds-of-original-music": [
    { label: "The title" },
    { label: "How it went" },
  ],
  "thirty-seconds-of-original-music--alternative": [
    { label: "Album title" },
    { label: "First track" },
  ],
  "move-like-something-else": [
    { label: "Animal", ask: true },
    { label: "How it felt" },
  ],
  "move-like-something-else--alternative": [
    { label: "Animal", ask: true },
    { label: "Three verbs" },
  ],
  "a-note-left-behind": [
    { label: "Where you left it" },
    { label: "What it said" },
  ],
  "a-note-left-behind--alternative": [
    { label: "Person", ask: true },
    { label: "What it said" },
  ],
  "ask-what-you-never-asked": [
    { label: "Person", ask: true },
    { label: "The question" },
  ],
  "ask-what-you-never-asked--alternative": [
    { label: "Person", ask: true },
    { label: "The question" },
  ],
};

const ANSWER_MAX = 240;

export function promptsFor(slug: string): MemoryPrompt[] {
  return PROMPTS[slug] ?? [{ label: "What you noticed" }];
}

export function askLabel(slug: string): string | null {
  return promptsFor(slug).find((prompt) => prompt.ask)?.label ?? null;
}

export type MemoryDetail = { label: string; value: string };

/** Turns saved answers into the memory note. Empty answers are left out. */
export function composeMemoryNote(prompts: MemoryPrompt[], labels: string[], values: string[]): string | null {
  const submitted = new Map<string, string>();
  labels.forEach((label, index) => {
    const value = (values[index] ?? "").trim().replace(/\s+/g, " ");
    if (value) submitted.set(label, value.slice(0, ANSWER_MAX));
  });
  const lines = prompts.flatMap((prompt) => {
    const value = submitted.get(prompt.label);
    return value ? [`${prompt.label}: ${value}`] : [];
  });
  return lines.length > 0 ? lines.join("\n") : null;
}

const DETAIL_LINE = /^([^:\n]{1,48}):\s+(\S.*)$/;

/** Reads a note written by `composeMemoryNote`. A free sentence stays prose. */
export function parseMemoryNote(note: string | null): MemoryDetail[] | null {
  if (!note?.trim()) return null;
  const lines = note.split("\n").map((line) => line.trim()).filter(Boolean);
  const details: MemoryDetail[] = [];
  for (const line of lines) {
    const match = line.match(DETAIL_LINE);
    if (!match) return null;
    details.push({ label: match[1], value: match[2] });
  }
  return details.length > 0 ? details : null;
}

export function noteHasLabel(note: string | null, label: string): boolean {
  return parseMemoryNote(note)?.some((detail) => detail.label === label) ?? false;
}
