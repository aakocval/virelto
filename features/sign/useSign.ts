"use client";

import type { PDFDocumentProxy } from "pdfjs-dist";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { loadPdfDocument, renderPageThumbnail } from "@/pdf-engine/client/pdfjs";
import type { SignElement } from "@/pdf-engine/client/types";
import { runPdfOperation } from "@/pdf-engine/client/worker-client";
import { downloadBytes } from "@/shared/lib/download";

export type SignStage = "idle" | "loading" | "ready" | "processing" | "done";

const DISPLAY_SCALE = 1.4;

export function useSign() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageImages, setPageImages] = useState<Record<number, string>>({});
  const [elements, setElements] = useState<SignElement[]>([]);
  const [stage, setStage] = useState<SignStage>("idle");
  const [result, setResult] = useState<ArrayBuffer | null>(null);
  const docRef = useRef<PDFDocumentProxy | null>(null);

  const renderPage = useCallback(async (index: number) => {
    const doc = docRef.current;
    if (!doc) return;
    const dataUrl = await renderPageThumbnail(doc, index + 1, DISPLAY_SCALE);
    setPageImages((prev) => ({ ...prev, [index]: dataUrl }));
  }, []);

  const loadFile = useCallback(
    async (files: File[]) => {
      const selectedFile = files[0];
      if (!selectedFile) return;
      setFile(selectedFile);
      setStage("loading");
      try {
        const bytes = await selectedFile.arrayBuffer();
        const doc = await loadPdfDocument(bytes);
        docRef.current = doc;
        setNumPages(doc.numPages);
        setPageIndex(0);
        setPageImages({});
        setElements([]);
        await renderPage(0);
        setStage("ready");
      } catch {
        toast.error("Couldn't read that PDF. Try another file.");
        setStage("idle");
      }
    },
    [renderPage],
  );

  const goToPage = useCallback(
    (index: number) => {
      if (index < 0 || index >= numPages) return;
      setPageIndex(index);
      if (!pageImages[index]) void renderPage(index);
    },
    [numPages, pageImages, renderPage],
  );

  const addText = useCallback(() => {
    setElements((prev) => [
      ...prev,
      {
        type: "text",
        pageIndex,
        xPct: 0.4,
        yPct: 0.45,
        fontSize: 18,
        value: "Your text",
      },
    ]);
  }, [pageIndex]);

  const addSignature = useCallback(
    (dataUrl: string) => {
      setElements((prev) => [
        ...prev,
        {
          type: "signature",
          pageIndex,
          xPct: 0.35,
          yPct: 0.6,
          widthPct: 0.3,
          heightPct: 0.12,
          dataUrl,
        },
      ]);
    },
    [pageIndex],
  );

  const updateElement = useCallback(
    (elementIndex: number, patch: Partial<SignElement>) => {
      setElements((prev) =>
        prev.map((element, index) =>
          index === elementIndex
            ? ({ ...element, ...patch } as SignElement)
            : element,
        ),
      );
    },
    [],
  );

  const removeElement = useCallback((elementIndex: number) => {
    setElements((prev) => prev.filter((_, index) => index !== elementIndex));
  }, []);

  const process = useCallback(async () => {
    if (!file) return;
    if (elements.length === 0) {
      toast.error("Add some text or a signature first.");
      return;
    }
    setStage("processing");
    try {
      const bytes = await file.arrayBuffer();
      const signed = await runPdfOperation("sign", { file: bytes, elements }, [
        bytes,
      ]);
      setResult(signed);
      setStage("done");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to sign PDF.",
      );
      setStage("ready");
    }
  }, [elements, file]);

  const download = useCallback(() => {
    if (result) downloadBytes(result, "signed.pdf");
  }, [result]);

  const reset = useCallback(() => {
    docRef.current = null;
    setFile(null);
    setNumPages(0);
    setPageIndex(0);
    setPageImages({});
    setElements([]);
    setResult(null);
    setStage("idle");
  }, []);

  const elementsOnPage = elements
    .map((element, index) => ({ element, index }))
    .filter(({ element }) => element.pageIndex === pageIndex);

  return {
    numPages,
    pageIndex,
    pageImage: pageImages[pageIndex],
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
  };
}
