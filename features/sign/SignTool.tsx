"use client";

import { PenLine, Type, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { SignaturePad } from "@/features/sign/SignaturePad";
import { useSign } from "@/features/sign/useSign";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { DownloadResult } from "@/shared/ui/download-result";
import { Dropzone } from "@/shared/ui/dropzone";
import { ProcessingOverlay } from "@/shared/ui/processing-overlay";

export function SignTool() {
  const {
    numPages,
    pageIndex,
    pageImage,
    elementsOnPage,
    stage,
    loadFile,
    goToPage,
    addText,
    addSignature,
    updateElement,
    removeElement,
    process,
    download,
    reset,
  } = useSign();

  const [signaturePadOpen, setSignaturePadOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    index: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const pointerPct = useCallback((event: { clientX: number; clientY: number }) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  }, []);

  const handlePointerDown = useCallback(
    (
      event: React.PointerEvent,
      index: number,
      xPct: number,
      yPct: number,
    ) => {
      const pointer = pointerPct(event);
      dragState.current = {
        index,
        offsetX: pointer.x - xPct,
        offsetY: pointer.y - yPct,
      };
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Some browsers reject capture for pointers not in an active gesture; dragging still works via the container's move handler.
      }
    },
    [pointerPct],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      const drag = dragState.current;
      if (!drag) return;
      const pointer = pointerPct(event);
      updateElement(drag.index, {
        xPct: Math.min(Math.max(pointer.x - drag.offsetX, 0), 0.95),
        yPct: Math.min(Math.max(pointer.y - drag.offsetY, 0), 0.95),
      });
    },
    [pointerPct, updateElement],
  );

  const handlePointerUp = useCallback(() => {
    dragState.current = null;
  }, []);

  if (stage === "loading") {
    return <ProcessingOverlay label="Reading your PDF…" />;
  }

  if (stage === "processing") {
    return <ProcessingOverlay label="Signing your PDF…" />;
  }

  if (stage === "done") {
    return (
      <DownloadResult
        message="Your signed PDF is ready."
        downloads={[{ label: "Download signed.pdf", onClick: download }]}
        onReset={reset}
      />
    );
  }

  if (stage === "idle") {
    return (
      <Dropzone
        accept="pdf"
        onFilesAccepted={loadFile}
        label="Drag & drop a PDF to sign"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={addText}>
            <Type className="size-4" />
            Add text
          </Button>
          <Dialog open={signaturePadOpen} onOpenChange={setSignaturePadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PenLine className="size-4" />
                Add signature
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Draw your signature</DialogTitle>
              </DialogHeader>
              <SignaturePad
                onSave={(dataUrl) => {
                  addSignature(dataUrl);
                  setSignaturePadOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {numPages > 1 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              disabled={pageIndex === 0}
              onClick={() => goToPage(pageIndex - 1)}
            >
              Prev
            </Button>
            Page {pageIndex + 1} of {numPages}
            <Button
              variant="ghost"
              size="sm"
              disabled={pageIndex === numPages - 1}
              onClick={() => goToPage(pageIndex + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Drag placed items to reposition them on the page.
      </p>

      <div
        ref={containerRef}
        className="relative select-none overflow-hidden rounded-xl border border-border"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {pageImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pageImage}
            alt={`Page ${pageIndex + 1}`}
            className="block w-full"
            draggable={false}
          />
        )}

        {elementsOnPage.map(({ element, index }) =>
          element.type === "text" ? (
            <div
              key={index}
              onPointerDown={(event) =>
                handlePointerDown(event, index, element.xPct, element.yPct)
              }
              style={{
                left: `${element.xPct * 100}%`,
                top: `${element.yPct * 100}%`,
                fontSize: `${element.fontSize}px`,
              }}
              className="group absolute flex cursor-move items-start gap-1 rounded border border-primary/50 bg-background/80 px-1"
            >
              <span
                contentEditable
                suppressContentEditableWarning
                onPointerDown={(event) => event.stopPropagation()}
                onBlur={(event) =>
                  updateElement(index, {
                    value: event.currentTarget.textContent ?? "",
                  })
                }
                className="min-w-6 outline-none"
              >
                {element.value}
              </span>
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => removeElement(index)}
                className="hidden text-muted-foreground hover:text-destructive group-hover:block"
              >
                <X className="size-3" />
              </button>
            </div>
          ) : (
            <div
              key={index}
              onPointerDown={(event) =>
                handlePointerDown(event, index, element.xPct, element.yPct)
              }
              style={{
                left: `${element.xPct * 100}%`,
                top: `${element.yPct * 100}%`,
                width: `${element.widthPct * 100}%`,
              }}
              className="group absolute cursor-move"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={element.dataUrl}
                alt="Signature"
                className="w-full"
                draggable={false}
              />
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => removeElement(index)}
                className="absolute -top-2 -right-2 hidden rounded-full bg-background text-muted-foreground shadow group-hover:block hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </div>
          ),
        )}
      </div>

      <Button onClick={process} className="w-full">
        Apply & download
      </Button>
    </div>
  );
}
