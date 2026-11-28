import "server-only";
import path from "node:path";
import { migrate } from "./migrate";
import { createPgliteDb } from "./pglite";
import { createPostgresDb } from "./postgres";
import { seedContent } from "./seed";
import type { Db } from "./types";

export type { Db, Queryable, Row } from "./types";

/**
 * The application database.
 *
 * DATABASE_URL selects the hosted Postgres database (Supabase). Without it,
 * the app uses the embedded PGlite database in `.daymark/pgdata`.
 * Migrations and content seeding run once per process, on first use.
 *
 * The instance lives on `globalThis` so that hot reloads in development reuse
 * the one open database instead of opening the data directory twice.
 */
const globalStore = globalThis as typeof globalThis & { __daymarkDb?: Promise<Db> };

async function open(): Promise<Db> {
  const connectionString = process.env.DATABASE_URL?.trim();
  const db = connectionString ? await createPostgresDb(connectionString) : await openLocal();
  await migrate(db);
  await seedContent(db);
  return db;
}

async function openLocal(): Promise<Db> {
  const configured = process.env.DAYMARK_DATA_DIR;
  const cwd = typeof process.cwd === "function" ? process.cwd() : ".";
  const dataDir = path.resolve(
    String(configured && configured.length > 0 ? configured : path.join(String(cwd), ".daymark", "pgdata")),
  );
  return createPgliteDb(dataDir);
}

export function getDb(): Promise<Db> {
  if (!globalStore.__daymarkDb) {
    globalStore.__daymarkDb = open().catch((error) => {
      // Let the next request try again rather than caching the failure.
      globalStore.__daymarkDb = undefined;
      throw error;
    });
  }
  return globalStore.__daymarkDb;
}
