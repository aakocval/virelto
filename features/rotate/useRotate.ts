"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { renderAllThumbnails } from "@/pdf-engine/client/pdfjs";
import type { RotationAngle } from "@/pdf-engine/client/types";
import { runPdfOperation } from "@/pdf-engine/client/worker-client";
import { downloadBytes } from "@/shared/lib/download";

export type RotateStage = "idle" | "loading" | "ready" | "processing" | "done";

function normalizeAngle(angle: number): RotationAngle {
  return (((angle % 360) + 360) % 360) as RotationAngle;
}

export function useRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<
    { index: number; dataUrl: string }[]
  >([]);
  const [rotations, setRotations] = useState<Record<number, RotationAngle>>(
    {},
  );
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [stage, setStage] = useState<RotateStage>("idle");
  const [result, setResult] = useState<ArrayBuffer | null>(null);

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
      setRotations(Object.fromEntries(pages.map((page) => [page.index, 0])));
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

  const rotateSelected = useCallback(
    (direction: "left" | "right") => {
      setRotations((prev) => {
        const next = { ...prev };
        for (const index of selected) {
          const delta = direction === "right" ? 90 : -90;
          next[index] = normalizeAngle((prev[index] ?? 0) + delta);
        }
        return next;
      });
    },
    [selected],
  );

  const process = useCallback(async () => {
    if (!file) return;

    setStage("processing");
    try {
      const bytes = await file.arrayBuffer();
      const rotated = await runPdfOperation(
        "rotate",
        { file: bytes, rotations },
        [bytes],
      );
      setResult(rotated);
      setStage("done");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to rotate PDF.",
      );
      setStage("ready");
    }
  }, [file, rotations]);

  const download = useCallback(() => {
    if (result) downloadBytes(result, "rotated.pdf");
  }, [result]);

  const reset = useCallback(() => {
    setFile(null);
    setThumbnails([]);
    setRotations({});
    setSelected(new Set());
    setResult(null);
    setStage("idle");
  }, []);

  return {
    thumbnails,
    rotations,
    selected,
    stage,
    loadFile,
    toggleSelect,
    rotateSelected,
    process,
    download,
    reset,
  };
}
