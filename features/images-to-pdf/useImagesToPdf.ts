"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { runPdfOperation } from "@/pdf-engine/client/worker-client";
import { downloadBytes } from "@/shared/lib/download";
import { useUsageLimit } from "@/shared/lib/usage-limit";

export type ImagesToPdfStage = "idle" | "processing" | "done";

export function useImagesToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [stage, setStage] = useState<ImagesToPdfStage>("idle");
  const [result, setResult] = useState<ArrayBuffer | null>(null);
  const usage = useUsageLimit("guest");

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
    if (files.length === 0) {
      toast.error("Add at least one image.");
      return;
    }
    if (usage.hasReachedLimit) {
      toast.error("Daily usage limit reached. Sign up or upgrade for more.");
      return;
    }

    setStage("processing");
    try {
      const buffers = await Promise.all(files.map((file) => file.arrayBuffer()));
      const images = files.map((file, i) => ({
        bytes: buffers[i],
        type: file.type as "image/jpeg" | "image/png",
      }));
      const pdf = await runPdfOperation("imagesToPdf", { images }, buffers);
      setResult(pdf);
      usage.recordUsage();
      setStage("done");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to build PDF.",
      );
      setStage("idle");
    }
  }, [files, usage]);

  const download = useCallback(() => {
    if (result) downloadBytes(result, "images.pdf");
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
    usage,
  };
}
