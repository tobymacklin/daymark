"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { localDateInTimezone } from "@/lib/dates";
import { unlockAchievement } from "@/features/achievements/service";

export type UnlockState = {
  error?: string;
  xpAwarded?: number;
  masteryXpAwarded?: number;
};

export async function unlockSelfReportedAchievement(
  _prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const user = await requireUser();
  const achievementId = String(formData.get("achievementId") ?? "");
  const collectionSlug = String(formData.get("collectionSlug") ?? "");
  if (!achievementId) return { error: "Missing achievement." };

  const today = localDateInTimezone(new Date(), user.timezone);
  const result = await unlockAchievement(await getDb(), {
    userId: user.id,
    achievementId,
    today,
  });

  if (!result.ok) {
    return {
      error:
        result.reason === "prerequisites"
          ? "Finish the earlier achievements in this collection first."
          : "That achievement could not be found.",
    };
  }

  revalidatePath("/achieve");
  if (collectionSlug) revalidatePath(`/achieve/${collectionSlug}`);
  revalidatePath("/memories");
  revalidatePath("/profile");
  revalidatePath("/today");

  return {
    xpAwarded: result.xpAwarded,
    masteryXpAwarded: result.masteryXpAwarded,
  };
}
