import { PDFDocument, degrees } from "pdf-lib";

import type { RotationAngle } from "@/pdf-engine/client/types";

export async function rotatePdf(
  file: ArrayBuffer,
  rotations: Record<number, RotationAngle>,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(file, { ignoreEncryption: true });

  for (const [indexKey, angle] of Object.entries(rotations)) {
    const page = doc.getPage(Number(indexKey));
    page.setRotation(degrees(angle));
  }

  return doc.save();
}
