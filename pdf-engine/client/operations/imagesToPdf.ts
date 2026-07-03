import { PDFDocument } from "pdf-lib";

import type { ImageInput } from "@/pdf-engine/client/types";

export async function imagesToPdf(images: ImageInput[]): Promise<Uint8Array> {
  if (images.length === 0) {
    throw new Error("Add at least one image to build a PDF.");
  }

  const doc = await PDFDocument.create();

  for (const image of images) {
    const embedded =
      image.type === "image/png"
        ? await doc.embedPng(image.bytes)
        : await doc.embedJpg(image.bytes);
    const page = doc.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width: embedded.width,
      height: embedded.height,
    });
  }

  return doc.save();
}
