"use client";

import type { PDFDocumentProxy } from "pdfjs-dist";

let pdfjsLibPromise: Promise<typeof import("pdfjs-dist")> | null = null;

async function getPdfjs() {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import("pdfjs-dist").then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      return lib;
    });
  }
  return pdfjsLibPromise;
}

export async function loadPdfDocument(
  bytes: ArrayBuffer,
): Promise<PDFDocumentProxy> {
  const pdfjsLib = await getPdfjs();
  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  return loadingTask.promise;
}

export async function getPageCount(bytes: ArrayBuffer): Promise<number> {
  const pdfjsLib = await getPdfjs();
  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  const doc = await loadingTask.promise;
  const count = doc.numPages;
  await loadingTask.destroy();
  return count;
}

async function renderPage(
  doc: PDFDocumentProxy,
  pageNumber: number,
  scale: number,
): Promise<HTMLCanvasElement> {
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvas, viewport }).promise;
  return canvas;
}

export async function renderPageThumbnail(
  doc: PDFDocumentProxy,
  pageNumber: number,
  scale = 0.35,
): Promise<string> {
  const canvas = await renderPage(doc, pageNumber, scale);
  return canvas.toDataURL("image/png");
}

export interface PageThumbnailData {
  index: number;
  dataUrl: string;
}

export async function renderAllThumbnails(
  bytes: ArrayBuffer,
  scale = 0.35,
): Promise<PageThumbnailData[]> {
  const pdfjsLib = await getPdfjs();
  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  const doc = await loadingTask.promise;

  const thumbnails: PageThumbnailData[] = [];
  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
    const dataUrl = await renderPageThumbnail(doc, pageNumber, scale);
    thumbnails.push({ index: pageNumber - 1, dataUrl });
  }

  await loadingTask.destroy();
  return thumbnails;
}

export async function renderPageToBlob(
  doc: PDFDocumentProxy,
  pageNumber: number,
  scale = 2,
  format: "image/png" | "image/jpeg" = "image/png",
): Promise<Blob> {
  const canvas = await renderPage(doc, pageNumber, scale);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to render page to image."));
    }, format);
  });
}
