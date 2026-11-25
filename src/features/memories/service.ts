import type { LocalDate, YearMonth } from "@/lib/dates";
import type { Db } from "@/lib/database/types";

export const NOTE_MAX_LENGTH = 2000;

export type MemorySource =
  | {
      type: "daily_experience";
      category: string;
      prompt: string;
      usedAlternative: boolean;
    }
  | {
      type: "achievement";
      collectionName: string;
      collectionSlug: string;
      achievementSlug: string;
      description: string;
      rarity: string;
      motif: string;
      theme: string;
    };

export type Memory = {
  id: string;
  title: string;
  note: string | null;
  date: LocalDate;
  imagePath: string | null;
  source: MemorySource;
  xp: number;
};

type MemoryRow = {
  id: string;
  title: string;
  note: string | null;
  date: string;
  source_type: "daily_experience" | "achievement";
  xp: number;
  experience_category: string | null;
  experience_prompt: string | null;
  completion_method: string | null;
  collection_name: string | null;
  collection_slug: string | null;
  collection_theme: string | null;
  achievement_slug: string | null;
  achievement_description: string | null;
  achievement_rarity: string | null;
  achievement_motif: string | null;
  image_path: string | null;
};

// Every query below is filtered by m.user_id: a memory is only ever readable
// or writable by the user who owns it.
const MEMORY_SELECT = `
  select m.id, m.title, m.note, m.occurred_on::text as date, m.source_type, m.image_path,
         coalesce(x.amount, 0)::int as xp,
         e.category as experience_category, e.prompt as experience_prompt,
         c.completion_method,
         hc.name as collection_name, hc.slug as collection_slug, hc.theme as collection_theme,
         a.slug as achievement_slug, a.description as achievement_description,
         a.rarity as achievement_rarity, a.badge_motif as achievement_motif
  from memory_entries m
  left join user_experience_completions c
    on m.source_type = 'daily_experience' and c.id = m.source_id
  left join experiences e on e.id = c.experience_id
  left join user_achievements ua on m.source_type = 'achievement' and ua.id = m.source_id
  left join achievements a on a.id = ua.achievement_id
  left join hobby_collections hc on hc.id = a.collection_id
  left join xp_transactions x
    on x.user_id = m.user_id and x.source_id = m.source_id
   and x.event_type in ('daily_experience', 'achievement')
`;

function toMemory(row: MemoryRow): Memory {
  const source: MemorySource =
    row.source_type === "daily_experience"
      ? {
          type: "daily_experience",
          category: row.experience_category ?? "",
          prompt: row.experience_prompt ?? "",
          usedAlternative: row.completion_method === "alternative",
        }
      : {
          type: "achievement",
          collectionName: row.collection_name ?? "",
          collectionSlug: row.collection_slug ?? "",
          achievementSlug: row.achievement_slug ?? "",
          description: row.achievement_description ?? "",
          rarity: row.achievement_rarity ?? "bronze",
          motif: row.achievement_motif ?? "",
          theme: row.collection_theme ?? "",
        };
  return {
    id: row.id,
    title: row.title,
    note: row.note,
    date: row.date,
    imagePath: row.image_path,
    source,
    xp: row.xp,
  };
}

/** Most recent first. */
export async function listMemories(db: Db, userId: string, limit = 60): Promise<Memory[]> {
  const rows = await db.query<MemoryRow>(
    `${MEMORY_SELECT}
     where m.user_id = $1
     order by m.occurred_on desc, m.created_at desc
     limit $2`,
    [userId, limit],
  );
  return rows.map(toMemory);
}

export async function countMemories(db: Db, userId: string): Promise<number> {
  const [row] = await db.query<{ count: number }>(
    `select count(*)::int as count from memory_entries where user_id = $1`,
    [userId],
  );
  return row.count;
}

export async function getMemory(db: Db, userId: string, memoryId: string): Promise<Memory | null> {
  const [row] = await db.query<MemoryRow>(`${MEMORY_SELECT} where m.user_id = $1 and m.id = $2`, [
    userId,
    memoryId,
  ]);
  return row ? toMemory(row) : null;
}

/** Dates in the given month on which the user has at least one memory. */
export async function getMemoryDatesInMonth(db: Db, userId: string, month: YearMonth): Promise<LocalDate[]> {
  const rows = await db.query<{ date: string }>(
    `select distinct occurred_on::text as date from memory_entries
     where user_id = $1 and to_char(occurred_on, 'YYYY-MM') = $2
     order by 1`,
    [userId, month],
  );
  return rows.map((row) => row.date);
}

/** Sets or clears the note. Returns false if the memory is not this user's. */
export async function updateMemoryNote(
  db: Db,
  userId: string,
  memoryId: string,
  note: string | null,
): Promise<boolean> {
  const cleaned = note?.trim() ? note.trim().slice(0, NOTE_MAX_LENGTH) : null;
  const rows = await db.query(
    `update memory_entries set note = $3, updated_at = now()
     where id = $1 and user_id = $2
     returning id`,
    [memoryId, userId, cleaned],
  );
  return rows.length > 0;
}

const TITLE_MAX = 120;

export async function updateMemory(
  db: Db,
  userId: string,
  memoryId: string,
  input: { title: string; note: string | null; date: LocalDate; imagePath?: string | null },
): Promise<boolean> {
  const title = input.title.trim().slice(0, TITLE_MAX);
  if (!title) return false;
  const rows = await db.query(
    `update memory_entries
     set title = $3,
         note = $4,
         occurred_on = $5::date,
         image_path = case when $6::text is null then image_path else $6 end,
         updated_at = now()
     where id = $1 and user_id = $2
     returning id`,
    [memoryId, userId, title, input.note, input.date, input.imagePath ?? null],
  );
  return rows.length > 0;
}

export async function setMemoryImage(
  db: Db,
  userId: string,
  memoryId: string,
  imagePath: string,
): Promise<boolean> {
  const rows = await db.query(
    `update memory_entries set image_path = $3, updated_at = now()
     where id = $1 and user_id = $2
     returning id`,
    [memoryId, userId, imagePath],
  );
  return rows.length > 0;
}
