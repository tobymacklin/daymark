import Link from "next/link";
import { connection } from "next/server";
import { DaymarkMark, DaymarkWordmark } from "@/components/brand/mark";
import { ResetPasswordForm } from "@/components/onboarding/reset-password-form";
import { createSupabase, supabaseConfigured } from "@/lib/authentication/supabase";

export const metadata = { title: "Reset password" };
export const instant = false;

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  await connection();
  const { code } = await searchParams;
  let ready = false;
  let message = "Open the reset link from your email.";

  if (code && supabaseConfigured()) {
    const supabase = await createSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) message = "This reset link has expired. Request a new one from sign in.";
    else ready = true;
  }

  return (
    <div className="flex min-h-full flex-col bg-paper px-5 py-8 text-forest-ink sm:px-8">
      <div className="mx-auto w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-2">
          <DaymarkMark className="h-9 w-9" title="" />
          <DaymarkWordmark className="text-2xl" />
        </Link>
        <h1 className="mt-10 font-display text-4xl leading-tight">Choose a new password.</h1>
        <div className="mt-8">
          <ResetPasswordForm ready={ready} message={message} />
        </div>
      </div>
    </div>
  );
}
