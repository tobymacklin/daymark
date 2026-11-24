import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Db } from "./types";

export const MIGRATIONS_DIR = path.join(process.cwd(), "supabase", "migrations");

/**
 * Applies every `supabase/migrations/*.sql` file that has not run yet, in
 * filename order, each in its own transaction. Returns the names applied.
 */
export async function migrate(db: Db, dir: string = MIGRATIONS_DIR): Promise<string[]> {
  await db.exec(`
    create table if not exists schema_migrations (
      name        text primary key,
      applied_at  timestamptz not null default now()
    )
  `);

  // turbopackIgnore: keep migrations out of the server bundle trace.
  const files = (await readdir(/* turbopackIgnore: true */ dir))
    .filter((file) => file.endsWith(".sql"))
    .sort();
  const done = new Set(
    (await db.query<{ name: string }>("select name from schema_migrations")).map((row) => row.name),
  );

  const applied: string[] = [];
  for (const file of files) {
    if (done.has(file)) continue;
    const sql = await readFile(/* turbopackIgnore: true */ path.join(dir, file), "utf8");
    await db.transaction(async (tx) => {
      await tx.exec(sql);
      await tx.query("insert into schema_migrations (name) values ($1)", [file]);
    });
    applied.push(file);
  }
  return applied;
}
