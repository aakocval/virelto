"use client";

import { CheckCircle2, Download, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";

interface DownloadResultProps {
  message?: string;
  downloads: { label: string; onClick: () => void }[];
  onReset: () => void;
}

export function DownloadResult({
  message = "Your file is ready.",
  downloads,
  onReset,
}: DownloadResultProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card/50 px-6 py-16 text-center">
      <CheckCircle2 className="size-10 text-primary" />
      <p className="text-sm font-medium text-foreground">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {downloads.map((item) => (
          <Button key={item.label} onClick={item.onClick}>
            <Download className="size-4" />
            {item.label}
          </Button>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={onReset}>
        <RotateCcw className="size-4" />
        Process another file
      </Button>
    </div>
  );
}
