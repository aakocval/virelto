"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { renderAllThumbnails } from "@/pdf-engine/client/pdfjs";
import { runPdfOperation } from "@/pdf-engine/client/worker-client";
import { downloadBytes } from "@/shared/lib/download";

export type ReorderPagesStage =
  | "idle"
  | "loading"
  | "ready"
  | "processing"
  | "done";

export function useReorderPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageMap, setPageMap] = useState<Map<number, string>>(new Map());
  const [order, setOrder] = useState<number[]>([]);
  const [stage, setStage] = useState<ReorderPagesStage>("idle");
  const [result, setResult] = useState<ArrayBuffer | null>(null);

  const loadFile = useCallback(async (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setStage("loading");
    try {
      const bytes = await selectedFile.arrayBuffer();
      const pages = await renderAllThumbnails(bytes);
      setPageMap(new Map(pages.map((page) => [page.index, page.dataUrl])));
      setOrder(pages.map((page) => page.index));
      setStage("ready");
    } catch {
      toast.error("Couldn't read that PDF. Try another file.");
      setStage("idle");
    }
  }, []);

  const process = useCallback(async () => {
    if (!file) return;

    setStage("processing");
    try {
      const bytes = await file.arrayBuffer();
      const output = await runPdfOperation(
        "reorderPages",
        { file: bytes, order },
        [bytes],
      );
      setResult(output);
      setStage("done");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reorder pages.",
      );
      setStage("ready");
    }
  }, [file, order]);

  const download = useCallback(() => {
    if (result) downloadBytes(result, "reordered.pdf");
  }, [result]);

  const reset = useCallback(() => {
    setFile(null);
    setPageMap(new Map());
    setOrder([]);
    setResult(null);
    setStage("idle");
  }, []);

  const thumbnails = order.map((index) => ({
    index,
    dataUrl: pageMap.get(index) ?? "",
  }));

  return {
    thumbnails,
    stage,
    loadFile,
    setOrder,
    process,
    download,
    reset,
  };
}
