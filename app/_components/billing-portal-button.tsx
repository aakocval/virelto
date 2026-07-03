"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";

export function BillingPortalButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else toast.error(data.error ?? "Couldn't open billing portal.");
    });
  }

  return (
    <Button variant="outline" disabled={isPending} onClick={handleClick}>
      Manage billing
    </Button>
  );
}
