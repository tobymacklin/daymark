"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { isLocalDate, localDateInTimezone } from "@/lib/dates";
import { mediaRoot, memoryImageRelative } from "@/lib/media";
import { NOTE_MAX_LENGTH, updateMemory } from "@/features/memories/service";

export type MemoryEditState = {
  error?: string;
  saved?: boolean;
};

function extensionFor(type: string): "jpg" | "png" | "webp" | null {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return null;
}

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
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    if (file.size > 4_000_000) return { error: "Choose a photo under 4 MB." };
    const ext = extensionFor(file.type);
    if (!ext) return { error: "Use a JPEG, PNG, or WebP photo." };
    try {
      imagePath = memoryImageRelative(user.id, memoryId, ext);
    } catch {
      return { error: "That memory could not be updated." };
    }
    const dest = path.join(mediaRoot(), imagePath);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, Buffer.from(await file.arrayBuffer()));
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
  return { saved: true };
}
