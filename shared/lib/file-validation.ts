import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_PDF_TYPE,
  MAX_FILE_SIZE_BYTES,
} from "@/shared/utils/constants";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

function formatSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
}

export function validatePdfFile(file: File): FileValidationResult {
  const isPdf =
    file.type === ACCEPTED_PDF_TYPE ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return { valid: false, error: `"${file.name}" is not a PDF file.` };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `"${file.name}" exceeds the ${formatSize(MAX_FILE_SIZE_BYTES)} size limit.`,
    };
  }

  return { valid: true };
}

export function validateImageFile(file: File): FileValidationResult {
  const isAccepted = (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(
    file.type,
  );

  if (!isAccepted) {
    return {
      valid: false,
      error: `"${file.name}" must be a JPEG or PNG image.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `"${file.name}" exceeds the ${formatSize(MAX_FILE_SIZE_BYTES)} size limit.`,
    };
  }

  return { valid: true };
}
