"use client";

import { Loader2 } from "lucide-react";

export function ProcessingOverlay({ label = "Processing in your browser…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card/50 px-6 py-16 text-center">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">
        Your file never leaves this device.
      </p>
    </div>
  );
}
