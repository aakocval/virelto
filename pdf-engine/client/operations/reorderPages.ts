import { PDFDocument } from "pdf-lib";

export async function reorderPages(
  file: ArrayBuffer,
  order: number[],
): Promise<Uint8Array> {
  const source = await PDFDocument.load(file, { ignoreEncryption: true });

  if (order.length !== source.getPageCount()) {
    throw new Error("Page order must include every page exactly once.");
  }

  const output = await PDFDocument.create();
  const pages = await output.copyPages(source, order);
  for (const page of pages) output.addPage(page);

  return output.save();
}
