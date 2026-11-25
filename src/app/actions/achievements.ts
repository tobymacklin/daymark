"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { localDateInTimezone } from "@/lib/dates";
import { photoFile, photoProblem, writeMemoryPhoto } from "@/lib/memory-photo";
import { getCollection, unlockAchievement } from "@/features/achievements/service";
import { NOTE_MAX_LENGTH, setMemoryImage } from "@/features/memories/service";

export type UnlockState = {
  error?: string;
  xpAwarded?: number;
  masteryXpAwarded?: number;
  created?: boolean;
  unlocked?: number;
  total?: number;
  memoryId?: string;
  photoSaved?: boolean;
};

export async function unlockSelfReportedAchievement(
  _prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const user = await requireUser();
  const achievementId = String(formData.get("achievementId") ?? "");
  const collectionSlug = String(formData.get("collectionSlug") ?? "");
  if (!achievementId) return { error: "Missing achievement." };

  const noteRaw = String(formData.get("note") ?? "");
  const note = noteRaw.trim() ? noteRaw.trim().slice(0, NOTE_MAX_LENGTH) : null;
  const photo = photoFile(formData.get("photo"));
  if (photo) {
    const problem = photoProblem(photo);
    if (problem) return { error: problem };
  }

  const today = localDateInTimezone(new Date(), user.timezone);
  const result = await unlockAchievement(await getDb(), {
    userId: user.id,
    achievementId,
    today,
    note,
  });

  if (!result.ok) {
    return {
      error:
        result.reason === "prerequisites"
          ? "Finish the earlier achievements in this collection first."
          : "That achievement could not be found.",
    };
  }

  let photoSaved = false;
  let photoError: string | undefined;
  if (result.created && result.memoryId && photo) {
    try {
      const imagePath = await writeMemoryPhoto(user.id, result.memoryId, photo);
      photoSaved = await setMemoryImage(await getDb(), user.id, result.memoryId, imagePath);
      if (!photoSaved) photoError = "The achievement was saved, but the photo could not be attached.";
    } catch {
      photoError = "The achievement was saved, but the photo could not be attached.";
    }
  }

  revalidatePath("/achieve", "layout");
  revalidatePath("/memories");
  revalidatePath("/profile");
  revalidatePath("/today");

  let unlocked: number | undefined;
  let total: number | undefined;
  if (collectionSlug && result.created) {
    const collection = await getCollection(await getDb(), user.id, collectionSlug);
    if (collection) {
      unlocked = collection.unlocked;
      total = collection.total;
    }
  }

  return {
    error: photoError,
    xpAwarded: result.xpAwarded,
    masteryXpAwarded: result.masteryXpAwarded,
    created: result.created,
    unlocked,
    total,
    memoryId: result.memoryId ?? undefined,
    photoSaved,
  };
}
