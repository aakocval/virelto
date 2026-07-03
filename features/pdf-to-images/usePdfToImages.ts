"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  loadPdfDocument,
  renderAllThumbnails,
  renderPageToBlob,
} from "@/pdf-engine/client/pdfjs";
import { downloadBlob } from "@/shared/lib/download";
import { useUsageLimit } from "@/shared/lib/usage-limit";

export type PdfToImagesStage =
  | "idle"
  | "loading"
  | "ready"
  | "processing"
  | "done";
export type ImageFormat = "image/png" | "image/jpeg";

export function usePdfToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<
    { index: number; dataUrl: string }[]
  >([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [format, setFormat] = useState<ImageFormat>("image/png");
  const [stage, setStage] = useState<PdfToImagesStage>("idle");
  const [exportCount, setExportCount] = useState(0);
  const usage = useUsageLimit("guest");

  const loadFile = useCallback(async (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setStage("loading");
    try {
      const bytes = await selectedFile.arrayBuffer();
      const pages = await renderAllThumbnails(bytes);
      setThumbnails(pages);
      setSelected(new Set(pages.map((page) => page.index)));
      setStage("ready");
    } catch {
      toast.error("Couldn't read that PDF. Try another file.");
      setStage("idle");
    }
  }, []);

  const toggleSelect = useCallback((index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const process = useCallback(async () => {
    if (!file || selected.size === 0) {
      toast.error("Select at least one page to export.");
      return;
    }
    if (usage.hasReachedLimit) {
      toast.error("Daily usage limit reached. Sign up or upgrade for more.");
      return;
    }

    setStage("processing");
    try {
      const bytes = await file.arrayBuffer();
      const doc = await loadPdfDocument(bytes);
      const extension = format === "image/png" ? "png" : "jpg";
      const pageNumbers = [...selected].sort((a, b) => a - b);

      for (const index of pageNumbers) {
        const blob = await renderPageToBlob(doc, index + 1, 2, format);
        downloadBlob(blob, `page-${index + 1}.${extension}`);
      }

      setExportCount(pageNumbers.length);
      usage.recordUsage();
      setStage("done");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export images.",
      );
      setStage("ready");
    }
  }, [file, selected, format, usage]);

  const reset = useCallback(() => {
    setFile(null);
    setThumbnails([]);
    setSelected(new Set());
    setExportCount(0);
    setStage("idle");
  }, []);

  return {
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
    usage,
  };
}
