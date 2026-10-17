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
    <div className="flex w-80 shrink-0 flex-col gap-3">
      <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-foreground/40">
        Extracted fields
      </h2>
      {fields.map((f) => {
        const isActive = activeField === f.field;
        const isEditing = editingField === f.field;

        return (
          <div
            key={f.field}
            onClick={() => onFieldSelect(f.field)}
            className={`cursor-pointer rounded-xl border bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all ${
              isActive
                ? "border-accent ring-2 ring-accent/20"
                : "border-black/10 hover:border-accent/30 hover:shadow-[0_2px_8px_rgba(16,24,40,0.06)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground/40">
                {formatLabel(f.field)}
              </span>
              <div className="flex items-center gap-1.5">
                {f.approved && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                    Approved
                  </span>
                )}
                {f.edited && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                    Edited
                  </span>
                )}
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
                className="mt-1.5 w-full rounded-lg border border-accent px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            ) : (
              <p className="mt-1.5 text-[15px] font-medium text-foreground">{f.value}</p>
            )}

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(f);
                }}
                className="rounded-lg bg-black/[0.04] px-2.5 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:bg-black/[0.08]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFieldApprove(f.field);
                }}
                className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
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
