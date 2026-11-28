import { getCurrentUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { readMemoryPhoto } from "@/lib/memory-photo";
import { getMemory } from "@/features/memories/service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return new Response("Sign in to see this photo.", { status: 401 });

  const { id } = await context.params;
  const memory = await getMemory(await getDb(), user.id, id);
  if (!memory?.imagePath) return new Response("Not found.", { status: 404 });

  const photo = await readMemoryPhoto(memory.imagePath);
  if (!photo) return new Response("Not found.", { status: 404 });

  return new Response(Buffer.from(photo.bytes), {
    headers: {
      "Content-Type": photo.contentType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
