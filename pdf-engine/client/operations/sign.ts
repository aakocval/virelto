import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import type { SignElement } from "@/pdf-engine/client/types";

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function signPdf(
  file: ArrayBuffer,
  elements: SignElement[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(file, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (const element of elements) {
    const page = doc.getPage(element.pageIndex);
    const { width, height } = page.getSize();

    if (element.type === "text") {
      const x = element.xPct * width;
      const y = height - element.yPct * height - element.fontSize;
      page.drawText(element.value, {
        x,
        y,
        size: element.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    } else {
      const png = await doc.embedPng(dataUrlToBytes(element.dataUrl));
      const boxWidth = element.widthPct * width;
      const boxHeight = element.heightPct * height;
      page.drawImage(png, {
        x: element.xPct * width,
        y: height - element.yPct * height - boxHeight,
        width: boxWidth,
        height: boxHeight,
      });
    }
  }

  return doc.save();
}
