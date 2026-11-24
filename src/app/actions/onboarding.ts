"use server";

import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  getCurrentUser,
  setSessionCookie,
} from "@/lib/authentication/current-user";
import { createProfile, createSession, deleteProfile } from "@/lib/authentication/sessions";
import { getDb } from "@/lib/database";
import { isValidTimezone } from "@/lib/dates";

export type OnboardingState = { error?: string };

export async function startOnboarding(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const existing = await getCurrentUser();
  if (existing) redirect("/today");

  const displayName = String(formData.get("displayName") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "").trim() || "UTC";

  if (displayName.length < 1 || displayName.length > 40) {
    return { error: "Choose a name between 1 and 40 characters." };
  }
  if (!isValidTimezone(timezone)) {
    return { error: "That timezone is not recognized." };
  }

  try {
    const db = await getDb();
    const user = await createProfile(db, { displayName, timezone });
    const token = await createSession(db, user.id, new Date());
    await setSessionCookie(token);
  } catch (error) {
    console.error("[daymark] onboarding failed", error);
    return {
      error:
        error instanceof Error
          ? `Could not start Daymark: ${error.message}`
          : "Could not start Daymark.",
    };
  }
  redirect("/today");
}

export async function resetLocalProfile(): Promise<void> {
  const user = await getCurrentUser();
  if (user) {
    await deleteProfile(await getDb(), user.id);
  }
  await clearSessionCookie();
  redirect("/onboarding");
}
