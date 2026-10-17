"use client";

import { useMemo, useState } from "react";
import { UploadDropzone } from "@/components/upload-dropzone";
import { DocumentViewer } from "@/components/document-viewer";
import { FieldPanel } from "@/components/field-panel";
import { MOCK_EXTRACTED_FIELDS } from "@/lib/mock-data";
import type { DocumentKind, ExtractedField } from "@/lib/types";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<ExtractedField[]>(MOCK_EXTRACTED_FIELDS);
  const [activeField, setActiveField] = useState<string | null>(null);

  const fileUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const fileKind: DocumentKind | null = file
    ? file.type === "application/pdf"
      ? "pdf"
      : "image"
    : null;

  function handleFileSelected(selected: File) {
    setFile(selected);
    setFields(MOCK_EXTRACTED_FIELDS);
    setActiveField(null);
  }

  function handleFieldChange(fieldName: string, value: string) {
    setFields((prev) =>
      prev.map((f) => (f.field === fieldName ? { ...f, value, edited: true } : f))
    );
  }

  function handleFieldApprove(fieldName: string) {
    setFields((prev) =>
      prev.map((f) => (f.field === fieldName ? { ...f, approved: true } : f))
    );
  }

  const approvedCount = fields.filter((f) => f.approved).length;

  return (
    <div className="min-h-screen">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-white">
              ID
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight text-foreground">
                Invoice Data Review
              </h1>
              <p className="text-xs text-foreground/50">
                Where every number on the page can be checked.
              </p>
            </div>
          </div>

          {file && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground/60">
                {approvedCount} / {fields.length} approved
              </span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-black/[0.03]"
              >
                New document
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-10">
        {!file || !fileUrl || !fileKind ? (
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-foreground">Review an invoice</h2>
              <p className="mt-1 text-sm text-foreground/50">
                Upload a PDF or image. We will show you exactly where each number came from.
              </p>
            </div>
            <UploadDropzone onFileSelected={handleFileSelected} />
          </div>
        ) : (
          <div className="flex items-start gap-8">
            <DocumentViewer
              fileUrl={fileUrl}
              fileKind={fileKind}
              fields={fields}
              activeField={activeField}
              onBoxClick={setActiveField}
            />
            <FieldPanel
              fields={fields}
              activeField={activeField}
              onFieldSelect={setActiveField}
              onFieldChange={handleFieldChange}
              onFieldApprove={handleFieldApprove}
            />
          </div>
        )}
      </main>
    </div>
  );
}
