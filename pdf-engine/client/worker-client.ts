"use client";

import type {
  PdfOperation,
  PdfOperationPayloadMap,
  PdfOperationResultMap,
  WorkerRequest,
  WorkerResponse,
} from "@/pdf-engine/client/types";

let worker: Worker | null = null;
let requestId = 0;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
  }
  return worker;
}

export function runPdfOperation<K extends PdfOperation>(
  op: K,
  payload: PdfOperationPayloadMap[K],
  transfer: Transferable[] = [],
): Promise<PdfOperationResultMap[K]> {
  return new Promise((resolve, reject) => {
    const instance = getWorker();
    const id = String(++requestId);

    function cleanup() {
      instance.removeEventListener("message", handleMessage);
      instance.removeEventListener("error", handleError);
    }

    function handleMessage(event: MessageEvent<WorkerResponse>) {
      if (event.data.id !== id) return;
      cleanup();
      if (event.data.ok) {
        resolve(event.data.result as PdfOperationResultMap[K]);
      } else {
        reject(new Error(event.data.error));
      }
    }

    function handleError(event: ErrorEvent) {
      cleanup();
      reject(new Error(event.message || "PDF worker crashed."));
    }

    instance.addEventListener("message", handleMessage);
    instance.addEventListener("error", handleError);

    const request: WorkerRequest = { id, op, payload } as WorkerRequest;
    instance.postMessage(request, transfer);
  });
}

export function terminatePdfWorker() {
  worker?.terminate();
  worker = null;
}
