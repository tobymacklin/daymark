import Link from "next/link";
import { notFound } from "next/navigation";
import { MasterySeal } from "@/components/achievements/mastery-seal";
import { getCollection } from "@/features/achievements/service";
import { requireUser } from "@/lib/authentication/current-user";
import { hobbyName } from "@/lib/artwork";
import { getDb } from "@/lib/database";
import { formatMedium, localDateInTimezone } from "@/lib/dates";

export const instant = false;

type MasteryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MasteryPage({ params }: MasteryPageProps) {
  const { slug } = await params;
  const user = await requireUser();
  const collection = await getCollection(await getDb(), user.id, slug);
  if (!collection) notFound();

  const label = hobbyName(collection.slug, collection.name);
  const title = `${label} Mastery`;
  const remaining = collection.achievements.filter((item) => item.state !== "unlocked");
  const earnedAt = collection.achievements.reduce<string | null>((latest, item) => {
    if (!item.unlockedAt) return latest;
    if (!latest || item.unlockedAt > latest) return item.unlockedAt;
    return latest;
  }, null);

  return (
    <div>
      <Link
        href={`/achieve/${collection.slug}`}
        className="inline-flex min-h-12 items-center text-[1rem] font-medium text-action-green underline-offset-4 hover:underline"
      >
        Back to {label}
      </Link>

      <div className="mt-2 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
        <MasterySeal theme={collection.theme} size="detail" earned={collection.mastered} />
        <div>
          <p className="text-[0.875rem] text-ink-soft">{label}</p>
          <h1 className="mt-1 font-display text-[1.75rem] font-semibold leading-tight tracking-tight">{title}</h1>
          <p className="mt-1 text-[1rem] font-medium text-ink-soft">
            Mastery
            <span className="whitespace-nowrap tabular"> · {collection.masteryXp} XP</span>
          </p>
          <p className="mt-2 text-[1.0625rem] leading-7">
            The exclusive achievement for completing every {label} goal. One per collection.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-[1.0625rem] font-semibold">How you complete it</h2>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-[1.0625rem] leading-7">
          <li>Finish every achievement in {label}.</li>
          <li>Daymark awards the XP with the achievement that completes the collection.</li>
        </ul>
      </div>

      <div className="mt-5">
        {collection.mastered ? (
          <p className="text-[1.0625rem] text-action-green">
            Earned
            {earnedAt ? ` on ${formatMedium(localDateInTimezone(new Date(earnedAt), user.timezone))}` : ""}.
          </p>
        ) : (
          <>
            <p className="text-[1.0625rem] leading-7">
              {remaining.length === 1 ? "1 achievement" : `${remaining.length} achievements`} still to complete.
            </p>
            <ul className="mt-2 space-y-1">
              {remaining.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/achieve/${collection.slug}/${item.slug}`}
                    className="inline-flex min-h-12 items-center text-[1.0625rem] font-medium text-action-green underline-offset-4 hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
