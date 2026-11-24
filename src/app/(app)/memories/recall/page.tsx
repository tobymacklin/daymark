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
        <section className="rounded-2xl bg-sage px-5 py-6">
          <h1 className="font-display text-[1.75rem] font-semibold leading-tight">Nothing is waiting.</h1>
          <p className="mt-2 max-w-md text-[1.0625rem] leading-7">
            After you keep an experience, a gentle question appears a few days later. There is no timer and no penalty for setting it aside.
          </p>
        </section>
      )}
    </div>
  );
}
