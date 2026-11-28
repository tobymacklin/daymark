"use client";

import { useActionState } from "react";
import { updatePassword, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const initial: AuthState = {};

export function ResetPasswordForm({ ready, message }: { ready: boolean; message: string | null }) {
  const [state, action, pending] = useActionState(updatePassword, initial);

  if (!ready) {
    return <p className="text-base leading-7 text-forest-ink/70">{message}</p>;
  }

  return (
    <form action={action} className="mx-auto w-full max-w-md space-y-5">
      <label className="block space-y-2">
        <span className="text-sm font-medium">New password</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-[var(--radius-control)] border border-border-soft bg-surface px-3 py-3 text-base outline-none focus:border-action-green"
        />
      </label>
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
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : "Save password"}
      </Button>
    </form>
  );
}
