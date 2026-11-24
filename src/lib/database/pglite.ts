import { mkdir } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import type { Db, Queryable, Row } from "./types";

/**
 * LOCAL DEVELOPMENT DRIVER.
 *
 * PGlite is real PostgreSQL compiled to WebAssembly and running inside the
 * Node process. It gives the prototype a persistent, relational database with
 * no external service. It is single-connection and single-process, so it is
 * not a production database: a hosted Postgres driver implementing the same
 * `Db` interface replaces it (see docs/ARCHITECTURE.md).
 *
 * Pass no `dataDir` for an in-memory database (used by the tests).
 */
export async function createPgliteDb(dataDir?: string): Promise<Db> {
  // Coerce to a plain string: under Turbopack, some path helpers can surface a
  // file URL object that Node's fs APIs reject with a confusing type error.
  const resolved = dataDir ? String(dataDir) : undefined;
  if (resolved) {
    await mkdir(path.dirname(resolved), { recursive: true });
  }
  const pg = await PGlite.create(resolved);

  type Runner = {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: unknown[] }>;
    exec: (sql: string) => Promise<unknown>;
  };

  const wrap = (runner: Runner): Queryable => ({
    async query<T = Row>(sql: string, params: unknown[] = []) {
      const result = await runner.query(sql, params);
      return result.rows as T[];
    },
    async exec(sql: string) {
      await runner.exec(sql);
    },
  });

  return {
    ...wrap(pg as unknown as Runner),
    transaction<T>(fn: (tx: Queryable) => Promise<T>) {
      return pg.transaction((tx) => fn(wrap(tx as unknown as Runner))) as Promise<T>;
    },
    async close() {
      await pg.close();
    },
  };
}
