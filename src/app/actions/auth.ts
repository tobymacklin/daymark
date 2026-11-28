"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { clearSessionCookie } from "@/lib/authentication/current-user";
import { createProfile, findProfileByAuthUserId } from "@/lib/authentication/sessions";
import { createSupabase, supabaseConfigured } from "@/lib/authentication/supabase";
import { getDb } from "@/lib/database";
import { isValidTimezone } from "@/lib/dates";

export type AuthState = { error?: string; notice?: string };

export async function signInWithEmail(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const mode = String(formData.get("mode") ?? "sign-in");
  if (mode === "create") return createEmailAccount(formData);
  if (mode === "forgot") return sendPasswordReset(formData);
  return signIn(formData);
}

async function signIn(formData: FormData): Promise<AuthState> {
  const email = readEmail(formData);
  const password = String(formData.get("password") ?? "");
  const problem = credentialProblem(email, password);
  if (problem) return { error: problem };
  if (!supabaseConfigured()) return { error: "Email sign-in is not configured yet." };

  const supabase = await createSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: friendlyAuthError(error.message) };
  if (!data.user) return { error: "That email and password did not match." };

  const profile = await findProfileByAuthUserId(await getDb(), data.user.id);
  if (!profile) return { error: "That email does not have a Daymark profile yet." };
  redirect("/today");
}

async function createEmailAccount(formData: FormData): Promise<AuthState> {
  const email = readEmail(formData);
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "").trim() || "UTC";
  if (displayName.length < 1 || displayName.length > 40) {
    return { error: "Choose a name between 1 and 40 characters." };
  }
  const problem = credentialProblem(email, password);
  if (problem) return { error: problem };
  if (password !== confirmPassword) return { error: "Those passwords do not match." };
  if (!isValidTimezone(timezone)) return { error: "That timezone is not recognized." };
  if (!supabaseConfigured()) return { error: "Email sign-in is not configured yet." };

  const supabase = await createSupabase();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: friendlyAuthError(error.message) };
  if (!data.user) return { error: "The account could not be created." };

  await createProfile(await getDb(), { displayName, timezone, authUserId: data.user.id });

  if (!data.session) {
    return {
      notice: "Check your email and confirm the account. Then sign in with the same email and password.",
    };
  }
  redirect("/today");
}

async function sendPasswordReset(formData: FormData): Promise<AuthState> {
  const email = readEmail(formData);
  if (!email.includes("@") || email.length > 200) return { error: "Enter a valid email address." };
  if (!supabaseConfigured()) return { error: "Email sign-in is not configured yet." };

  const supabase = await createSupabase();
  const origin = await appOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/reset`,
  });
  if (error) return { error: "The reset email could not be sent. Try again." };
  return { notice: "If that email has an account, a reset link is on its way." };
}

export async function updatePassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  if (password.length < 8) return { error: "Use a password of at least 8 characters." };
  if (password.length > 72) return { error: "Use a password of 72 characters or fewer." };
  if (password !== confirmPassword) return { error: "Those passwords do not match." };
  if (!supabaseConfigured()) return { error: "Email sign-in is not configured yet." };

  const supabase = await createSupabase();
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error || !data.user) return { error: "The password could not be changed. Request a new reset link." };
  redirect("/today");
}

async function appOrigin(): Promise<string> {
  const headerList = await headers();
  const origin = headerList.get("origin");
  if (origin) return origin;
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

export async function signOut(): Promise<void> {
  if (supabaseConfigured()) {
    const supabase = await createSupabase();
    await supabase.auth.signOut();
  }
  await clearSessionCookie();
  redirect("/");
}

function readEmail(formData: FormData): string {
  return String(formData.get("email") ?? "").trim().toLowerCase();
}

function credentialProblem(email: string, password: string): string | null {
  if (!email.includes("@") || email.length > 200) return "Enter a valid email address.";
  if (password.length < 8) return "Use a password of at least 8 characters.";
  if (password.length > 72) return "Use a password of 72 characters or fewer.";
  return null;
}

function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login")) return "That email and password did not match.";
  if (lower.includes("email not confirmed")) return "Confirm the email first, then sign in.";
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "That email already has an account. Sign in instead.";
  }
  if (lower.includes("password")) return "Choose a longer password and try again.";
  return "The account could not be saved. Try again.";
}
