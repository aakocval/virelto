"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { renderAllThumbnails } from "@/pdf-engine/client/pdfjs";
import { runPdfOperation } from "@/pdf-engine/client/worker-client";
import { downloadBytes } from "@/shared/lib/download";
import { useUsageLimit } from "@/shared/lib/usage-limit";

export type SplitStage = "idle" | "loading" | "ready" | "processing" | "done";
export type SplitMode = "range" | "individual";

export function useSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<
    { index: number; dataUrl: string }[]
  >([]);
  const [stage, setStage] = useState<SplitStage>("idle");
  const [mode, setMode] = useState<SplitMode>("range");
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState(1);
  const [results, setResults] = useState<ArrayBuffer[]>([]);
  const usage = useUsageLimit("guest");

  const loadFile = useCallback(async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    setFile(selected);
    setStage("loading");
    try {
      const bytes = await selected.arrayBuffer();
      const pages = await renderAllThumbnails(bytes);
      setThumbnails(pages);
      setFromPage(1);
      setToPage(pages.length);
      setStage("ready");
    } catch {
      toast.error("Couldn't read that PDF. Try another file.");
      setStage("idle");
    }
  }, []);

  const process = useCallback(async () => {
    if (!file) return;
    if (usage.hasReachedLimit) {
      toast.error("Daily usage limit reached. Sign up or upgrade for more.");
      return;
    }

    setStage("processing");
    try {
      const bytes = await file.arrayBuffer();
      const ranges =
        mode === "range"
          ? [{ start: fromPage - 1, end: toPage - 1 }]
          : thumbnails.map((page) => ({ start: page.index, end: page.index }));

      const outputs = await runPdfOperation("split", { file: bytes, ranges }, [
        bytes,
      ]);
      setResults(outputs);
      usage.recordUsage();
      setStage("done");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to split PDF.",
      );
      setStage("ready");
    }
  }, [file, mode, fromPage, toPage, thumbnails, usage]);

  const downloadAll = useCallback(() => {
    results.forEach((bytes, i) => {
      const name =
        mode === "range"
          ? `split-pages-${fromPage}-${toPage}.pdf`
          : `page-${i + 1}.pdf`;
      downloadBytes(bytes, name);
    });
  }, [results, mode, fromPage, toPage]);

  const reset = useCallback(() => {
    setFile(null);
    setThumbnails([]);
    setResults([]);
    setStage("idle");
  }, []);

  return {
    file,
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
    resultCount: results.length,
    usage,
  };
}
