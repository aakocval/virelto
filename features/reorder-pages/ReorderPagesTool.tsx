"use client";

import { useReorderPages } from "@/features/reorder-pages/useReorderPages";
import { Button } from "@/shared/ui/button";
import { DownloadResult } from "@/shared/ui/download-result";
import { Dropzone } from "@/shared/ui/dropzone";
import { PageThumbnailGrid } from "@/shared/ui/page-thumbnail-grid";
import { ProcessingOverlay } from "@/shared/ui/processing-overlay";

export function ReorderPagesTool() {
  const { thumbnails, stage, loadFile, setOrder, process, download, reset } =
    useReorderPages();

  if (stage === "loading") {
    return <ProcessingOverlay label="Reading your PDF…" />;
  }

  if (stage === "processing") {
    return <ProcessingOverlay label="Reordering pages…" />;
  }

  if (stage === "done") {
    return (
      <DownloadResult
        message="Your reordered PDF is ready."
        downloads={[{ label: "Download reordered.pdf", onClick: download }]}
        onReset={reset}
      />
    );
  }

  if (stage === "idle") {
    return (
      <Dropzone
        accept="pdf"
        onFilesAccepted={loadFile}
        label="Drag & drop a PDF to reorder"
      />
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Drag pages to set the new order.
      </p>

      <PageThumbnailGrid
        pages={thumbnails}
        reorderable
        onReorder={setOrder}
      />

      <Button onClick={process} className="w-full">
        Save new order
      </Button>
    </div>
  );
}
