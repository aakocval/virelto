"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { renderAllThumbnails } from "@/pdf-engine/client/pdfjs";
import { runPdfOperation } from "@/pdf-engine/client/worker-client";
import { downloadBytes } from "@/shared/lib/download";
import { useUsageLimit } from "@/shared/lib/usage-limit";

export type DeletePagesStage =
  | "idle"
  | "loading"
  | "ready"
  | "processing"
  | "done";

export function useDeletePages() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<
    { index: number; dataUrl: string }[]
  >([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [stage, setStage] = useState<DeletePagesStage>("idle");
  const [result, setResult] = useState<ArrayBuffer | null>(null);
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
    if (!file) return;
    if (selected.size === 0) {
      toast.error("Select at least one page to delete.");
      return;
    }
    if (selected.size >= thumbnails.length) {
      toast.error("A PDF must have at least one page remaining.");
      return;
    }
    if (usage.hasReachedLimit) {
      toast.error("Daily usage limit reached. Sign up or upgrade for more.");
      return;
    }

    setStage("processing");
    try {
      const bytes = await file.arrayBuffer();
      const output = await runPdfOperation(
        "deletePages",
        { file: bytes, pageIndices: [...selected] },
        [bytes],
      );
      setResult(output);
      usage.recordUsage();
      setStage("done");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete pages.",
      );
      setStage("ready");
    }
  }, [file, selected, thumbnails.length, usage]);

  const download = useCallback(() => {
    if (result) downloadBytes(result, "edited.pdf");
  }, [result]);

  const reset = useCallback(() => {
    setFile(null);
    setThumbnails([]);
    setSelected(new Set());
    setResult(null);
    setStage("idle");
  }, []);

  return {
    thumbnails,
    selected,
    stage,
    loadFile,
    toggleSelect,
    process,
    download,
    reset,
    usage,
  };
}
