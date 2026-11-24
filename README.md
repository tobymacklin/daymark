# Daymark

Make today different enough to remember.

Daymark is a daily real-world experience app with three pillars:

1. **Today** — one shared free experience each day
2. **Achieve** — hobby collections and self-reported achievements
3. **Remember** — a private memory archive with gentle recall

## Stack

- Next.js App Router + React 19
- TypeScript
- Tailwind CSS 4
- Embedded PostgreSQL via PGlite for local development
- Zod available for validation

Authentication is currently a **local development adapter**: onboarding creates a profile bound to an HttpOnly session cookie on this device. Supabase Auth is the intended production replacement.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On first request the app:

1. Opens `.daymark/pgdata`
2. Runs `supabase/migrations`
3. Seeds daily experiences and three hobby collections

## Useful commands

```bash
npm run lint
npm run build
npm run start
```

## Environment

Optional:

| Variable | Purpose |
| --- | --- |
| `DAYMARK_LAUNCH_DATE` | `YYYY-MM-DD` for daily experience numbering (default `2026-11-01`) |
| `DAYMARK_DATA_DIR` | Override the PGlite data directory |

## Product docs

- Master development specification and design bible live in your Downloads folder as the source PDFs used for this build.
- Seed content:
  - `supabase/seed/experiences.ts`
  - `supabase/seed/collections.ts`

## Current prototype status

Working:

- Landing + local onboarding
- Today experience, alternative, completion, optional note, XP
- Achieve library with Bookworm, Baker, Photographer
- Self-reported achievement unlocks with prerequisites
- Memories timeline + month calendar
- Basic memory recall (free recall, hints, reveal, snooze)
- Profile level, streak, and stats

Not in this prototype yet:

- Cloud auth / multi-device sync
- Photo uploads and AI evidence assessment
- Share cards
- Admin dashboard
- Subscriptions
