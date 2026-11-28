import { createHash, randomBytes } from "node:crypto";
import type { Db } from "@/lib/database/types";

/**
 * Profile and device-session helpers.
 *
 * Email sign-in is Supabase Auth. `auth_user_id` ties that account to a
 * profile. A device cookie still works for a profile that has no email yet,
 * so existing progress is not lost before the person adds one.
 */

export type User = {
  id: string;
  displayName: string;
  timezone: string;
  /** ISO timestamp. */
  createdAt: string;
  /** True when this profile can be opened with an email and password. */
  emailAccount: boolean;
};

export const SESSION_DAYS = 365;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createProfile(
  db: Db,
  input: { displayName: string; timezone: string; authUserId?: string | null },
): Promise<User> {
  const [row] = await db.query<UserRow>(
    `insert into profiles (display_name, timezone, auth_user_id) values ($1, $2, $3)
     returning id, display_name, timezone, created_at, auth_user_id`,
    [input.displayName, input.timezone, input.authUserId ?? null],
  );
  return toUser(row);
}

export async function findProfileByAuthUserId(db: Db, authUserId: string): Promise<User | null> {
  const [row] = await db.query<UserRow>(
    `select id, display_name, timezone, created_at, auth_user_id
     from profiles where auth_user_id = $1`,
    [authUserId],
  );
  return row ? toUser(row) : null;
}

/** Attaches an email account to a profile that was created with a name only. */
export async function linkProfileToAuthUser(db: Db, profileId: string, authUserId: string): Promise<User | null> {
  const [row] = await db.query<UserRow>(
    `update profiles set auth_user_id = $2
     where id = $1 and auth_user_id is null
     returning id, display_name, timezone, created_at, auth_user_id`,
    [profileId, authUserId],
  );
  return row ? toUser(row) : null;
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
    `select p.id, p.display_name, p.timezone, p.created_at, p.auth_user_id
     from sessions s
     join profiles p on p.id = s.user_id
     where s.token_hash = $1 and s.expires_at > $2`,
    [hashToken(token), now],
  );
  return row ? toUser(row) : null;
}

/** Deletes the profile and, by cascade, everything that belongs to it. */
export async function deleteProfile(db: Db, userId: string): Promise<void> {
  const [row] = await db.query<{ auth_user_id: string | null }>(
    `select auth_user_id from profiles where id = $1`,
    [userId],
  );
  if (row?.auth_user_id) {
    await db.query(`delete from auth.users where id = $1`, [row.auth_user_id]);
    return;
  }
  await db.query(`delete from profiles where id = $1`, [userId]);
}

type UserRow = {
  id: string;
  display_name: string;
  timezone: string;
  created_at: Date;
  auth_user_id: string | null;
};

function toUser(row: UserRow): User {
  return {
    id: row.id,
    displayName: row.display_name,
    timezone: row.timezone,
    createdAt: new Date(row.created_at).toISOString(),
    emailAccount: row.auth_user_id != null,
  };
}
