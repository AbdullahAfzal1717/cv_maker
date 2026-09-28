# EMS Task: Phase 2 — Puppeteer PDF Download

| Field          | Value |
|----------------|-------|
| **Task ID**    | EMS-001-P2 |
| **Title**      | Server-Side PDF Generation with Puppeteer |
| **Status**     | Pending |
| **Priority**   | High |
| **Created**    | 2026-07-17 |
| **Parent**     | EMS-001 |
| **Est. Time**  | 3-4 hours |
| **Depends On** | EMS-001-P1 (must be error-free before adding new features) |

---

## Description

Replace the current `window.print()` PDF download with server-side Puppeteer rendering. This gives pixel-perfect, consistent PDFs across all browsers and devices, and works on mobile where `window.print()` is unreliable.

### Current State
- `BuilderPage.tsx:89-136` — `handleDownload()` calls `window.print()`
- `ExportViewPage.tsx:74` — download button calls `window.print()`
- Print CSS in `globals.css:41-63, 70-77, 133-153`
- No Puppeteer, no jsPDF, no PDF library installed

### Target State
- New API route `POST /api/pdf` accepts resume HTML/data, returns PDF blob
- Client calls the API, receives PDF, triggers browser download
- Works for both logged-in users and guests
- Proper A4 formatting with correct margins and page breaks

---

## Checklist

### 2.1 Setup & Installation
- [ ] Install Puppeteer: `npm install puppeteer`
- [ ] Verify Puppeteer downloads Chromium correctly
- [ ] Add Puppeteer launch config for production (serverless/Vercel)
- [ ] Create `src/lib/services/pdf.service.ts` — PDF generation service
- [ ] Create `src/app/api/pdf/route.ts` — PDF API endpoint

### 2.2 Puppeteer Configuration
- [ ] Configure headless mode: `headless: true` (or `"new"` for newer Puppeteer)
- [ ] Set launch args: `--no-sandbox`, `--disable-setuid-sandbox`, `--disable-dev-shm-usage`
- [ ] Handle Chromium path for production (Vercel uses `/usr/bin/google-chrome-stable`)
- [ ] Set `PUPPETEER_EXECUTABLE_PATH` env var for production
- [ ] Add timeout handling (30 second max for PDF generation)
- [ ] Handle Puppeteer crash recovery

### 2.3 PDF Generation Service
- [ ] Create `generatePDF(html: string, options?: PDFOptions): Promise<Buffer>`
- [ ] Options: page size (A4), margins, landscape/portrait
- [ ] Launch browser → create page → set content → generate PDF → close browser
- [ ] Reuse browser instance across requests (warm start) if possible
- [ ] Properly close browser on errors (try/finally)
- [ ] Return PDF as `Buffer` or `Stream`

### 2.4 API Route
- [ ] `POST /api/pdf` — accepts `{ html: string, filename?: string }`
- [ ] Validate request body (html must be present, max size limit)
- [ ] Set response headers: `Content-Type: application/pdf`
- [ ] Set `Content-Disposition: attachment; filename="resume.pdf"`
- [ ] Return PDF buffer as response
- [ ] Handle errors: return proper HTTP status codes
- [ ] **No auth required** — guests need PDF too (rate limit instead)

### 2.5 HTML Rendering
- [ ] Accept full HTML string from client (the rendered resume)
- [ ] Inject print CSS into the HTML before rendering
- [ ] Ensure `@page { size: A4; margin: 0; }` is in the injected styles
- [ ] Ensure `page-break-after: always` works for multi-page resumes
- [ ] Ensure fonts load before PDF generation (wait for network idle)
- [ ] Ensure images (profile photos) are embedded as base64 data URLs

### 2.6 Client-Side Integration
- [ ] Create `src/services/pdfService.ts` — client-side PDF API calls
- [ ] `downloadPDF(html: string, filename?: string): Promise<void>`
- [ ] Update `BuilderPage.tsx` `handleDownload()`:
  - [ ] Generate resume HTML string from current state
  - [ ] Call `pdfService.downloadPDF(html)`
  - [ ] Trigger browser download from blob response
  - [ ] Show loading state during generation
- [ ] Update `ExportViewPage.tsx` download button:
  - [ ] Generate resume HTML from export data
  - [ ] Call `pdfService.downloadPDF(html)`
  - [ ] Trigger browser download

### 2.7 Loading & UX
- [ ] Add loading spinner/overlay during PDF generation
- [ ] Show "Generating PDF..." text
- [ ] Disable download button while generating (prevent double-click)
- [ ] Show success toast after download starts
- [ ] Show error toast on failure with retry option
- [ ] Handle network errors gracefully

### 2.8 Guest Mode
- [ ] Guest users can download PDF without login
- [ ] Resume HTML is sent in the request body (no server storage needed)
- [ ] Rate limit guest PDF requests (e.g., 5 per minute per IP)
- [ ] No auth token required on the PDF API route

### 2.9 Multi-Page Support
- [ ] Verify multi-page resumes render correctly in Puppeteer
- [ ] Test with resumes that have 1, 2, 3+ pages
- [ ] Ensure page breaks align with PaginatedSheet page groups
- [ ] Ensure margins are consistent across pages
- [ ] Verify page numbers if any (currently none, but future-proof)

### 2.10 Testing
- [ ] Test with ClassicProfessional template (single column)
- [ ] Test with ModernSharp template (two column, negative margins)
- [ ] Test with ProMinimal template (multi-value padding)
- [ ] Test with CreativeEdge template (pageHeader)
- [ ] Test with profile photo (embedded base64 image)
- [ ] Test with long content (3+ page resume)
- [ ] Test with minimal content (1 page resume)
- [ ] Test guest mode PDF download
- [ ] Test logged-in user PDF download
- [ ] Test error handling (invalid HTML, timeout, server error)

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add `puppeteer` dependency |
| `.env.local` | Modify | Add `PUPPETEER_EXECUTABLE_PATH` |
| `.env.example` | Modify | Document Puppeteer env vars |
| `src/lib/services/pdf.service.ts` | **Create** | PDF generation service |
| `src/app/api/pdf/route.ts` | **Create** | PDF API endpoint |
| `src/services/pdfService.ts` | **Create** | Client-side PDF API calls |
| `src/components/pages/BuilderPage.tsx` | Modify | Update `handleDownload()` |
| `src/components/pages/ExportViewPage.tsx` | Modify | Update download button |
| `src/app/globals.css` | Possibly modify | Print CSS adjustments |

---

## Completion Criteria

- [ ] `POST /api/pdf` returns a valid PDF file
- [ ] PDF matches the on-screen resume layout exactly
- [ ] Multi-page resumes have correct page breaks
- [ ] Builder "Download PDF" button works without `window.print()`
- [ ] Export page "Download PDF" button works without `window.print()`
- [ ] Guest users can download PDF without login
- [ ] Loading state shows during PDF generation
- [ ] Error handling shows toast on failure
- [ ] No regressions in existing functionality

---

## Status Log

| Date | Status | Notes |
|------|--------|-------|
| 2026-07-17 | Pending | Waiting for Phase 1 completion |
