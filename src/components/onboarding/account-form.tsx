"use client";

import { useActionState, useEffect, useState } from "react";
import { signInWithEmail, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const initial: AuthState = {};

type Mode = "create" | "sign-in" | "forgot";

export function AccountForm() {
  const [mode, setMode] = useState<Mode>("create");
  const [timezone, setTimezone] = useState("UTC");
  const [state, action, pending] = useActionState(signInWithEmail, initial);

  useEffect(() => {
    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    } catch {
      setTimezone("UTC");
    }
  }, []);

  const creating = mode === "create";
  const forgot = mode === "forgot";

  return (
    <form action={action} className="mx-auto w-full max-w-md space-y-5">
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="timezone" value={timezone} />
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          className={`min-h-12 rounded-[var(--radius-control)] text-[1rem] font-semibold ${
            mode === "sign-in" ? "bg-action-green text-white" : "bg-surface text-forest-ink/70"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("create")}
          className={`min-h-12 rounded-[var(--radius-control)] text-[1rem] font-semibold ${
            creating ? "bg-action-green text-white" : "bg-surface text-forest-ink/70"
          }`}
        >
          Create account
        </button>
      </div>
      {creating ? (
        <label className="block space-y-2">
          <span className="text-sm font-medium">What should we call you?</span>
          <input
            name="displayName"
            required
            maxLength={40}
            autoComplete="name"
            placeholder="Your first name is fine"
            className="w-full rounded-[var(--radius-control)] border border-border-soft bg-surface px-3 py-3 text-base outline-none focus:border-action-green"
          />
        </label>
      ) : null}
      <label className="block space-y-2">
        <span className="text-sm font-medium">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-[var(--radius-control)] border border-border-soft bg-surface px-3 py-3 text-base outline-none focus:border-action-green"
        />
      </label>
      {forgot ? null : (
        <label className="block space-y-2">
          <span className="text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={creating ? "new-password" : "current-password"}
            className="w-full rounded-[var(--radius-control)] border border-border-soft bg-surface px-3 py-3 text-base outline-none focus:border-action-green"
          />
        </label>
      )}
      {creating ? (
        <label className="block space-y-2">
          <span className="text-sm font-medium">Confirm password</span>
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-[var(--radius-control)] border border-border-soft bg-surface px-3 py-3 text-base outline-none focus:border-action-green"
          />
        </label>
      ) : null}
      {creating ? (
        <p className="text-sm text-forest-ink/65">At least 8 characters. Your local day is {timezone}.</p>
      ) : null}
      {mode === "sign-in" ? (
        <button
          type="button"
          onClick={() => setMode("forgot")}
          className="text-sm font-medium text-action-green underline-offset-4 hover:underline"
        >
          Forgot password?
        </button>
      ) : null}
      {forgot ? (
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          className="text-sm font-medium text-action-green underline-offset-4 hover:underline"
        >
          Back to sign in
        </button>
      ) : null}
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.notice ? <p className="text-sm text-forest-ink">{state.notice}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : creating ? "Create account" : forgot ? "Send reset link" : "Sign in"}
      </Button>
    </form>
  );
}
