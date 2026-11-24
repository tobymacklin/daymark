import Link from "next/link";
import { notFound } from "next/navigation";
import { BookwormBadge } from "@/components/art/bookworm";
import { AchievementBadge } from "@/components/achievements/badge";
import { UnlockForm } from "@/components/achievements/unlock-form";
import { getCollection } from "@/features/achievements/service";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { formatMedium } from "@/lib/dates";
import { RARITY_LABEL, themeColor } from "@/lib/theme";

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

  const color = themeColor(collection.theme);
  const lockedReason =
    achievement.state === "locked"
      ? `Requires: ${achievement.prerequisites
          .filter((item) => !item.unlocked)
          .map((item) => item.title)
          .join(", ")}`
      : undefined;

  return (
    <div className="space-y-6">
      <Link
        href={`/achieve/${collection.slug}`}
        className="text-sm text-forest-ink/60 underline-offset-4 hover:underline"
      >
        Back to {collection.name}
      </Link>

      <section className="border-t border-forest-ink/10 pt-6">
        <div className="flex items-start gap-5">
          {slug === "bookworm" ? (
            <div className="w-28 shrink-0">
              <BookwormBadge
                motif={achievement.motif}
                rarity={achievement.rarity}
                locked={achievement.state === "locked"}
                title={achievement.title}
              />
            </div>
          ) : (
            <AchievementBadge
              motif={achievement.motif}
              rarity={achievement.rarity}
              themeColor={color}
              state={achievement.state}
              size="lg"
            />
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-forest-ink/50">
              {RARITY_LABEL[achievement.rarity]} · +{achievement.xp} XP
            </p>
            <h1 className="mt-2 font-display text-3xl leading-tight">{achievement.title}</h1>
            <p className="mt-3 text-sm leading-6 text-forest-ink/75">{achievement.description}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-[var(--radius-control)] bg-warm-cream/70 px-3 py-2">
            <dt className="text-xs uppercase tracking-wide text-forest-ink/50">Time</dt>
            <dd className="mt-1">{achievement.estimatedTime}</dd>
          </div>
          <div className="rounded-[var(--radius-control)] bg-warm-cream/70 px-3 py-2">
            <dt className="text-xs uppercase tracking-wide text-forest-ink/50">Cost</dt>
            <dd className="mt-1">{achievement.estimatedCost}</dd>
          </div>
        </dl>

        {achievement.materials.length > 0 ? (
          <div className="mt-5">
            <h2 className="text-sm font-medium">Materials</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-forest-ink/75">
              {achievement.materials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {achievement.criteria.length > 0 ? (
          <div className="mt-5">
            <h2 className="text-sm font-medium">What counts</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-forest-ink/75">
              {achievement.criteria.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {achievement.safetyNotes ? (
          <p className="mt-5 rounded-[var(--radius-control)] bg-warm-cream px-3 py-2 text-sm text-forest-ink/80">
            Safety: {achievement.safetyNotes}
          </p>
        ) : null}

        <div className="mt-6 border-t border-border-soft pt-5">
          {achievement.state === "unlocked" ? (
            <p className="text-sm text-action-green">
              Unlocked
              {achievement.unlockedAt
                ? ` on ${formatMedium(achievement.unlockedAt.slice(0, 10))}`
                : ""}
              .
            </p>
          ) : (
            <UnlockForm
              achievementId={achievement.id}
              collectionSlug={collection.slug}
              disabled={achievement.state === "locked"}
              disabledReason={lockedReason}
            />
          )}
        </div>
      </section>
    </div>
  );
}
