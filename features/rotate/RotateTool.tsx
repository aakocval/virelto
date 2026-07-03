"use client";

import { RotateCcw, RotateCw } from "lucide-react";

import { useRotate } from "@/features/rotate/useRotate";
import { Button } from "@/shared/ui/button";
import { DownloadResult } from "@/shared/ui/download-result";
import { Dropzone } from "@/shared/ui/dropzone";
import { PageThumbnailGrid } from "@/shared/ui/page-thumbnail-grid";
import { ProcessingOverlay } from "@/shared/ui/processing-overlay";

export function RotateTool() {
  const {
    thumbnails,
    rotations,
    selected,
    stage,
    loadFile,
    toggleSelect,
    rotateSelected,
    process,
    download,
    reset,
  } = useRotate();

  if (stage === "loading") {
    return <ProcessingOverlay label="Reading your PDF…" />;
  }

  if (stage === "processing") {
    return <ProcessingOverlay label="Rotating your PDF…" />;
  }

  if (stage === "done") {
    return (
      <DownloadResult
        message="Your rotated PDF is ready."
        downloads={[{ label: "Download rotated.pdf", onClick: download }]}
        onReset={reset}
      />
    );
  }

  if (stage === "idle") {
    return (
      <Dropzone accept="pdf" onFilesAccepted={loadFile} label="Drag & drop a PDF to rotate" />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {selected.size} of {thumbnails.length} pages selected — click pages
          to change the selection
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => rotateSelected("left")}
          >
            <RotateCcw className="size-4" />
            Left
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => rotateSelected("right")}
          >
            <RotateCw className="size-4" />
            Right
          </Button>
        </div>
      </div>

      <PageThumbnailGrid
        pages={thumbnails.map((page) => ({
          ...page,
          rotation: rotations[page.index] ?? 0,
        }))}
        selectable
        selected={selected}
        onToggleSelect={toggleSelect}
      />

      <Button onClick={process} className="w-full">
        Apply rotation
      </Button>
    </div>
  );
}
