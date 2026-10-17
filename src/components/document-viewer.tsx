"use client";

import { useEffect, useRef, useState } from "react";
import type { ExtractedField, DocumentKind } from "@/lib/types";
import { DOCUMENT_PAGE_HEIGHT, DOCUMENT_PAGE_WIDTH } from "@/lib/mock-data";

interface DocumentViewerProps {
  fileUrl: string;
  fileKind: DocumentKind;
  fields: ExtractedField[];
  activeField: string | null;
  onBoxClick: (field: string) => void;
}

export function DocumentViewer({ fileUrl, fileKind, fields, activeField, onBoxClick }: DocumentViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    if (fileKind !== "pdf") return;

    let cancelled = false;

    async function renderPdf() {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();

        const loadingTask = pdfjsLib.getDocument({ url: fileUrl });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1 });
        const scale = DOCUMENT_PAGE_WIDTH / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        const context = canvas.getContext("2d");
        if (!context) return;

        await page.render({ canvas, canvasContext: context, viewport: scaledViewport }).promise;
      } catch (err) {
        if (!cancelled) setPdfError(err instanceof Error ? err.message : "Failed to render PDF");
      }
    }

    renderPdf();
    return () => {
      cancelled = true;
    };
  }, [fileUrl, fileKind]);

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-4px_rgba(16,24,40,0.08)]"
      style={{ width: DOCUMENT_PAGE_WIDTH, height: DOCUMENT_PAGE_HEIGHT }}
    >
      {fileKind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fileUrl}
          alt="Uploaded invoice"
          className="h-full w-full object-contain"
          draggable={false}
        />
      ) : (
        <>
          <canvas ref={canvasRef} className="h-full w-full" />
          {pdfError && (
            <p className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-red-600">
              Could not render PDF: {pdfError}
            </p>
          )}
        </>
      )}

      {fields
        .filter((f) => f.page === 1)
        .map((f) => {
          const [x0, y0, x1, y1] = f.bbox;
          const isActive = activeField === f.field;
          return (
            <button
              key={f.field}
              type="button"
              onClick={() => onBoxClick(f.field)}
              title={`${f.field}: ${f.value}`}
              className={`absolute rounded-[3px] border-2 transition-all ${
                isActive
                  ? "border-accent bg-accent/15 shadow-[0_0_0_3px_rgba(79,70,229,0.15)]"
                  : "border-amber-400 bg-amber-300/10 hover:border-amber-500 hover:bg-amber-300/20"
              }`}
              style={{
                left: x0,
                top: y0,
                width: x1 - x0,
                height: y1 - y0,
              }}
            />
          );
        })}
    </div>
  );
}
