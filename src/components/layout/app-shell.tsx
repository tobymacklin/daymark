import type { ReactNode } from "react";
import { DaymarkMark, DaymarkWordmark } from "@/components/brand/mark";
import { TabNav } from "./tab-nav";

type AppShellProps = {
  children: ReactNode;
  streak?: number;
  eyebrow?: string;
};

export function AppShell({ children, streak, eyebrow }: AppShellProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-paper text-forest-ink">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-forest-ink/10 bg-paper md:flex">
        <div className="flex items-center gap-2 px-5 pb-2 pt-7">
          <DaymarkMark className="h-6 w-6 text-action-green" />
          <DaymarkWordmark className="text-2xl leading-none" />
        </div>
        {typeof streak === "number" ? (
          <p className="px-5 pb-4 text-xs tracking-wide text-forest-ink/55">
            <span className="tabular">{streak}</span> {streak === 1 ? "day" : "days"} in the field
          </p>
        ) : null}
        <TabNav orientation="side" />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex shrink-0 items-center justify-between border-b border-forest-ink/10 px-5 py-3 md:hidden"
          style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
        >
          <div className="flex items-center gap-2">
            <DaymarkMark className="h-6 w-6 text-action-green" />
            <DaymarkWordmark className="text-[1.65rem] leading-none" />
          </div>
          {typeof streak === "number" ? (
            <p className="text-xs tracking-wide text-forest-ink/60">
              <span className="tabular">{streak}</span> {streak === 1 ? "day" : "days"}
            </p>
          ) : null}
          {eyebrow ? <span className="sr-only">{eyebrow}</span> : null}
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-24 pt-5 md:px-10 md:pb-16 md:pt-8">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>
      </div>

      <TabNav />
    </div>
  );
}
