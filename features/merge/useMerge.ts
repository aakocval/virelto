"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { runPdfOperation } from "@/pdf-engine/client/worker-client";
import { downloadBytes } from "@/shared/lib/download";

export type MergeStage = "idle" | "processing" | "done";

export function useMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [stage, setStage] = useState<MergeStage>("idle");
  const [result, setResult] = useState<ArrayBuffer | null>(null);

  const addFiles = useCallback((incoming: File[]) => {
    setFiles((prev) => [...prev, ...incoming]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const reorderFiles = useCallback((from: number, to: number) => {
    if (from === to) return;
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const process = useCallback(async () => {
    if (files.length < 2) {
      toast.error("Add at least two PDF files to merge.");
      return;
    }
    setStage("processing");
    try {
      const buffers = await Promise.all(
        files.map((file) => file.arrayBuffer()),
      );
      const merged = await runPdfOperation(
        "merge",
        { files: buffers },
        buffers,
      );
      setResult(merged);
      setStage("done");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to merge PDFs.",
      );
      setStage("idle");
    }
  }, [files]);

  const download = useCallback(() => {
    if (result) downloadBytes(result, "merged.pdf");
  }, [result]);

  const reset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setStage("idle");
  }, []);

  return {
    files,
    stage,
    addFiles,
    removeFile,
    reorderFiles,
    process,
    download,
    reset,
  };
}
