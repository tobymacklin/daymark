import { RARITY_XP, SEED_COLLECTIONS } from "../../../supabase/seed/collections";
import { SEED_EXPERIENCES } from "../../../supabase/seed/experiences";
import type { Db, Queryable } from "./types";

/**
 * Loads the content in `supabase/seed` into the database.
 *
 * Idempotent: every row is upserted by slug, so it is safe to run on each
 * startup and it never touches user data. Content that is removed from the
 * seed files is left in place (it may be referenced by completions).
 */
export async function seedContent(db: Db): Promise<void> {
  await db.transaction(async (tx) => {
    await seedExperiences(tx);
    await seedCollections(tx);
  });
}

const UPSERT_EXPERIENCE = `
  insert into experiences
    (slug, title, prompt, steps, category, minutes_min, minutes_max, setting,
     required_items, accessibility_note, is_alternative, alternative_id, sort_order)
  values ($1, $2, $3, $4::text[], $5, $6, $7, $8, $9::text[], $10, $11, $12, $13)
  on conflict (slug) do update set
    title = excluded.title,
    prompt = excluded.prompt,
    steps = excluded.steps,
    category = excluded.category,
    minutes_min = excluded.minutes_min,
    minutes_max = excluded.minutes_max,
    setting = excluded.setting,
    required_items = excluded.required_items,
    accessibility_note = excluded.accessibility_note,
    is_alternative = excluded.is_alternative,
    alternative_id = excluded.alternative_id,
    sort_order = excluded.sort_order
  returning id
`;

async function seedExperiences(tx: Queryable): Promise<void> {
  for (const [index, experience] of SEED_EXPERIENCES.entries()) {
    const alternative = experience.alternative;
    const [alternativeRow] = await tx.query<{ id: string }>(UPSERT_EXPERIENCE, [
      `${experience.slug}--alternative`,
      alternative.title,
      alternative.prompt,
      alternative.steps,
      experience.category,
      experience.minutes[0],
      experience.minutes[1],
      alternative.setting,
      alternative.items ?? [],
      alternative.accessibilityNote,
      true,
      null,
      index + 1,
    ]);

    await tx.query(UPSERT_EXPERIENCE, [
      experience.slug,
      experience.title,
      experience.prompt,
      experience.steps,
      experience.category,
      experience.minutes[0],
      experience.minutes[1],
      experience.setting,
      experience.items ?? [],
      null,
      false,
      alternativeRow.id,
      index + 1,
    ]);
  }
}

async function seedCollections(tx: Queryable): Promise<void> {
  for (const [collectionIndex, collection] of SEED_COLLECTIONS.entries()) {
    const [collectionRow] = await tx.query<{ id: string }>(
      `insert into hobby_collections (slug, name, tagline, description, theme, emblem_motif, sort_order)
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (slug) do update set
         name = excluded.name,
         tagline = excluded.tagline,
         description = excluded.description,
         theme = excluded.theme,
         emblem_motif = excluded.emblem_motif,
         sort_order = excluded.sort_order
       returning id`,
      [
        collection.slug,
        collection.name,
        collection.tagline,
        collection.description,
        collection.theme,
        collection.emblem,
        collectionIndex + 1,
      ],
    );

    const idBySlug = new Map<string, string>();
    for (const [index, achievement] of collection.achievements.entries()) {
      const [row] = await tx.query<{ id: string }>(
        `insert into achievements
           (collection_id, slug, title, description, criteria, rarity, xp_reward,
            estimated_time, estimated_cost, materials, safety_notes, badge_motif, sort_order)
         values ($1, $2, $3, $4, $5::text[], $6, $7, $8, $9, $10::text[], $11, $12, $13)
         on conflict (collection_id, slug) do update set
           title = excluded.title,
           description = excluded.description,
           criteria = excluded.criteria,
           rarity = excluded.rarity,
           xp_reward = excluded.xp_reward,
           estimated_time = excluded.estimated_time,
           estimated_cost = excluded.estimated_cost,
           materials = excluded.materials,
           safety_notes = excluded.safety_notes,
           badge_motif = excluded.badge_motif,
           sort_order = excluded.sort_order
         returning id`,
        [
          collectionRow.id,
          achievement.slug,
          achievement.title,
          achievement.description,
          achievement.criteria,
          achievement.rarity,
          RARITY_XP[achievement.rarity],
          achievement.time,
          achievement.cost,
          achievement.materials ?? [],
          achievement.safety ?? null,
          achievement.motif,
          index + 1,
        ],
      );
      idBySlug.set(achievement.slug, row.id);
    }

    // Rebuild prerequisites for this collection from the seed file.
    await tx.query(
      `delete from achievement_prerequisites
       where achievement_id in (select id from achievements where collection_id = $1)`,
      [collectionRow.id],
    );
    for (const achievement of collection.achievements) {
      for (const requiredSlug of achievement.requires ?? []) {
        const requiredId = idBySlug.get(requiredSlug);
        if (!requiredId) {
          throw new Error(
            `Seed error: "${achievement.slug}" requires unknown achievement "${requiredSlug}" in ${collection.slug}`,
          );
        }
        await tx.query(
          `insert into achievement_prerequisites (achievement_id, prerequisite_achievement_id)
           values ($1, $2)`,
          [idBySlug.get(achievement.slug), requiredId],
        );
      }
    }
  }
}
