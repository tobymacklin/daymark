import { CollectionCard } from "@/components/achievements/collection-card";
import { listCollections } from "@/features/achievements/service";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";

export const metadata = { title: "Achieve" };

export default async function AchievePage() {
  const user = await requireUser();
  const collections = await listCollections(await getDb(), user.id);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.16em] text-forest-ink/50">Achieve</p>
        <h1 className="mt-2 font-display text-4xl leading-tight">Collections</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-forest-ink/70">
          Find your next real-world accomplishment. Locked goals stay visible so
          you know what you are working toward.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}
