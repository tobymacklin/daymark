import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createSupabase, supabaseConfigured } from "@/lib/authentication/supabase";
import { contentTypeFor, mediaRoot, memoryImageRelative, resolveMemoryImage } from "@/lib/media";

const BUCKET = "memories";
const MAX_BYTES = 4_000_000;
const copiedProfiles = new Set<string>();

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
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (await storageReady()) {
    await uploadBytes(imagePath, bytes, file.type);
    return imagePath;
  }
  await writeLocal(imagePath, bytes);
  return imagePath;
}

/** Copies photos already saved on this computer into storage. Runs once per profile per process. */
export async function copyLocalMemoryPhotos(userId: string, imagePaths: string[]): Promise<void> {
  if (!supabaseConfigured() || copiedProfiles.has(userId)) return;
  if (!(await storageReady())) return;
  copiedProfiles.add(userId);
  for (const imagePath of imagePaths) {
    const local = await readLocal(imagePath);
    if (!local) continue;
    try {
      await uploadBytes(imagePath, local, contentTypeFor(imagePath));
    } catch (error) {
      copiedProfiles.delete(userId);
      console.error("[daymark] could not copy a photo to storage", storageMessage(error));
    }
  }
}

export async function readMemoryPhoto(
  relativePath: string,
): Promise<{ bytes: Uint8Array; contentType: string } | null> {
  if (!resolveMemoryImage(relativePath)) return null;
  const contentType = contentTypeFor(relativePath);
  if (await storageReady()) {
    const stored = await downloadStored(relativePath);
    if (stored) return { bytes: stored, contentType };
    const local = await readLocal(relativePath);
    if (!local) return null;
    try {
      await uploadBytes(relativePath, local, contentType);
    } catch (error) {
      console.error("[daymark] could not copy a photo to storage", storageMessage(error));
    }
    return { bytes: local, contentType };
  }
  const local = await readLocal(relativePath);
  return local ? { bytes: local, contentType } : null;
}

/** Removes every photo in this profile's folder. Call while the person is still signed in. */
export async function removeProfilePhotos(userId: string): Promise<void> {
  if (!(await storageReady())) return;
  const supabase = await createSupabase();
  const { data, error } = await supabase.storage.from(BUCKET).list(userId, { limit: 100 });
  if (error) {
    console.error("[daymark] could not list photos to delete", error.message);
    return;
  }
  const paths = (data ?? []).filter((file) => file.id).map((file) => `${userId}/${file.name}`);
  if (paths.length === 0) return;
  const removed = await supabase.storage.from(BUCKET).remove(paths);
  if (removed.error) console.error("[daymark] could not delete photos", removed.error.message);
}

async function storageReady(): Promise<boolean> {
  if (!supabaseConfigured()) return false;
  const supabase = await createSupabase();
  const { data } = await supabase.auth.getUser();
  return Boolean(data.user);
}

async function uploadBytes(imagePath: string, bytes: Uint8Array, contentType: string): Promise<void> {
  const supabase = await createSupabase();
  const { error } = await supabase.storage.from(BUCKET).upload(imagePath, bytes, {
    contentType,
    upsert: true,
  });
  if (error) {
    console.error("[daymark] photo upload failed", error.message);
    throw new Error("Photo upload failed.");
  }
}

async function downloadStored(imagePath: string): Promise<Uint8Array | null> {
  const supabase = await createSupabase();
  const { data, error } = await supabase.storage.from(BUCKET).download(imagePath);
  if (error || !data) return null;
  return new Uint8Array(await data.arrayBuffer());
}

async function readLocal(imagePath: string): Promise<Uint8Array | null> {
  const file = resolveMemoryImage(imagePath);
  if (!file) return null;
  try {
    return new Uint8Array(await readFile(file));
  } catch {
    return null;
  }
}

async function writeLocal(imagePath: string, bytes: Uint8Array): Promise<void> {
  const dest = path.join(mediaRoot(), imagePath);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, bytes);
}

function storageMessage(error: unknown): string {
  return error instanceof Error ? error.message : "unknown";
}
