import type { ReactNode } from "react";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { localDateInTimezone } from "@/lib/dates";
import { getStreak } from "@/features/progression/service";

/** Authenticated routes read cookies and the local database per request. */
export const instant = false;

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  await connection();
  const user = await requireUser();
  const today = localDateInTimezone(new Date(), user.timezone);
  const streak = await getStreak(await getDb(), user.id, today);

  return (
    <AppShell streak={streak.current} eyebrow={`Hello, ${user.displayName}`}>
      {children}
    </AppShell>
  );
}
