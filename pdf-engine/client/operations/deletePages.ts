import { PDFDocument } from "pdf-lib";

export async function deletePages(
  file: ArrayBuffer,
  pageIndices: number[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(file, { ignoreEncryption: true });
  const uniqueIndices = [...new Set(pageIndices)];

  if (uniqueIndices.length >= doc.getPageCount()) {
    throw new Error("A PDF must have at least one page remaining.");
  }

  for (const index of uniqueIndices.sort((a, b) => b - a)) {
    doc.removePage(index);
  }

  return doc.save();
}
