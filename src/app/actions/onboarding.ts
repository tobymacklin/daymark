"use server";

import { redirect } from "next/navigation";
import { clearSessionCookie, getCurrentUser } from "@/lib/authentication/current-user";
import { deleteProfile } from "@/lib/authentication/sessions";
import { createSupabase, supabaseConfigured } from "@/lib/authentication/supabase";
import { getDb } from "@/lib/database";
import { removeProfilePhotos } from "@/lib/memory-photo";

export async function resetLocalProfile(): Promise<void> {
  const user = await getCurrentUser();
  if (user) {
    await removeProfilePhotos(user.id);
    if (supabaseConfigured()) {
      const supabase = await createSupabase();
      await supabase.auth.signOut();
    }
    await deleteProfile(await getDb(), user.id);
  }
  await clearSessionCookie();
  redirect("/onboarding");
}
