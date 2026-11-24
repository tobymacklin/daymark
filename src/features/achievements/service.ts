import { MASTERY_XP, type Rarity } from "../../../supabase/seed/collections";
import type { LocalDate } from "@/lib/dates";
import type { Db } from "@/lib/database/types";
import { awardXp } from "@/features/progression/service";

export type { Rarity };

export type CollectionSummary = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  theme: string;
  emblem: string;
  /** Position in the library, for "COLLECTION / 002". */
  number: number;
  total: number;
  unlocked: number;
};

export type AchievementState = "unlocked" | "available" | "locked";

export type AchievementPrerequisite = { slug: string; title: string; unlocked: boolean };

export type Achievement = {
  id: string;
  slug: string;
  title: string;
  description: string;
  criteria: string[];
  rarity: Rarity;
  xp: number;
  estimatedTime: string;
  estimatedCost: string;
  materials: string[];
  safetyNotes: string | null;
  motif: string;
  state: AchievementState;
  /** ISO timestamp, when unlocked. */
  unlockedAt: string | null;
  /** The memory created by unlocking, when unlocked. */
  memoryId: string | null;
  prerequisites: AchievementPrerequisite[];
};

export type CollectionDetail = CollectionSummary & {
  achievements: Achievement[];
  mastered: boolean;
  masteryXp: number;
};

type CollectionRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  theme: string;
  emblem_motif: string;
  sort_order: number;
  total: number;
  unlocked: number;
};

const COLLECTION_SELECT = `
  select c.id, c.slug, c.name, c.tagline, c.description, c.theme, c.emblem_motif, c.sort_order,
         count(a.id)::int as total, count(ua.id)::int as unlocked
  from hobby_collections c
  left join achievements a on a.collection_id = c.id and a.status = 'published'
  left join user_achievements ua on ua.achievement_id = a.id and ua.user_id = $1
  where c.status = 'published'
`;

function toCollection(row: CollectionRow): CollectionSummary {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    theme: row.theme,
    emblem: row.emblem_motif,
    number: row.sort_order,
    total: row.total,
    unlocked: row.unlocked,
  };
}

export async function listRecentUnlocks(
  db: Db,
  userId: string,
  limit = 8,
): Promise<Array<{ slug: string; title: string; collectionSlug: string; rarity: Rarity; xp: number }>> {
  const rows = await db.query<{
    slug: string;
    title: string;
    collection_slug: string;
    rarity: Rarity;
    xp_reward: number;
  }>(
    `select a.slug, a.title, c.slug as collection_slug, a.rarity, a.xp_reward
     from user_achievements ua
     join achievements a on a.id = ua.achievement_id
     join hobby_collections c on c.id = a.collection_id
     where ua.user_id = $1
     order by ua.unlocked_at desc
     limit $2`,
    [userId, limit],
  );
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    collectionSlug: row.collection_slug,
    rarity: row.rarity,
    xp: row.xp_reward,
  }));
}

export async function listCollections(db: Db, userId: string): Promise<CollectionSummary[]> {
  const rows = await db.query<CollectionRow>(`${COLLECTION_SELECT} group by c.id order by c.sort_order`, [
    userId,
  ]);
  return rows.map(toCollection);
}

export async function getCollection(db: Db, userId: string, slug: string): Promise<CollectionDetail | null> {
  const [row] = await db.query<CollectionRow>(`${COLLECTION_SELECT} and c.slug = $2 group by c.id`, [
    userId,
    slug,
  ]);
  if (!row) return null;

  const achievementRows = await db.query<{
    id: string;
    slug: string;
    title: string;
    description: string;
    criteria: string[];
    rarity: Rarity;
    xp_reward: number;
    estimated_time: string;
    estimated_cost: string;
    materials: string[];
    safety_notes: string | null;
    badge_motif: string;
    unlocked_at: Date | null;
    memory_id: string | null;
  }>(
    `select a.id, a.slug, a.title, a.description, a.criteria, a.rarity, a.xp_reward,
            a.estimated_time, a.estimated_cost, a.materials, a.safety_notes, a.badge_motif,
            ua.unlocked_at, m.id as memory_id
     from achievements a
     left join user_achievements ua on ua.achievement_id = a.id and ua.user_id = $1
     left join memory_entries m
       on m.user_id = $1 and m.source_type = 'achievement' and m.source_id = ua.id
     where a.collection_id = $2 and a.status = 'published'
     order by a.sort_order`,
    [userId, row.id],
  );

  const prerequisiteRows = await db.query<{ achievement_id: string; prerequisite_id: string }>(
    `select p.achievement_id, p.prerequisite_achievement_id as prerequisite_id
     from achievement_prerequisites p
     join achievements a on a.id = p.achievement_id
     where a.collection_id = $1`,
    [row.id],
  );

  const byId = new Map(achievementRows.map((achievement) => [achievement.id, achievement]));
  const achievements: Achievement[] = achievementRows.map((achievement) => {
    const prerequisites = prerequisiteRows
      .filter((link) => link.achievement_id === achievement.id)
      .map((link) => byId.get(link.prerequisite_id))
      .filter((required) => required !== undefined)
      .map((required) => ({
        slug: required.slug,
        title: required.title,
        unlocked: required.unlocked_at !== null,
      }));
    const state: AchievementState =
      achievement.unlocked_at !== null
        ? "unlocked"
        : prerequisites.every((required) => required.unlocked)
          ? "available"
          : "locked";
    return {
      id: achievement.id,
      slug: achievement.slug,
      title: achievement.title,
      description: achievement.description,
      criteria: achievement.criteria,
      rarity: achievement.rarity,
      xp: achievement.xp_reward,
      estimatedTime: achievement.estimated_time,
      estimatedCost: achievement.estimated_cost,
      materials: achievement.materials,
      safetyNotes: achievement.safety_notes,
      motif: achievement.badge_motif,
      state,
      unlockedAt: achievement.unlocked_at ? new Date(achievement.unlocked_at).toISOString() : null,
      memoryId: achievement.memory_id,
      prerequisites,
    };
  });

  const collection = toCollection(row);
  return {
    ...collection,
    achievements,
    mastered: collection.total > 0 && collection.unlocked === collection.total,
    masteryXp: MASTERY_XP,
  };
}

export type UnlockResult =
  | {
      ok: true;
      /** False when it was already unlocked; nothing was awarded again. */
      created: boolean;
      xpAwarded: number;
      /** Mastery XP, when this unlock completed the collection. */
      masteryXpAwarded: number;
    }
  | { ok: false; reason: "not_found" | "prerequisites" };

/**
 * Self-reported unlock. In one transaction: checks prerequisites, records the
 * unlock, creates its memory entry, awards XP, and awards collection mastery
 * if this was the last one. Repeating it changes nothing.
 */
export async function unlockAchievement(
  db: Db,
  input: { userId: string; achievementId: string; today: LocalDate; now?: Date },
): Promise<UnlockResult> {
  return db.transaction(async (tx): Promise<UnlockResult> => {
    const [achievement] = await tx.query<{
      id: string;
      title: string;
      xp_reward: number;
      collection_id: string;
    }>(
      `select a.id, a.title, a.xp_reward, a.collection_id
       from achievements a
       join hobby_collections c on c.id = a.collection_id
       where a.id = $1 and a.status = 'published' and c.status = 'published'`,
      [input.achievementId],
    );
    if (!achievement) return { ok: false, reason: "not_found" };

    const [missing] = await tx.query<{ count: number }>(
      `select count(*)::int as count
       from achievement_prerequisites p
       left join user_achievements ua
         on ua.achievement_id = p.prerequisite_achievement_id and ua.user_id = $2
       where p.achievement_id = $1 and ua.id is null`,
      [achievement.id, input.userId],
    );
    if (missing.count > 0) return { ok: false, reason: "prerequisites" };

    const [unlock] = await tx.query<{ id: string }>(
      `insert into user_achievements (user_id, achievement_id, unlocked_at)
       values ($1, $2, $3)
       on conflict (user_id, achievement_id) do nothing
       returning id`,
      [input.userId, achievement.id, input.now ?? new Date()],
    );
    if (!unlock) return { ok: true, created: false, xpAwarded: 0, masteryXpAwarded: 0 };

    await tx.query(
      `insert into memory_entries (user_id, source_type, source_id, title, occurred_on)
       values ($1, 'achievement', $2, $3, $4::date)`,
      [input.userId, unlock.id, achievement.title, input.today],
    );

    const xpAwarded = await awardXp(tx, {
      userId: input.userId,
      amount: achievement.xp_reward,
      eventType: "achievement",
      sourceId: unlock.id,
      idempotencyKey: `achievement:${achievement.id}`,
    });

    const [progress] = await tx.query<{ total: number; unlocked: number }>(
      `select count(a.id)::int as total, count(ua.id)::int as unlocked
       from achievements a
       left join user_achievements ua on ua.achievement_id = a.id and ua.user_id = $2
       where a.collection_id = $1 and a.status = 'published'`,
      [achievement.collection_id, input.userId],
    );
    const masteryXpAwarded =
      progress.total > 0 && progress.unlocked === progress.total
        ? await awardXp(tx, {
            userId: input.userId,
            amount: MASTERY_XP,
            eventType: "collection_mastery",
            sourceId: achievement.collection_id,
            idempotencyKey: `mastery:${achievement.collection_id}`,
          })
        : 0;

    return { ok: true, created: true, xpAwarded, masteryXpAwarded };
  });
}
