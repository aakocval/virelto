"use client";

import { FileText, GripVertical, X } from "lucide-react";

import { useMerge } from "@/features/merge/useMerge";
import { Button } from "@/shared/ui/button";
import { DownloadResult } from "@/shared/ui/download-result";
import { Dropzone } from "@/shared/ui/dropzone";
import { ProcessingOverlay } from "@/shared/ui/processing-overlay";

export function MergeTool() {
  const {
    files,
    stage,
    addFiles,
    removeFile,
    reorderFiles,
    process,
    download,
    reset,
  } = useMerge();

  if (stage === "processing") {
    return <ProcessingOverlay label="Merging your PDFs…" />;
  }

  if (stage === "done") {
    return (
      <DownloadResult
        message="Your merged PDF is ready."
        downloads={[{ label: "Download merged.pdf", onClick: download }]}
        onReset={reset}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Dropzone
        accept="pdf"
        multiple
        onFilesAccepted={addFiles}
        label="Drag & drop PDFs to merge"
        hint="Select two or more files — drag rows below to set the order"
      />

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData("text/plain", String(index))
              }
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const from = Number(event.dataTransfer.getData("text/plain"));
                reorderFiles(from, index);
              }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2"
            >
              <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground/60" />
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-sm">{file.name}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${file.name}`}
                onClick={() => removeFile(index)}
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Button onClick={process} disabled={files.length < 2} className="w-full">
        Merge {files.length > 1 ? `${files.length} PDFs` : "PDFs"}
      </Button>
    </div>
  );
}
