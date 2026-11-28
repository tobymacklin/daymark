import type { ReactNode } from "react";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/authentication/current-user";
import { getDb } from "@/lib/database";
import { localDateInTimezone } from "@/lib/dates";
import { listMemoryImagePaths } from "@/features/memories/service";
import { getStreak } from "@/features/progression/service";
import { copyLocalMemoryPhotos } from "@/lib/memory-photo";

/** Authenticated routes read cookies and the local database per request. */
export const instant = false;

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  await connection();
  const user = await requireUser();
  const db = await getDb();
  const today = localDateInTimezone(new Date(), user.timezone);
  const [streak, imagePaths] = await Promise.all([
    getStreak(db, user.id, today),
    listMemoryImagePaths(db, user.id),
  ]);
  await copyLocalMemoryPhotos(user.id, imagePaths);

  return (
    <AppShell streak={streak.current} eyebrow={`Hello, ${user.displayName}`}>
      {children}
    </AppShell>
  );
}
