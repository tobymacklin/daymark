import Link from "next/link";
import { notFound } from "next/navigation";
import { AchievementArtwork } from "@/components/achievements/achievement-artwork";
import { UnlockForm } from "@/components/achievements/unlock-form";
import { getCollection } from "@/features/achievements/service";
import { requireUser } from "@/lib/authentication/current-user";
import { achievementArtSrc } from "@/lib/achievement-art";
import { hobbyName } from "@/lib/artwork";
import { getDb } from "@/lib/database";
import { formatMedium, localDateInTimezone } from "@/lib/dates";
import { RARITY_LABEL } from "@/lib/theme";

export const instant = false;

type AchievementPageProps = {
  params: Promise<{ slug: string; achievement: string }>;
};

export default async function AchievementDetailPage({ params }: AchievementPageProps) {
  const { slug, achievement: achievementSlug } = await params;
  const user = await requireUser();
  const collection = await getCollection(await getDb(), user.id, slug);
  if (!collection) notFound();

  const achievement = collection.achievements.find((item) => item.slug === achievementSlug);
  if (!achievement) notFound();

  const label = hobbyName(collection.slug, collection.name);
  const lockedReason =
    achievement.state === "locked"
      ? `This comes after ${achievement.prerequisites
          .filter((item) => !item.unlocked)
          .map((item) => item.title)
          .join(", ")}.`
      : undefined;

  return (
    <div>
      <Link
        href={`/achieve/${collection.slug}`}
        className="inline-flex min-h-12 items-center text-[1rem] font-medium text-action-green underline-offset-4 hover:underline"
      >
        Back to {label}
      </Link>

      <div className="mt-2 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
        <AchievementArtwork
          slug={achievement.slug}
          title={achievement.title}
          size="detail"
          earned={achievement.state === "unlocked"}
        />
        <div>
          <p className="text-[0.875rem] text-ink-soft">{label}</p>
          <h1 className="mt-1 font-display text-[1.75rem] font-semibold leading-tight tracking-tight">
            {achievement.title}
          </h1>
          <p className="mt-1 text-[1rem] font-medium text-ink-soft">
            {RARITY_LABEL[achievement.rarity]} · {achievement.xp} XP
          </p>
          <p className="mt-2 text-[1.0625rem] leading-7">{achievement.description}</p>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 text-[1.0625rem] sm:grid-cols-2">
        <div>
          <dt className="text-[0.875rem] text-ink-soft">Time</dt>
          <dd className="mt-0.5">{achievement.estimatedTime}</dd>
        </div>
        <div>
          <dt className="text-[0.875rem] text-ink-soft">Cost</dt>
          <dd className="mt-0.5">{achievement.estimatedCost}</dd>
        </div>
      </dl>

      {achievement.materials.length > 0 ? (
        <div className="mt-4">
          <h2 className="text-[1.0625rem] font-semibold">What you’ll need</h2>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-[1.0625rem] leading-7">
            {achievement.materials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {achievement.criteria.length > 0 ? (
        <div className="mt-4">
          <h2 className="text-[1.0625rem] font-semibold">How you complete it</h2>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-[1.0625rem] leading-7">
            {achievement.criteria.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {achievement.safetyNotes ? (
        <p className="mt-4 rounded-xl bg-sage px-3 py-2 text-[1rem] leading-6">{achievement.safetyNotes}</p>
      ) : null}

      <div className="mt-5">
        {achievement.state === "unlocked" ? (
          <p className="text-[1.0625rem] text-action-green">
            Completed
            {achievement.unlockedAt
              ? ` on ${formatMedium(localDateInTimezone(new Date(achievement.unlockedAt), user.timezone))}`
              : ""}
            .
          </p>
        ) : (
          <UnlockForm
            achievementId={achievement.id}
            collectionSlug={collection.slug}
            disabled={achievement.state === "locked"}
            disabledReason={lockedReason}
            artworkSrc={achievementArtSrc(achievement.slug)}
            title={achievement.title}
            rarityLabel={RARITY_LABEL[achievement.rarity]}
            xp={achievement.xp}
            collectionLabel={label}
          />
        )}
      </div>
    </div>
  );
}
