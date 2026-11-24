import Link from "next/link";
import { BookwormBadge, BookwormCover } from "@/components/art/bookworm";
import type { Achievement, CollectionDetail } from "@/features/achievements/service";

export function BookwormCase({ collection }: { collection: CollectionDetail }) {
  const next = collection.achievements.find((item) => item.state === "available");
  const fraction = collection.total === 0 ? 0 : collection.unlocked / collection.total;

  return (
    <div>
      <Link href="/achieve" className="text-[11px] uppercase tracking-[0.18em] text-forest-ink/50">
        Collections
      </Link>

      <div className="mt-4">
        <BookwormCover />
      </div>

      <header className="mt-5 border-b border-forest-ink/15 pb-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-forest-ink/50">
          Field guide {String(collection.number).padStart(2, "0")}
        </p>
        <h1 className="mt-2 font-display text-5xl leading-none">{collection.name}</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-forest-ink/75">{collection.description}</p>
        <p className="mt-4 text-sm tabular text-forest-ink/70">
          {collection.unlocked} kept of {collection.total}
          {collection.mastered ? " · Mastered" : ""}
        </p>
        <div className="mt-2 h-px w-full bg-forest-ink/10">
          <div className="h-px bg-muted-gold" style={{ width: `${Math.round(fraction * 100)}%` }} />
        </div>
      </header>

      {next ? (
        <p className="mt-5 text-sm leading-6">
          <span className="text-forest-ink/50">Next in reach · </span>
          <Link href={`/achieve/${collection.slug}/${next.slug}`} className="underline decoration-forest-ink/30 underline-offset-4">
            {next.title}
          </Link>
          <span className="text-forest-ink/60"> — {next.description}</span>
        </p>
      ) : null}

      <h2 className="mt-8 text-[11px] uppercase tracking-[0.2em] text-forest-ink/50">Trophy case</h2>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
        {collection.achievements.map((achievement) => (
          <li key={achievement.id}>
            <Trophy achievement={achievement} collectionSlug={collection.slug} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Trophy({ achievement, collectionSlug }: { achievement: Achievement; collectionSlug: string }) {
  return (
    <Link href={`/achieve/${collectionSlug}/${achievement.slug}`} className="group block">
      <BookwormBadge
        motif={achievement.motif}
        rarity={achievement.rarity}
        locked={achievement.state === "locked"}
        title={achievement.title}
      />
      <span className="mt-1 block text-center font-display text-lg leading-tight group-hover:underline">
        {achievement.title}
      </span>
      <span className="mt-1 block text-center text-[11px] uppercase tracking-[0.14em] text-forest-ink/45">
        {achievement.state === "unlocked" ? "Kept" : achievement.state === "available" ? "Open" : "Ahead"}
        {" · "}
        {achievement.xp} XP
      </span>
    </Link>
  );
}
