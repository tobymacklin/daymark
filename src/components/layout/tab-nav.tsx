"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/today", label: "Today", hint: "Daily experience" },
  { href: "/achieve", label: "Explore", hint: "Hobbies and achievements" },
  { href: "/memories", label: "Memories", hint: "Journal and recall" },
  { href: "/profile", label: "You", hint: "Personal progress" },
] as const;

function TabIcon({ href }: { href: (typeof TABS)[number]["href"] }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (href === "/today") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <circle cx="12" cy="12" r="3.25" {...common} />
        <path d="M12 3.5v1.8M12 18.7v1.8M3.5 12h1.8M18.7 12h1.8M6 6l1.3 1.3M16.7 16.7 18 18M18 6l-1.3 1.3M7.3 16.7 6 18" {...common} />
      </svg>
    );
  }
  if (href === "/achieve") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <circle cx="12" cy="12" r="7.25" {...common} />
        <circle cx="12" cy="12" r="2" {...common} />
        <path d="M12 4.75v2.2M16.2 7.2l-1.2 1.6" {...common} />
      </svg>
    );
  }
  if (href === "/memories") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path d="M7 5.5h7.2L18 9.2V18.5H7z" {...common} />
        <path d="M14.2 5.6V9H18M9.5 12.5h5.5M9.5 15.5h4" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <circle cx="12" cy="9" r="3" {...common} />
      <path d="M6.5 18.5c1.1-2.5 2.9-3.7 5.5-3.7s4.4 1.2 5.5 3.7" {...common} />
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
          ? "flex flex-1 flex-col px-3 py-2"
          : "fixed inset-x-0 bottom-0 z-40 border-t border-forest-ink/10 bg-white md:hidden"
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
                aria-current={active ? "page" : undefined}
                className={
                  side
                    ? `flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium ${
                        active ? "bg-sage text-forest-ink" : "text-ink-soft hover:bg-sage/60"
                      }`
                    : `flex min-h-16 flex-col items-center justify-center gap-1 text-[14px] font-medium ${
                        active ? "text-action-green" : "text-ink-soft"
                      }`
                }
              >
                <span
                  className={
                    side
                      ? ""
                      : `flex h-8 w-8 items-center justify-center rounded-full ${active ? "bg-sage text-action-green" : ""}`
                  }
                >
                  <TabIcon href={tab.href} />
                </span>
                <span>{tab.label}</span>
                <span className="sr-only">{tab.hint}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
