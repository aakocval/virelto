"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";

export function UpgradeButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const response = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else if (response.status === 401) window.location.href = "/login";
      else toast.error(data.error ?? "Couldn't start checkout.");
    });
  }

  return (
    <Button disabled={isPending} onClick={handleClick} className="w-full">
      Upgrade to Pro
    </Button>
  );
}
