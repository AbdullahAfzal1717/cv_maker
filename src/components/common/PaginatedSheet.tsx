"use client";

import React, {
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { flushSync } from "react-dom";

const PAGE_WIDTH = "210mm";
const PAGE_HEIGHT = "297mm";
const PAGE_HEIGHT_MM = 297;
const MM_TO_PX = 96 / 25.4;
const PRINT_SAFETY_BUFFER_MM = "4mm";
const DEFAULT_COLUMN_PADDING = "12mm";

function parsePadding(mmString: string): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  const raw = mmString.trim().split(/\s+/);
  const v = (i: number) => {
    const n = parseFloat(raw[i] ?? "12");
    return Number.isFinite(n) ? n : 12;
  };
  if (raw.length === 1)
    return { top: v(0), right: v(0), bottom: v(0), left: v(0) };
  if (raw.length === 2)
    return { top: v(0), right: v(1), bottom: v(0), left: v(1) };
  if (raw.length === 3)
    return { top: v(0), right: v(1), bottom: v(2), left: v(1) };
  return { top: v(0), right: v(1), bottom: v(2), left: v(3) };
}

function verticalPaddingPx(mmString: string): number {
  const p = parsePadding(mmString);
  return (p.top + p.bottom) * MM_TO_PX;
}

function horizontalPaddingMm(mmString: string): string {
  const p = parsePadding(mmString);
  return `${p.left + p.right}mm`;
}

export interface ColumnConfig {
  sections: React.ReactNode[];
  widthFraction: number;
  padding?: string;
  className?: string;
  contentClassName?: string;
}

interface PaginatedSheetProps {
  sections?: React.ReactNode[];
  columns?: ColumnConfig[];
 
  pageHeader?: React.ReactNode;
  pageClassName?: string;
  pagePadding?: string;
}

const PaginatedSheet: React.FC<PaginatedSheetProps> = ({
  sections,
  columns,
  pageHeader,
  pageClassName = "",
  pagePadding = "12mm",
}) => {
  const normalizedColumns: ColumnConfig[] = useMemo(
    () =>
      columns ?? [
        { sections: sections ?? [], widthFraction: 1, padding: pagePadding },
      ],
    [columns, sections, pagePadding],
  );

  const measureContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerMeasureRef = useRef<HTMLDivElement | null>(null);

  const measureItemRefs = useRef<Map<number, (HTMLDivElement | null)[]>>(
    new Map(),
  );

  const [columnPages, setColumnPages] = useState<number[][][] | null>(null);

  const frameRef = useRef<number | null>(null);

  const computePages = useCallback(() => {
    const results: number[][][] = [];

    let headerHeightPx = 0;
    if (pageHeader) {
      const headerEl = headerMeasureRef.current;
      if (!headerEl || headerEl.scrollHeight === 0) {
        return;
      }
      headerHeightPx = headerEl.scrollHeight;
    }

    for (let ci = 0; ci < normalizedColumns.length; ci++) {
      const col = normalizedColumns[ci];
      const container = measureContainerRefs.current[ci];

      if (!container || container.offsetWidth === 0) {
        return;
      }

      const paddingPx = verticalPaddingPx(
        col.padding ?? DEFAULT_COLUMN_PADDING,
      );
      const printBufferPx = parseFloat(PRINT_SAFETY_BUFFER_MM) * MM_TO_PX;
      const maxHeight = PAGE_HEIGHT_MM * MM_TO_PX - paddingPx - printBufferPx;

      const bucket = measureItemRefs.current.get(ci) ?? [];
      const heights = bucket.map((el) => el?.offsetHeight ?? 0);
      const totalHeight = heights.reduce((a, b) => a + b, 0);

      if (totalHeight === 0 && col.sections.length > 0) {
        return;
      }

      const grouped: number[][] = [];
      let current: number[] = [];
      let currentHeight = 0;

      heights.forEach((h, i) => {
        const budget =
          grouped.length === 0 ? maxHeight - headerHeightPx : maxHeight;
        if (current.length > 0 && currentHeight + h > budget) {
          grouped.push(current);
          current = [];
          currentHeight = 0;
        }
        current.push(i);
        currentHeight += h;
      });
      if (current.length > 0) grouped.push(current);

      results.push(grouped.length > 0 ? grouped : [[]]);
    }


    setColumnPages(results);

  }, [normalizedColumns, pageHeader]);

  const scheduleComputePages = useCallback(() => {
    if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      computePages();
    });
  }, [computePages]);

  useLayoutEffect(() => {
    let cancelled = false;
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) scheduleComputePages();
      });
    } else {
      scheduleComputePages();
    }
    return () => {
      cancelled = true;
    };
  }, [normalizedColumns, scheduleComputePages]);

  useLayoutEffect(() => {
    const containers = measureContainerRefs.current.filter(
      (c): c is HTMLDivElement => c != null,
    );
    if (headerMeasureRef.current) containers.push(headerMeasureRef.current);
    if (containers.length === 0) return;

    const pendingFirstFire = new Set(containers);
    const observer = new ResizeObserver((entries) => {
      let sawRealResize = false;
      for (const entry of entries) {
        const el = entry.target as HTMLDivElement;
        if (pendingFirstFire.has(el)) {
          pendingFirstFire.delete(el);
          continue;
        }
        sawRealResize = true;
      }
      if (sawRealResize) scheduleComputePages();
    });

    containers.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [scheduleComputePages]);

  useLayoutEffect(() => {
    const handleBeforePrint = () => {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      flushSync(() => {
        computePages();
      });
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    return () => window.removeEventListener("beforeprint", handleBeforePrint);
  }, [computePages]);

  useLayoutEffect(() => {
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const totalPages = columnPages
    ? Math.max(1, ...columnPages.map((g) => g.length))
    : 1;

  return (
    <>
      {pageHeader && (
        <div
          ref={headerMeasureRef}
          style={{
            height: 0,
            overflow: "hidden",
            visibility: "hidden",
            pointerEvents: "none",
            width: PAGE_WIDTH,
          }}
        >
          {pageHeader}
        </div>
      )}
      {normalizedColumns.map((col, ci) => (
        <div
          key={`measure-${ci}`}
          ref={(el) => {
            measureContainerRefs.current[ci] = el;
          }}
          style={{
            height: 0,
            overflow: "hidden",
            visibility: "hidden",
            pointerEvents: "none",
            width: `calc(${PAGE_WIDTH} * ${col.widthFraction} - ${horizontalPaddingMm(
              col.padding ?? DEFAULT_COLUMN_PADDING,
            )})`,
          }}
        >
          {col.sections.map((section, i) => (
            <div
              key={i}
              style={{ overflow: "hidden" }}
              ref={(el) => {
                let bucket = measureItemRefs.current.get(ci);
                if (!bucket) {
                  bucket = [];
                  measureItemRefs.current.set(ci, bucket);
                }
                bucket[i] = el;
              }}
            >
              {section}
            </div>
          ))}
        </div>
      ))}

      {Array.from({ length: totalPages }).map((_, pageIndex) => (
        <div
          key={pageIndex}
          data-page-index={pageIndex}
          className={`resume-page bg-white border border-slate-200 shadow-xl rounded-sm mx-auto print:border-none print:shadow-none print:rounded-none overflow-hidden flex flex-col ${pageClassName}`}
          style={{
            width: PAGE_WIDTH,
            minHeight: PAGE_HEIGHT,
            padding: 0,
            boxSizing: "border-box",
            marginBottom: pageIndex < totalPages - 1 ? "24px" : 0,
          }}
        >
          {pageIndex === 0 && pageHeader && (
            <div style={{ width: "100%", flexShrink: 0 }}>{pageHeader}</div>
          )}

          <div className="flex items-stretch grow">
            {normalizedColumns.map((col, ci) => {
              const groups =
                columnPages?.[ci] ??
                (pageIndex === 0 ? [col.sections.map((_, i) => i)] : []);
              const itemIndexes = groups[pageIndex] ?? [];

              return (
                <div
                  key={ci}
                  className={`flex flex-col ${col.className ?? ""}`}
                  style={{
                    width: `calc(${PAGE_WIDTH} * ${col.widthFraction})`,
                    flexShrink: 0,
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    className={col.contentClassName ?? ""}
                    style={{
                      padding: col.padding ?? DEFAULT_COLUMN_PADDING,
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    {itemIndexes.map((i) => (
                      <div key={i} className="break-inside-avoid">
                        {col.sections[i]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export default PaginatedSheet;
