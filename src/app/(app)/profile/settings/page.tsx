import Link from "next/link";
import { ResetProfile } from "@/components/profile/reset-profile";
import { requireUser } from "@/lib/authentication/current-user";

export const instant = false;
export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div>
      <Link
        href="/profile"
        className="inline-flex min-h-12 items-center text-[1rem] font-medium text-action-green underline-offset-4 hover:underline"
      >
        Back to You
      </Link>
      <h1 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight">Settings</h1>

      <section className="mt-5">
        <h2 className="font-display text-[1.25rem] font-semibold">This device</h2>
        <p className="mt-1 text-[1.0625rem] leading-7">
          Signed in as {user.displayName}. Time zone: {user.timezone}. Daymark stores this profile on this device.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-[1.25rem] font-semibold">Delete this profile</h2>
        <p className="mt-1 text-[1.0625rem] leading-7 text-ink-soft">
          Resetting removes your memories, hobbies, and progress from this device. This cannot be undone.
        </p>
        <ResetProfile />
      </section>
    </div>
  );
}
