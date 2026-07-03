"use client";

import { UploadCloud } from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/shared/utils/cn";
import {
  validateImageFile,
  validatePdfFile,
} from "@/shared/lib/file-validation";

interface DropzoneProps {
  accept: "pdf" | "image";
  multiple?: boolean;
  onFilesAccepted: (files: File[]) => void;
  label?: string;
  hint?: string;
  className?: string;
}

export function Dropzone({
  accept,
  multiple = false,
  onFilesAccepted,
  label = "Drag & drop files here",
  hint,
  className,
}: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const validate = accept === "pdf" ? validatePdfFile : validateImageFile;

  const acceptFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      const valid: File[] = [];

      for (const file of files) {
        const result = validate(file);
        if (result.valid) {
          valid.push(file);
        } else {
          toast.error(result.error);
        }
      }

      if (valid.length > 0) {
        onFilesAccepted(multiple ? valid : [valid[0]]);
      }
    },
    [multiple, onFilesAccepted, validate],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragActive(false);
        acceptFiles(event.dataTransfer.files);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card/50 px-6 py-16 text-center transition-colors hover:border-primary/50 hover:bg-muted/50",
        isDragActive && "border-primary bg-muted",
        className,
      )}
    >
      <UploadCloud className="size-10 text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          {hint ?? "or click to browse from your device"}
        </p>
      </div>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept === "pdf" ? "application/pdf" : "image/jpeg,image/png"}
        className="hidden"
        onChange={(event) => acceptFiles(event.target.files)}
      />
    </div>
  );
}
