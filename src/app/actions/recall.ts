"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { localDateInTimezone } from "@/lib/dates";
import {
  answerHint,
  completeReview,
  peekReview,
  snoozeReview,
  type RevealedMemory,
} from "@/features/recall/service";

export type RecallState = {
  error?: string;
  revealed?: RevealedMemory;
  result?: "remembered" | "recognized" | "revealed";
  correct?: boolean;
};

export async function submitFreeRecall(
  _prev: RecallState,
  formData: FormData,
): Promise<RecallState> {
  const user = await requireUser();
  const reviewId = String(formData.get("reviewId") ?? "");
  const response = String(formData.get("response") ?? "");
  if (!reviewId) return { error: "Nothing to recall right now." };

  const today = localDateInTimezone(new Date(), user.timezone);
  const outcome = await completeReview(await getDb(), {
    userId: user.id,
    reviewId,
    result: "remembered",
    response,
    today,
  });
  if (!outcome) return { error: "That recall is no longer available." };

  revalidatePath("/memories");
  revalidatePath("/memories/recall");
  return { revealed: outcome.memory, result: outcome.result };
}

export async function revealMemory(
  _prev: RecallState,
  formData: FormData,
): Promise<RecallState> {
  const user = await requireUser();
  const reviewId = String(formData.get("reviewId") ?? "");
  if (!reviewId) return { error: "Nothing to recall right now." };

  const today = localDateInTimezone(new Date(), user.timezone);
  const outcome = await completeReview(await getDb(), {
    userId: user.id,
    reviewId,
    result: "revealed",
    today,
  });
  if (!outcome) return { error: "That recall is no longer available." };

  revalidatePath("/memories");
  revalidatePath("/memories/recall");
  return { revealed: outcome.memory, result: outcome.result };
}

export async function chooseHintOption(
  _prev: RecallState,
  formData: FormData,
): Promise<RecallState> {
  const user = await requireUser();
  const reviewId = String(formData.get("reviewId") ?? "");
  const optionId = String(formData.get("optionId") ?? "");
  if (!reviewId || !optionId) return { error: "Choose one of the options." };

  const today = localDateInTimezone(new Date(), user.timezone);
  const outcome = await answerHint(await getDb(), {
    userId: user.id,
    reviewId,
    optionId,
    today,
  });
  if (!outcome) return { error: "That recall is no longer available." };

  revalidatePath("/memories");
  revalidatePath("/memories/recall");
  return { revealed: outcome.memory, result: outcome.result, correct: outcome.correct };
}

export async function peekRecallMemory(formData: FormData): Promise<RevealedMemory | null> {
  const user = await requireUser();
  const reviewId = String(formData.get("reviewId") ?? "");
  if (!reviewId) return null;
  return peekReview(await getDb(), user.id, reviewId);
}

export async function snoozeRecall(formData: FormData): Promise<void> {
  const user = await requireUser();
  const reviewId = String(formData.get("reviewId") ?? "");
  if (!reviewId) return;
  const today = localDateInTimezone(new Date(), user.timezone);
  await snoozeReview(await getDb(), { userId: user.id, reviewId, today });
  revalidatePath("/memories");
  revalidatePath("/memories/recall");
}
