import { Pool, type PoolClient, type QueryResult } from "pg";
import type { Db, Queryable, Row } from "./types";

type SqlClient = {
  query: (sql: string, params?: unknown[]) => Promise<QueryResult>;
};

/**
 * Hosted Postgres driver. Used when DATABASE_URL is set, which is the
 * Supabase connection string. The local PGlite driver stays available for
 * machines that have not configured a hosted database.
 */
export async function createPostgresDb(connectionString: string): Promise<Db> {
  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("supabase.co") ? { rejectUnauthorized: false } : undefined,
    max: 5,
  });

  const wrap = (client: SqlClient): Queryable => ({
    async query<T = Row>(sql: string, params: unknown[] = []) {
      const result = await client.query(sql, params);
      return result.rows as T[];
    },
    async exec(sql: string) {
      await client.query(sql);
    },
  });

  return {
    ...wrap(pool),
    async transaction<T>(fn: (tx: Queryable) => Promise<T>) {
      const client: PoolClient = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await fn(wrap(client));
        await client.query("COMMIT");
        return result;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async close() {
      await pool.end();
    },
  };
}
