export interface ExtractedField {
  field: string;
  value: string;
  page: number;
  bbox: [number, number, number, number];
  edited?: boolean;
  approved?: boolean;
}

export type DocumentKind = "pdf" | "image";
