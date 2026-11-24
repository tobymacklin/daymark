"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { composeMemoryNote, promptsFor } from "@/features/daily/memory-prompts";
import { completeToday, type CompletionMethod } from "@/features/daily/service";
import { NOTE_MAX_LENGTH, updateMemoryNote } from "@/features/memories/service";

export type CompleteState = {
  error?: string;
  memoryId?: string;
  xpAwarded?: number;
};

export async function completeDailyExperience(
  _prev: CompleteState,
  formData: FormData,
): Promise<CompleteState> {
  const user = await requireUser();
  const method = String(formData.get("method") ?? "primary") as CompletionMethod;
  if (method !== "primary" && method !== "alternative") {
    return { error: "Choose a valid experience." };
  }

  const result = await completeToday(await getDb(), user, method, new Date());
  if (!result.ok) {
    return {
      error:
        result.reason === "no_alternative"
          ? "No alternative is available for today."
          : "Nothing is scheduled for today yet.",
    };
  }

  const prompts = promptsFor(result.slug);
  const note = composeMemoryNote(
    prompts,
    formData.getAll("detailLabel").map(String),
    formData.getAll("detailValue").map(String),
  )?.slice(0, NOTE_MAX_LENGTH);
  if (note) {
    await updateMemoryNote(await getDb(), user.id, result.memoryId, note);
  }

  revalidatePath("/today");
  revalidatePath("/memories");
  revalidatePath("/profile");
  redirect(`/today?done=${result.memoryId}&xp=${result.xpAwarded}`);
}

export async function saveDailyReflection(formData: FormData): Promise<void> {
  const user = await requireUser();
  const memoryId = String(formData.get("memoryId") ?? "");
  const noteRaw = String(formData.get("note") ?? "");
  const note = noteRaw.trim() ? noteRaw.trim().slice(0, NOTE_MAX_LENGTH) : null;
  if (!memoryId) return;
  await updateMemoryNote(await getDb(), user.id, memoryId, note);
  revalidatePath("/today");
  revalidatePath("/memories");
}
