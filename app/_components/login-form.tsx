"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { signInWithGoogle, signInWithMagicLink } from "@/server/auth/actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;
    toast.error(error);
    router.replace("/login");
  }, [searchParams, router]);

  function handleMagicLink(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const { error } = await signInWithMagicLink(email);
      if (error) toast.error(error);
      else setSent(true);
    });
  }

  function handleGoogle() {
    startTransition(async () => {
      const { error } = await signInWithGoogle();
      if (error) toast.error(error);
    });
  }

  if (sent) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Check {email} for a magic sign-in link.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleMagicLink} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          Send magic link
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="outline"
        disabled={isPending}
        onClick={handleGoogle}
        className="w-full"
      >
        Continue with Google
      </Button>
    </div>
  );
}
