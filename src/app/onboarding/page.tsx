import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { DaymarkMark, DaymarkWordmark } from "@/components/brand/mark";
import { AccountForm } from "@/components/onboarding/account-form";
import { getCurrentUser } from "@/lib/authentication/current-user";

export const metadata = { title: "Welcome" };
export const instant = false;

export default async function OnboardingPage() {
  await connection();
  const user = await getCurrentUser();
  if (user?.emailAccount) redirect("/today");

  return (
    <div className="flex min-h-full flex-col bg-paper px-5 py-8 text-forest-ink sm:px-8">
      <div className="mx-auto w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-2">
          <DaymarkMark className="h-9 w-9" title="" />
          <DaymarkWordmark className="text-2xl" />
        </Link>
        <h1 className="mt-10 font-display text-4xl leading-tight">A field journal for real life.</h1>
        <p className="mt-3 text-base leading-7 text-forest-ink/70">
          Create an account with your name, email, and password, or sign in.
        </p>
        <div className="mt-8">
          <AccountForm />
        </div>
      </div>
    </div>
  );
}
