"use client";

import { useTransition } from "react";

import { signOut } from "@/server/auth/actions";
import { Button } from "@/shared/ui/button";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      disabled={isPending}
      onClick={() => startTransition(() => signOut())}
    >
      Sign out
    </Button>
  );
}
