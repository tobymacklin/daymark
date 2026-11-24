"use client";

import { useState } from "react";
import { resetLocalProfile } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";

export function ResetProfile() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <form action={resetLocalProfile} className="mt-3 space-y-3">
      <label className="flex min-h-12 items-start gap-3 text-[1.0625rem] leading-7">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
          className="mt-1.5 h-5 w-5 accent-[#294F40]"
        />
        <span>I understand this deletes my local profile, memories, and progress on this device.</span>
      </label>
      <Button type="submit" variant="danger" disabled={!confirmed}>
        Reset local profile
      </Button>
    </form>
  );
}
