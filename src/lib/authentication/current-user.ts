import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getDb } from "@/lib/database";
import { findProfileByAuthUserId, findUserBySessionToken, SESSION_DAYS, type User } from "./sessions";
import { createSupabase, supabaseConfigured } from "./supabase";

export const SESSION_COOKIE = "daymark_session";

/**
 * The signed-in user for this request, or null. Memoized per request.
 *
 * Reads a cookie and the current time, so callers must be in a request-time
 * context (after `connection()`, or behind Suspense / `instant = false`).
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  await connection();
  const emailUser = await findEmailUser();
  if (emailUser) return emailUser;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return findUserBySessionToken(await getDb(), token, new Date());
});

async function findEmailUser(): Promise<User | null> {
  if (!supabaseConfigured()) return null;
  try {
    const supabase = await createSupabase();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    return findProfileByAuthUserId(await getDb(), data.user.id);
  } catch (error) {
    console.error("[daymark] email session lookup failed", error);
    return null;
  }
}

/** For pages and actions that need a user: sends everyone else to onboarding. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  return user;
}

/** Only callable from a Server Function or Route Handler. */
export async function setSessionCookie(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

/** Only callable from a Server Function or Route Handler. */
export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
