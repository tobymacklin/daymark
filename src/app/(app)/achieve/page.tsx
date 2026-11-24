import { ExploreBrowser } from "@/components/achievements/explore-browser";
import { listCollections } from "@/features/achievements/service";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";

export const instant = false;
export const metadata = { title: "Explore" };

export default async function AchievePage() {
  const user = await requireUser();
  const collections = await listCollections(await getDb(), user.id);

  return (
    <ExploreBrowser
      hobbies={collections.map((collection) => ({
        slug: collection.slug,
        name: collection.name,
        tagline: collection.tagline,
        total: collection.total,
        unlocked: collection.unlocked,
      }))}
    />
  );
}
