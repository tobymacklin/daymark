import Link from "next/link";
import { notFound } from "next/navigation";
import { BookwormCase } from "@/components/achievements/bookworm-case";
import { AchievementTile } from "@/components/achievements/achievement-tile";
import { AchievementMotif } from "@/components/achievements/motifs";
import { getCollection } from "@/features/achievements/service";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { themeColor } from "@/lib/theme";

export const metadata = { title: "Collection" };

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const user = await requireUser();
  const collection = await getCollection(await getDb(), user.id, slug);
  if (!collection) notFound();

  const color = themeColor(collection.theme);

  if (collection.slug === "bookworm") {
    return <BookwormCase collection={collection} />;
  }

  return (
    <div className="space-y-6">
      <Link href="/achieve" className="text-sm text-forest-ink/60 underline-offset-4 hover:underline">
        All collections
      </Link>

      <section
        className="overflow-hidden rounded-[var(--radius-hero)] px-6 py-7 text-warm-cream shadow-[var(--shadow-soft)]"
        style={{ background: color }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-warm-cream/70">
              Collection / {String(collection.number).padStart(3, "0")}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight">{collection.name}</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-warm-cream/85">
              {collection.description}
            </p>
            <p className="mt-5 tabular text-sm">
              {collection.unlocked} of {collection.total} unlocked
              {collection.mastered ? " · Mastered" : ""}
            </p>
          </div>
          <AchievementMotif motif={collection.emblem} className="h-16 w-16 shrink-0" />
        </div>
      </section>

      <div className="space-y-3">
        {collection.achievements.map((achievement) => (
          <AchievementTile
            key={achievement.id}
            achievement={achievement}
            collectionSlug={collection.slug}
            themeColor={color}
          />
        ))}
      </div>
    </div>
  );
}
