import type { ExtractedField } from "./types";

export const MOCK_EXTRACTED_FIELDS: ExtractedField[] = [
  { field: "invoice_number", value: "INV-2041", page: 1, bbox: [120, 80, 260, 100] },
  { field: "date", value: "2026-09-14", page: 1, bbox: [400, 80, 520, 100] },
  { field: "total_amount", value: "$8,250.00", page: 1, bbox: [400, 620, 520, 645] },
];

export const DOCUMENT_PAGE_WIDTH = 612;
export const DOCUMENT_PAGE_HEIGHT = 792;
