/**
 * Product photographs for experiences and hobbies.
 * Hobby covers are Pexels photos, free to use under the Pexels license:
 * reading.jpg — Vitaly Gariev, photo 36714308
 * baking.jpg — Vitaly Gariev, photo 36765537
 * photography.jpg — Airam Dato-on, photo 26733653
 * They are not a user's memories.
 * Achievement pins are loaded separately from /achievements/{slug}.webp or .png.
 */

const EXPERIENCE_IMAGES: Record<string, string> = {
  "a-face-in-the-ordinary": "/images/experiences/a-face-in-the-ordinary.jpg",
};

const HOBBY_IMAGES: Record<string, string> = {
  bookworm: "/images/hobbies/reading.jpg",
  baker: "/images/hobbies/baking.jpg",
  photographer: "/images/hobbies/photography.jpg",
};

const HOBBY_NAMES: Record<string, string> = {
  bookworm: "Reading",
  baker: "Baking",
  photographer: "Photography",
};

export function experienceImage(slug: string): string | null {
  return EXPERIENCE_IMAGES[slug] ?? null;
}

export function hobbyImage(slug: string): string | null {
  return HOBBY_IMAGES[slug] ?? null;
}

export function hobbyName(slug: string, fallback: string): string {
  return HOBBY_NAMES[slug] ?? fallback;
}
