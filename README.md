# Offset — Invoice Data Review (take-home task)

A small React/TypeScript app that lets a user upload an invoice (PDF or image), see it rendered on
screen with the extracted fields highlighted at their source location, and approve or correct each
value.

## What it does

1. **Upload** — drag-and-drop or browse for a PDF or image invoice.
2. **Document viewer** — renders the uploaded file (PDF via `pdfjs-dist`, images natively).
3. **Mock extraction** — loads a hardcoded JSON payload shaped like an OCR API response
   (`invoice_number`, `date`, `total_amount`, each with a `bbox`).
4. **Highlight boxes** — draws a box over each field's source location on the document.
5. **Click-to-source** — clicking a field in the side panel highlights its box on the document, and
   vice versa.
6. **Review** — each field can be approved or edited inline; edited fields are marked "Edited",
   approved fields "Approved".

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Notes / what I'd improve with more time

- Bounding boxes assume a fixed document page size (612×792, i.e. US Letter at 72dpi) to match the
  mock data's coordinate space. A real integration would read the actual rendered page dimensions
  from the OCR response instead of assuming a fixed size.
- Manual "draw a new box" and multi-page support are not implemented (bonus items) — scoped out to
  keep the 6 core requirements solid within the time limit.
- No automated tests included given the scope; verified manually end-to-end (upload → highlight →
  click-to-source → edit → approve).
