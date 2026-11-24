import path from "node:path";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function mediaRoot(): string {
  return path.resolve(process.cwd(), ".daymark", "media");
}

/** A stored image path is always `{userId}/{memoryId}.{ext}` and never user-typed. */
export function memoryImageRelative(userId: string, memoryId: string, ext: "jpg" | "png" | "webp"): string {
  if (!UUID.test(userId) || !UUID.test(memoryId)) {
    throw new Error("Invalid media path.");
  }
  return `${userId}/${memoryId}.${ext}`;
}

export function resolveMemoryImage(relativePath: string): string | null {
  const root = mediaRoot();
  const resolved = path.resolve(root, relativePath);
  if (!resolved.startsWith(root + path.sep)) return null;
  return resolved;
}

export function contentTypeFor(relativePath: string): string {
  if (relativePath.endsWith(".png")) return "image/png";
  if (relativePath.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}
