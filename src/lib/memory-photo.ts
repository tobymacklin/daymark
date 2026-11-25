import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { mediaRoot, memoryImageRelative } from "@/lib/media";

const MAX_BYTES = 4_000_000;

export function extensionFor(type: string): "jpg" | "png" | "webp" | null {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return null;
}

export function photoFile(value: FormDataEntryValue): File | null {
  if (!(value instanceof File) || value.size <= 0) return null;
  return value;
}

export function photoProblem(file: File): string | null {
  if (file.size > MAX_BYTES) return "Choose a photo under 4 MB.";
  if (!extensionFor(file.type)) return "Use a JPEG, PNG, or WebP photo.";
  return null;
}

export async function writeMemoryPhoto(userId: string, memoryId: string, file: File): Promise<string> {
  const ext = extensionFor(file.type);
  if (!ext) throw new Error("Unsupported photo.");
  const imagePath = memoryImageRelative(userId, memoryId, ext);
  const dest = path.join(mediaRoot(), imagePath);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await file.arrayBuffer()));
  return imagePath;
}
