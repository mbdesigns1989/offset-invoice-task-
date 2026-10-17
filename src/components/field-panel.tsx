"use client";

import { useState } from "react";
import type { ExtractedField } from "@/lib/types";

interface FieldPanelProps {
  fields: ExtractedField[];
  activeField: string | null;
  onFieldSelect: (field: string) => void;
  onFieldChange: (field: string, value: string) => void;
  onFieldApprove: (field: string) => void;
}

function formatLabel(fieldName: string): string {
  return fieldName
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function FieldPanel({ fields, activeField, onFieldSelect, onFieldChange, onFieldApprove }: FieldPanelProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");

  function startEditing(f: ExtractedField) {
    setEditingField(f.field);
    setDraftValue(f.value);
  }

  function commitEdit(fieldName: string) {
    onFieldChange(fieldName, draftValue);
    setEditingField(null);
  }

  return (
    <div className="flex w-80 flex-col gap-3">
      <h2 className="text-sm font-semibold text-gray-700">Extracted fields</h2>
      {fields.map((f) => {
        const isActive = activeField === f.field;
        const isEditing = editingField === f.field;

        return (
          <div
            key={f.field}
            onClick={() => onFieldSelect(f.field)}
            className={`cursor-pointer rounded-lg border p-3 transition-colors ${
              isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {formatLabel(f.field)}
              </span>
              <div className="flex items-center gap-1">
                {f.approved && <span className="text-xs text-green-600">Approved</span>}
                {f.edited && <span className="text-xs text-amber-600">Edited</span>}
              </div>
            </div>

            {isEditing ? (
              <input
                autoFocus
                value={draftValue}
                onChange={(e) => setDraftValue(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onBlur={() => commitEdit(f.field)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit(f.field);
                  if (e.key === "Escape") setEditingField(null);
                }}
                className="mt-1 w-full rounded border border-blue-400 px-2 py-1 text-sm focus:outline-none"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{f.value}</p>
            )}

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(f);
                }}
                className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFieldApprove(f.field);
                }}
                className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
              >
                Approve
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
