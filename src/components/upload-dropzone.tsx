"use client";

import { useCallback, useRef, useState } from "react";

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
}

export function UploadDropzone({ onFileSelected }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      const isAccepted = file.type === "application/pdf" || file.type.startsWith("image/");
      if (!isAccepted) return;
      onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`group flex h-72 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed text-center transition-all ${
        isDragOver
          ? "border-accent bg-accent-soft scale-[1.01]"
          : "border-black/10 bg-white hover:border-accent/40 hover:bg-accent-soft/40"
      }`}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
          isDragOver ? "bg-accent text-white" : "bg-accent-soft text-accent"
        }`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 16V4M12 4L7 9M12 4l5 5M5 20h14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          Drag & drop an invoice here, or click to browse
        </p>
        <p className="mt-1 text-xs text-foreground/40">PDF, PNG, or JPG</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
