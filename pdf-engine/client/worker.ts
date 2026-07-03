import { mergePdfs } from "@/pdf-engine/client/operations/merge";
import { splitPdf } from "@/pdf-engine/client/operations/split";
import { rotatePdf } from "@/pdf-engine/client/operations/rotate";
import { deletePages } from "@/pdf-engine/client/operations/deletePages";
import { reorderPages } from "@/pdf-engine/client/operations/reorderPages";
import { imagesToPdf } from "@/pdf-engine/client/operations/imagesToPdf";
import type { WorkerRequest, WorkerResponse } from "@/pdf-engine/client/types";

function toBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, op, payload } = event.data;

  try {
    let result: ArrayBuffer | ArrayBuffer[];
    let transfer: ArrayBuffer[];

    switch (op) {
      case "merge": {
        const bytes = await mergePdfs(payload.files);
        result = toBuffer(bytes);
        transfer = [result];
        break;
      }
      case "split": {
        const outputs = await splitPdf(payload.file, payload.ranges);
        result = outputs.map(toBuffer);
        transfer = result;
        break;
      }
      case "rotate": {
        const bytes = await rotatePdf(payload.file, payload.rotations);
        result = toBuffer(bytes);
        transfer = [result];
        break;
      }
      case "deletePages": {
        const bytes = await deletePages(payload.file, payload.pageIndices);
        result = toBuffer(bytes);
        transfer = [result];
        break;
      }
      case "reorderPages": {
        const bytes = await reorderPages(payload.file, payload.order);
        result = toBuffer(bytes);
        transfer = [result];
        break;
      }
      case "imagesToPdf": {
        const bytes = await imagesToPdf(payload.images);
        result = toBuffer(bytes);
        transfer = [result];
        break;
      }
      default: {
        throw new Error(`Unknown PDF operation: ${op satisfies never}`);
      }
    }

    const response: WorkerResponse = {
      id,
      ok: true,
      result,
    } as WorkerResponse;
    (self as unknown as Worker).postMessage(response, transfer);
  } catch (error) {
    const response: WorkerResponse = {
      id,
      ok: false,
      error: error instanceof Error ? error.message : "PDF processing failed.",
    };
    (self as unknown as Worker).postMessage(response);
  }
};
