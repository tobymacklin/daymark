import Link from "next/link";
import { notFound } from "next/navigation";
import { AchievementBoard } from "@/components/achievements/achievement-board";
import { getCollection } from "@/features/achievements/service";
import { requireUser } from "@/lib/authentication/current-user";
import { achievementArtSrc } from "@/lib/achievement-art";
import { hobbyImage, hobbyName } from "@/lib/artwork";
import { getDb } from "@/lib/database";

export const instant = false;

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const user = await requireUser();
  const collection = await getCollection(await getDb(), user.id, slug);
  if (!collection) notFound();

  const label = hobbyName(collection.slug, collection.name);
  const image = hobbyImage(collection.slug);

  return (
    <div>
      <Link
        href="/achieve"
        className="inline-flex min-h-12 items-center text-[1rem] font-medium text-action-green underline-offset-4 hover:underline"
      >
        Explore
      </Link>

      {image ? (
        <img src={image} alt="" className="mt-2 aspect-video w-full rounded-2xl object-cover" />
      ) : null}

      <h1 className="mt-4 font-display text-[1.75rem] font-semibold tracking-tight">{label}</h1>
      <p className="mt-1 text-[1.0625rem] leading-7 text-ink-soft">{collection.tagline}</p>

      <AchievementBoard
        collectionSlug={collection.slug}
        unlocked={collection.unlocked}
        total={collection.total}
        mastery={{
          title: `${label} Mastery`,
          xp: collection.masteryXp,
          earned: collection.mastered,
          theme: collection.theme,
        }}
        items={collection.achievements.map((achievement) => ({
          slug: achievement.slug,
          title: achievement.title,
          rarity: achievement.rarity,
          xp: achievement.xp,
          state: achievement.state,
          art: achievementArtSrc(achievement.slug),
        }))}
      />
    </div>
  );
}
