import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { ResetProfile } from "@/components/profile/reset-profile";
import { AccountForm } from "@/components/onboarding/account-form";
import { requireUser } from "@/lib/authentication/current-user";
import { createSupabase, supabaseConfigured } from "@/lib/authentication/supabase";

export const instant = false;
export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  let email: string | null = null;
  if (user.emailAccount && supabaseConfigured()) {
    const supabase = await createSupabase();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? null;
  }

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
        <h2 className="font-display text-[1.25rem] font-semibold">Account</h2>
        <p className="mt-1 text-[1.0625rem] leading-7">
          Signed in as {user.displayName}
          {email ? ` (${email})` : ""}. Time zone: {user.timezone}.
        </p>
        <form action={signOut} className="mt-3">
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-control)] border border-border-soft bg-surface px-5 text-[1rem] font-semibold"
          >
            Sign out
          </button>
        </form>
        {user.emailAccount ? null : (
          <>
            <p className="mt-1 text-[1.0625rem] leading-7 text-ink-soft">
              {user.displayName}&apos;s progress is on this browser until an email and password are added.
            </p>
            <div className="mt-4">
              <AccountForm />
            </div>
          </>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-display text-[1.25rem] font-semibold">Delete this profile</h2>
        <p className="mt-1 text-[1.0625rem] leading-7 text-ink-soft">
          Resetting removes your memories, hobbies, and progress. This cannot be undone.
        </p>
        <ResetProfile />
      </section>
    </div>
  );
}
