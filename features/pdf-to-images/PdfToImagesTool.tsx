"use client";

import { usePdfToImages } from "@/features/pdf-to-images/usePdfToImages";
import { Button } from "@/shared/ui/button";
import { DownloadResult } from "@/shared/ui/download-result";
import { Dropzone } from "@/shared/ui/dropzone";
import { PageThumbnailGrid } from "@/shared/ui/page-thumbnail-grid";
import { ProcessingOverlay } from "@/shared/ui/processing-overlay";
import { cn } from "@/shared/utils/cn";

export function PdfToImagesTool() {
  const {
    thumbnails,
    selected,
    format,
    setFormat,
    stage,
    loadFile,
    toggleSelect,
    process,
    reset,
    exportCount,
  } = usePdfToImages();

  if (stage === "loading") {
    return <ProcessingOverlay label="Reading your PDF…" />;
  }

  if (stage === "processing") {
    return <ProcessingOverlay label="Rendering pages to images…" />;
  }

  if (stage === "done") {
    return (
      <DownloadResult
        message={`${exportCount} image${exportCount > 1 ? "s" : ""} downloaded.`}
        downloads={[]}
        onReset={reset}
      />
    );
  }

  if (stage === "idle") {
    return (
      <Dropzone
        accept="pdf"
        onFilesAccepted={loadFile}
        label="Drag & drop a PDF to export as images"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {selected.size} of {thumbnails.length} pages selected
        </p>
        <div className="flex gap-2">
          {(["image/png", "image/jpeg"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFormat(option)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                format === option
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {option === "image/png" ? "PNG" : "JPEG"}
            </button>
          ))}
        </div>
      </div>

      <PageThumbnailGrid
        pages={thumbnails}
        selectable
        selected={selected}
        onToggleSelect={toggleSelect}
      />

      <Button
        onClick={process}
        disabled={selected.size === 0}
        className="w-full"
      >
        Export {selected.size > 0 ? `${selected.size} page(s)` : "pages"} as
        images
      </Button>
    </div>
  );
}
