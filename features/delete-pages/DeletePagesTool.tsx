"use client";

import { useDeletePages } from "@/features/delete-pages/useDeletePages";
import { Button } from "@/shared/ui/button";
import { DownloadResult } from "@/shared/ui/download-result";
import { Dropzone } from "@/shared/ui/dropzone";
import { PageThumbnailGrid } from "@/shared/ui/page-thumbnail-grid";
import { ProcessingOverlay } from "@/shared/ui/processing-overlay";

export function DeletePagesTool() {
  const {
    thumbnails,
    selected,
    stage,
    loadFile,
    toggleSelect,
    process,
    download,
    reset,
  } = useDeletePages();

  if (stage === "loading") {
    return <ProcessingOverlay label="Reading your PDF…" />;
  }

  if (stage === "processing") {
    return <ProcessingOverlay label="Removing pages…" />;
  }

  if (stage === "done") {
    return (
      <DownloadResult
        message="Your edited PDF is ready."
        downloads={[{ label: "Download edited.pdf", onClick: download }]}
        onReset={reset}
      />
    );
  }

  if (stage === "idle") {
    return (
      <Dropzone
        accept="pdf"
        onFilesAccepted={loadFile}
        label="Drag & drop a PDF to remove pages"
      />
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Click the pages you want to delete ({selected.size} selected).
      </p>

      <PageThumbnailGrid
        pages={thumbnails}
        selectable
        selected={selected}
        onToggleSelect={toggleSelect}
      />

      <Button
        onClick={process}
        disabled={selected.size === 0}
        variant="destructive"
        className="w-full"
      >
        Delete {selected.size > 0 ? `${selected.size} page(s)` : "pages"}
      </Button>
    </div>
  );
}
