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
          <DaymarkMark className="h-8 w-8" title="" />
          <DaymarkWordmark className="text-[17px] leading-none" />
        </div>
        {typeof streak === "number" && streak > 0 ? (
          <p className="px-5 pb-4 text-sm text-ink-soft">
            <span className="tabular">{streak}</span> {streak === 1 ? "day" : "days"}
          </p>
        ) : null}
        <TabNav orientation="side" />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex shrink-0 items-center justify-between px-5 py-2 md:hidden"
          style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
        >
          <div className="flex items-center gap-2">
            <DaymarkMark className="h-8 w-8" title="" />
            <DaymarkWordmark className="text-[17px] leading-none" />
          </div>
          {eyebrow ? <span className="sr-only">{eyebrow}</span> : null}
          {typeof streak === "number" && streak > 0 ? (
            <p className="sr-only">
              {streak} {streak === 1 ? "day" : "days"}
            </p>
          ) : null}
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-32 pt-4 md:px-10 md:pb-16 md:pt-8">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>
      </div>

      <TabNav />
    </div>
  );
}
