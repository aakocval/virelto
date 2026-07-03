"use client";

import { useSplit } from "@/features/split/useSplit";
import { Button } from "@/shared/ui/button";
import { DownloadResult } from "@/shared/ui/download-result";
import { Dropzone } from "@/shared/ui/dropzone";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PageThumbnailGrid } from "@/shared/ui/page-thumbnail-grid";
import { ProcessingOverlay } from "@/shared/ui/processing-overlay";
import { cn } from "@/shared/utils/cn";

export function SplitTool() {
  const {
    thumbnails,
    stage,
    mode,
    setMode,
    fromPage,
    setFromPage,
    toPage,
    setToPage,
    loadFile,
    process,
    downloadAll,
    reset,
    resultCount,
  } = useSplit();

  if (stage === "loading") {
    return <ProcessingOverlay label="Reading your PDF…" />;
  }

  if (stage === "processing") {
    return <ProcessingOverlay label="Splitting your PDF…" />;
  }

  if (stage === "done") {
    return (
      <DownloadResult
        message={`${resultCount} file${resultCount > 1 ? "s" : ""} ready to download.`}
        downloads={[{ label: "Download", onClick: downloadAll }]}
        onReset={reset}
      />
    );
  }

  if (stage === "idle") {
    return (
      <Dropzone accept="pdf" onFilesAccepted={loadFile} label="Drag & drop a PDF to split" />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("range")}
          className={cn(
            "flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
            mode === "range"
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border text-muted-foreground hover:bg-muted",
          )}
        >
          Extract page range
        </button>
        <button
          type="button"
          onClick={() => setMode("individual")}
          className={cn(
            "flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
            mode === "individual"
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border text-muted-foreground hover:bg-muted",
          )}
        >
          Split into individual pages
        </button>
      </div>

      {mode === "range" && (
        <div className="flex items-end gap-4">
          <div className="space-y-1">
            <Label htmlFor="from-page">From page</Label>
            <Input
              id="from-page"
              type="number"
              min={1}
              max={thumbnails.length}
              value={fromPage}
              onChange={(event) => setFromPage(Number(event.target.value))}
              className="w-28"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="to-page">To page</Label>
            <Input
              id="to-page"
              type="number"
              min={1}
              max={thumbnails.length}
              value={toPage}
              onChange={(event) => setToPage(Number(event.target.value))}
              className="w-28"
            />
          </div>
        </div>
      )}

      <PageThumbnailGrid pages={thumbnails} />

      <Button onClick={process} className="w-full">
        Split PDF
      </Button>
    </div>
  );
}
