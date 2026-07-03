"use client";

import { GripVertical, X } from "lucide-react";
import { useEffect, useMemo } from "react";

import { useImagesToPdf } from "@/features/images-to-pdf/useImagesToPdf";
import { Button } from "@/shared/ui/button";
import { DownloadResult } from "@/shared/ui/download-result";
import { Dropzone } from "@/shared/ui/dropzone";
import { ProcessingOverlay } from "@/shared/ui/processing-overlay";

export function ImagesToPdfTool() {
  const {
    files,
    stage,
    addFiles,
    removeFile,
    reorderFiles,
    process,
    download,
    reset,
  } = useImagesToPdf();

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  if (stage === "processing") {
    return <ProcessingOverlay label="Building your PDF…" />;
  }

  if (stage === "done") {
    return (
      <DownloadResult
        message="Your PDF is ready."
        downloads={[{ label: "Download images.pdf", onClick: download }]}
        onReset={reset}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Dropzone
        accept="image"
        multiple
        onFilesAccepted={addFiles}
        label="Drag & drop JPG or PNG images"
        hint="Drag rows below to set the page order"
      />

      {files.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
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
              className="group relative flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-2"
            >
              <GripVertical className="absolute left-1 top-1 size-4 cursor-grab text-muted-foreground/60" />
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${file.name}`}
                onClick={() => removeFile(index)}
                className="absolute right-1 top-1"
              >
                <X className="size-4" />
              </Button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previews[index]}
                alt={file.name}
                className="aspect-[3/4] w-full rounded-md object-cover"
              />
              <span className="w-full truncate text-center text-xs text-muted-foreground">
                {file.name}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Button onClick={process} disabled={files.length === 0} className="w-full">
        Create PDF from {files.length || ""} image{files.length === 1 ? "" : "s"}
      </Button>
    </div>
  );
}
