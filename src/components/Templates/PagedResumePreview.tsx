"use client";

import React, { useLayoutEffect, useRef, useState } from "react";

const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const PAGE_PADDING_MM = 15;

const MM_TO_PX = 96 / 25.4; // 96 css px per inch, 25.4mm per inch

interface PagedResumePreviewProps {
  children: React.ReactNode;
}

const PagedResumePreview: React.FC<PagedResumePreviewProps> = ({
  children,
}) => {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  const pageContentHeightPx = (PAGE_HEIGHT_MM - PAGE_PADDING_MM * 2) * MM_TO_PX;

  useLayoutEffect(() => {
    const measure = () => {
      if (!measureRef.current) return;
      const h = measureRef.current.scrollHeight;
      setPageCount(Math.max(1, Math.ceil(h / pageContentHeightPx)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (measureRef.current) ro.observe(measureRef.current);
    // Fonts loading late can change height after first measure.
    document.fonts?.ready?.then(measure).catch(() => {});
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, pageContentHeightPx]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* ── Screen preview: sliced into A4 sheets, gap between them so the
          user can see exactly where each page break will land ────────── */}
      <div className="print:hidden flex flex-col items-center gap-6 w-full">
        {Array.from({ length: pageCount }).map((_, i) => (
          <div
            key={i}
            className="relative bg-white shadow-xl border border-slate-200 overflow-hidden shrink-0 mx-auto"
            style={{
              width: `${PAGE_WIDTH_MM}mm`,
              height: `${PAGE_HEIGHT_MM}mm`,
              maxWidth: "100%",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: `${-i * pageContentHeightPx}px`,
                left: 0,
                right: 0,
                padding: `${PAGE_PADDING_MM}mm`,
              }}
            >
              {children}
            </div>
            {pageCount > 1 && (
              <span className="absolute bottom-2 right-3 text-[10px] font-semibold text-slate-300 select-none">
                Page {i + 1} / {pageCount}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ── Hidden measuring copy, used only to compute pageCount above ── */}
      <div
        ref={measureRef}
        aria-hidden
        className="invisible absolute -z-10 top-0 left-0 pointer-events-none"
        style={{ width: `${PAGE_WIDTH_MM - PAGE_PADDING_MM * 2}mm` }}
      >
        {children}
      </div>

      {/* ── Print/export copy: natural single flow, real pagination is
          handled by the browser via @page + break-inside rules ────────── */}
      <div
        className="hidden print:block w-full"
        style={{ padding: `${PAGE_PADDING_MM}mm` }}
      >
        {children}
      </div>
    </div>
  );
};

export default PagedResumePreview;
