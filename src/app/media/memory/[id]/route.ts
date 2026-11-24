import { readFile } from "node:fs/promises";
import { getCurrentUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { contentTypeFor, resolveMemoryImage } from "@/lib/media";
import { getMemory } from "@/features/memories/service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return new Response("Sign in to see this photo.", { status: 401 });

  const { id } = await context.params;
  const memory = await getMemory(await getDb(), user.id, id);
  if (!memory?.imagePath) return new Response("Not found.", { status: 404 });

  const file = resolveMemoryImage(memory.imagePath);
  if (!file) return new Response("Not found.", { status: 404 });

  try {
    const bytes = await readFile(file);
    return new Response(bytes, {
      headers: {
        "Content-Type": contentTypeFor(memory.imagePath),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found.", { status: 404 });
  }
}
