export type PdfOperation =
  | "merge"
  | "split"
  | "rotate"
  | "deletePages"
  | "reorderPages"
  | "imagesToPdf"
  | "sign";

export interface PageRange {
  start: number;
  end: number;
}

export interface ImageInput {
  bytes: ArrayBuffer;
  type: "image/jpeg" | "image/png";
}

export interface MergePayload {
  files: ArrayBuffer[];
}

export interface SplitPayload {
  file: ArrayBuffer;
  ranges: PageRange[];
}

export type RotationAngle = 0 | 90 | 180 | 270;

export interface RotatePayload {
  file: ArrayBuffer;
  /** Absolute target rotation per page index (not a delta). */
  rotations: Record<number, RotationAngle>;
}

export interface DeletePagesPayload {
  file: ArrayBuffer;
  pageIndices: number[];
}

export interface ReorderPagesPayload {
  file: ArrayBuffer;
  order: number[];
}

export interface ImagesToPdfPayload {
  images: ImageInput[];
}

export interface TextSignElement {
  type: "text";
  pageIndex: number;
  /** Left offset as a fraction of page width, 0-1, top-left origin. */
  xPct: number;
  /** Top offset as a fraction of page height, 0-1, top-left origin. */
  yPct: number;
  fontSize: number;
  value: string;
}

export interface ImageSignElement {
  type: "signature";
  pageIndex: number;
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
  /** PNG data URL, e.g. from a signature canvas. */
  dataUrl: string;
}

export type SignElement = TextSignElement | ImageSignElement;

export interface SignPayload {
  file: ArrayBuffer;
  elements: SignElement[];
}

export type PdfOperationPayloadMap = {
  merge: MergePayload;
  split: SplitPayload;
  rotate: RotatePayload;
  deletePages: DeletePagesPayload;
  reorderPages: ReorderPagesPayload;
  imagesToPdf: ImagesToPdfPayload;
  sign: SignPayload;
};

export type PdfOperationResultMap = {
  merge: ArrayBuffer;
  split: ArrayBuffer[];
  rotate: ArrayBuffer;
  deletePages: ArrayBuffer;
  reorderPages: ArrayBuffer;
  imagesToPdf: ArrayBuffer;
  sign: ArrayBuffer;
};

export type WorkerRequest = {
  [K in PdfOperation]: { id: string; op: K; payload: PdfOperationPayloadMap[K] };
}[PdfOperation];

export type WorkerSuccessResponse = {
  [K in PdfOperation]: { id: string; ok: true; result: PdfOperationResultMap[K] };
}[PdfOperation];

export interface WorkerErrorResponse {
  id: string;
  ok: false;
  error: string;
}

export type WorkerResponse = WorkerSuccessResponse | WorkerErrorResponse;
