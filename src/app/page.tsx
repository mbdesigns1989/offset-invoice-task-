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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-1 text-xl font-semibold text-gray-900">Invoice Data Review</h1>
        <p className="mb-6 text-sm text-gray-500">
          Upload an invoice, review the extracted fields, and click a value to find it on the
          document.
        </p>

        {!file || !fileUrl || !fileKind ? (
          <UploadDropzone onFileSelected={handleFileSelected} />
        ) : (
          <div className="flex items-start gap-6">
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

        {file && (
          <button
            type="button"
            onClick={() => setFile(null)}
            className="mt-6 text-sm text-gray-500 underline hover:text-gray-700"
          >
            Upload a different document
          </button>
        )}
      </div>
    </div>
  );
}
