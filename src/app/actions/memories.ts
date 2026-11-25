"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { isLocalDate, localDateInTimezone } from "@/lib/dates";
import { photoFile, photoProblem, writeMemoryPhoto } from "@/lib/memory-photo";
import { NOTE_MAX_LENGTH, updateMemory } from "@/features/memories/service";

export type MemoryEditState = {
  error?: string;
  saved?: boolean;
};

export async function updatePersonalMemory(
  _prev: MemoryEditState,
  formData: FormData,
): Promise<MemoryEditState> {
  const user = await requireUser();
  const memoryId = String(formData.get("memoryId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const noteRaw = String(formData.get("note") ?? "");
  const note = noteRaw.trim() ? noteRaw.trim().slice(0, NOTE_MAX_LENGTH) : null;
  const date = String(formData.get("date") ?? "");

  if (!title) return { error: "Add a title." };
  if (!isLocalDate(date)) return { error: "Choose a valid date." };
  const today = localDateInTimezone(new Date(), user.timezone);
  if (date > today) return { error: "Choose today or an earlier date." };

  let imagePath: string | undefined;
  const photo = photoFile(formData.get("photo"));
  if (photo) {
    const problem = photoProblem(photo);
    if (problem) return { error: problem };
    try {
      imagePath = await writeMemoryPhoto(user.id, memoryId, photo);
    } catch {
      return { error: "That photo could not be saved." };
    }
  }

  const saved = await updateMemory(await getDb(), user.id, memoryId, {
    title,
    note,
    date,
    imagePath,
  });
  if (!saved) return { error: "That memory could not be updated." };

  revalidatePath("/today");
  revalidatePath("/memories");
  revalidatePath("/profile");
  revalidatePath("/achieve", "layout");
  return { saved: true };
}
