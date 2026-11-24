"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/today", label: "Today" },
  { href: "/achieve", label: "Achieve" },
  { href: "/memories", label: "Memories" },
  { href: "/profile", label: "Profile" },
] as const;

function TabIcon({ href }: { href: (typeof TABS)[number]["href"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const };
  if (href === "/today") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path d="M4 15.5c3.2-2.4 6.6-3.6 8-3.6s4.8 1.2 8 3.6" {...common} />
        <circle cx="12" cy="8.5" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (href === "/achieve") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <circle cx="12" cy="10" r="5.5" {...common} />
        <path d="M9 15.2 8 20l4-1.6L16 20l-1-4.8" {...common} />
      </svg>
    );
  }
  if (href === "/memories") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path d="M7 5.5h8.5L19 9v9.5H7z" {...common} />
        <path d="M15.5 5.5V9H19" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <circle cx="12" cy="9" r="3" {...common} />
      <path d="M6.5 18.5c1.2-2.4 3-3.6 5.5-3.6s4.3 1.2 5.5 3.6" {...common} />
    </svg>
  );
}

export function TabNav({ orientation = "bottom" }: { orientation?: "bottom" | "side" }) {
  const pathname = usePathname();
  const side = orientation === "side";

  return (
    <nav
      aria-label="Primary"
      className={
        side
          ? "flex flex-1 flex-col px-3 py-4"
          : "fixed inset-x-0 bottom-0 z-40 border-t border-forest-ink/10 bg-paper md:hidden"
      }
      style={side ? undefined : { paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className={side ? "flex flex-col gap-1" : "mx-auto grid max-w-lg grid-cols-4"}>
        {TABS.map((tab) => {
          const active = pathname === tab.href || (tab.href !== "/today" && pathname.startsWith(tab.href));
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={
                  side
                    ? `flex min-h-11 items-center gap-3 px-3 text-sm ${
                        active ? "bg-warm-cream font-semibold text-forest-ink" : "text-forest-ink/70 hover:bg-warm-cream/50"
                      }`
                    : `flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] tracking-wide ${
                        active ? "text-forest-ink" : "text-forest-ink/45"
                      }`
                }
                aria-current={active ? "page" : undefined}
              >
                <TabIcon href={tab.href} />
                {tab.label}
                {!side && active ? <span className="h-px w-4 bg-action-green" aria-hidden /> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
