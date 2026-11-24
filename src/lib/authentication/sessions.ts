import { createHash, randomBytes } from "node:crypto";
import type { Db } from "@/lib/database/types";

/**
 * LOCAL DEVELOPMENT AUTH ADAPTER.
 *
 * There is no sign-in yet. A profile is created during onboarding and bound to
 * the device by a random session token: the browser holds the token in an
 * HttpOnly cookie, and the database stores only its SHA-256 hash. Clearing the
 * cookie means losing access to the profile.
 *
 * Supabase Auth replaces this module. Everything else depends only on
 * `getCurrentUser()` returning a `User`.
 */

export type User = {
  id: string;
  displayName: string;
  timezone: string;
  /** ISO timestamp. */
  createdAt: string;
};

export const SESSION_DAYS = 365;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createProfile(
  db: Db,
  input: { displayName: string; timezone: string },
): Promise<User> {
  const [row] = await db.query<UserRow>(
    `insert into profiles (display_name, timezone) values ($1, $2)
     returning id, display_name, timezone, created_at`,
    [input.displayName, input.timezone],
  );
  return toUser(row);
}

/** Creates a session and returns the raw token to put in the cookie. */
export async function createSession(db: Db, userId: string, now: Date): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(now.getTime() + SESSION_DAYS * 86_400_000);
  await db.query(`insert into sessions (user_id, token_hash, expires_at) values ($1, $2, $3)`, [
    userId,
    hashToken(token),
    expiresAt,
  ]);
  return token;
}

export async function findUserBySessionToken(
  db: Db,
  token: string,
  now: Date,
): Promise<User | null> {
  if (!token) return null;
  const [row] = await db.query<UserRow>(
    `select p.id, p.display_name, p.timezone, p.created_at
     from sessions s
     join profiles p on p.id = s.user_id
     where s.token_hash = $1 and s.expires_at > $2`,
    [hashToken(token), now],
  );
  return row ? toUser(row) : null;
}

/** Deletes the profile and, by cascade, everything that belongs to it. */
export async function deleteProfile(db: Db, userId: string): Promise<void> {
  await db.query(`delete from profiles where id = $1`, [userId]);
}

type UserRow = { id: string; display_name: string; timezone: string; created_at: Date };

function toUser(row: UserRow): User {
  return {
    id: row.id,
    displayName: row.display_name,
    timezone: row.timezone,
    createdAt: new Date(row.created_at).toISOString(),
  };
}
