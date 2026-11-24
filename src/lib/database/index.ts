import "server-only";
import path from "node:path";
import { migrate } from "./migrate";
import { createPgliteDb } from "./pglite";
import { seedContent } from "./seed";
import type { Db } from "./types";

export type { Db, Queryable, Row } from "./types";

/**
 * The application database.
 *
 * Today this is always the embedded PGlite development driver, stored in
 * `.daymark/pgdata` (override with DAYMARK_DATA_DIR). Migrations and content
 * seeding run once per process, on first use.
 *
 * The instance lives on `globalThis` so that hot reloads in development reuse
 * the one open database instead of opening the data directory twice.
 */
const globalStore = globalThis as typeof globalThis & { __daymarkDb?: Promise<Db> };

async function open(): Promise<Db> {
  const configured = process.env.DAYMARK_DATA_DIR;
  const cwd = typeof process.cwd === "function" ? process.cwd() : ".";
  const dataDir = path.resolve(
    String(configured && configured.length > 0 ? configured : path.join(String(cwd), ".daymark", "pgdata")),
  );
  const db = await createPgliteDb(dataDir);
  await migrate(db);
  await seedContent(db);
  return db;
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
