import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DaymarkMark, DaymarkWordmark } from "@/components/brand/mark";
import { getCurrentUser } from "@/lib/authentication/current-user";

export default function HomePage() {
  return (
    <Suspense fallback={<LandingShell />}>
      <HomeGate />
    </Suspense>
  );
}

async function HomeGate() {
  const user = await getCurrentUser();
  if (user) redirect("/today");
  return <LandingShell />;
}

function LandingShell() {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-paper text-forest-ink">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(167,197,182,0.35), transparent 40%), radial-gradient(circle at 80% 0%, rgba(217,183,125,0.28), transparent 35%), linear-gradient(180deg, #faf7f0 0%, #f4ead9 100%)",
        }}
        aria-hidden
      />
      <header className="relative mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-2">
          <DaymarkMark className="h-7 w-7 text-action-green" />
          <DaymarkWordmark className="text-2xl" />
        </div>
        <Link href="/onboarding" className="text-sm font-medium text-forest-ink/75 hover:text-forest-ink">
          Enter
        </Link>
      </header>

      <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 pb-16 pt-10 sm:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-forest-ink/55">
          One experience · A lifetime of moments
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-[42px] leading-[1.05] tracking-tight sm:text-[64px] sm:leading-[1.02]">
          Make today different enough to remember.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-forest-ink/75">
          A calm daily ritual for real life: one free experience, collectible
          achievements, and a private archive of moments that actually happened.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/onboarding"
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] bg-action-green px-5 text-[15px] font-medium text-warm-cream transition-colors hover:bg-action-green-hover"
          >
            Start today
          </Link>
          <p className="text-sm text-forest-ink/60">
            No account email yet · progress stays on this device
          </p>
        </div>

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Today",
              copy: "One shared real-world prompt. Five to ten minutes. Free, at home, no purchases.",
            },
            {
              title: "Achieve",
              copy: "Hobby collections with rarity, XP, and clear goals you unlock in the real world.",
            },
            {
              title: "Remember",
              copy: "A private timeline and gentle recall — pride without punishment.",
            },
          ].map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-[var(--radius-card)] bg-surface/80 p-5 shadow-[var(--shadow-soft)]"
            >
              <h2 className="font-display text-2xl">{pillar.title}</h2>
              <p className="mt-2 text-sm leading-6 text-forest-ink/70">{pillar.copy}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
