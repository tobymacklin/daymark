import Link from "next/link";
import { RecallPanel } from "@/components/memories/recall-panel";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { localDateInTimezone } from "@/lib/dates";
import { getDueReview, getHintOptions } from "@/features/recall/service";

export const metadata = { title: "Recall" };

export default async function RecallPage() {
  const user = await requireUser();
  const db = await getDb();
  const today = localDateInTimezone(new Date(), user.timezone);
  const review = await getDueReview(db, user.id, today);
  const hints = review ? ((await getHintOptions(db, user.id, review.id)) ?? []) : [];

  return (
    <div className="space-y-6">
      <Link href="/memories" className="text-sm text-forest-ink/60 underline-offset-4 hover:underline">
        Back to memories
      </Link>

      {review ? (
        <RecallPanel review={review} hints={hints} />
      ) : (
        <section className="rounded-[var(--radius-card)] bg-slate px-5 py-8 text-warm-cream">
          <p className="text-xs uppercase tracking-[0.16em] text-sage">Your week in moments</p>
          <h1 className="mt-3 font-display text-3xl leading-tight">Nothing due right now.</h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-warm-cream/75">
            After you complete experiences, gentle recall questions appear a few
            days later. There is no penalty for forgetting — only a chance to
            revisit what you did.
          </p>
        </section>
      )}
    </div>
  );
}
