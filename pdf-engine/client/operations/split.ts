import { PDFDocument } from "pdf-lib";

import type { PageRange } from "@/pdf-engine/client/types";

export async function splitPdf(
  file: ArrayBuffer,
  ranges: PageRange[],
): Promise<Uint8Array[]> {
  if (ranges.length === 0) {
    throw new Error("At least one page range is required to split a PDF.");
  }

  const source = await PDFDocument.load(file, { ignoreEncryption: true });
  const pageCount = source.getPageCount();
  const outputs: Uint8Array[] = [];

  for (const range of ranges) {
    if (range.start < 0 || range.end >= pageCount || range.start > range.end) {
      throw new Error(`Invalid page range: ${range.start + 1}-${range.end + 1}`);
    }

    const output = await PDFDocument.create();
    const indices = Array.from(
      { length: range.end - range.start + 1 },
      (_, i) => range.start + i,
    );
    const pages = await output.copyPages(source, indices);
    for (const page of pages) output.addPage(page);
    outputs.push(await output.save());
  }

  return outputs;
}
