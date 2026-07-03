export function downloadBytes(
  bytes: ArrayBuffer | Uint8Array,
  filename: string,
  mimeType = "application/pdf",
) {
  const blob = new Blob([bytes as BlobPart], { type: mimeType });
  downloadBlob(blob, filename);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
