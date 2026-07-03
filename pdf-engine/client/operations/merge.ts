import { PDFDocument } from "pdf-lib";

export async function mergePdfs(files: ArrayBuffer[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error("Select at least two PDF files to merge.");
  }

  const merged = await PDFDocument.create();

  for (const file of files) {
    const donor = await PDFDocument.load(file, { ignoreEncryption: true });
    const pages = await merged.copyPages(donor, donor.getPageIndices());
    for (const page of pages) merged.addPage(page);
  }

  return merged.save();
}
