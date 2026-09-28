"use client";

import React, { useLayoutEffect, useRef, useState } from "react";

interface ResponsiveResumeScalerProps {
  children: React.ReactNode;
}

const ResponsiveResumeScaler: React.FC<ResponsiveResumeScalerProps> = ({
  children,
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const recompute = () => {
      const outer = outerRef.current;
      const content = contentRef.current;
      if (!outer || !content) return;

      const availableWidth = outer.clientWidth;
      const naturalWidth = content.scrollWidth;
      const nextScale =
        naturalWidth > 0 ? Math.min(1, availableWidth / naturalWidth) : 1;

      setScale(nextScale);
      setNaturalHeight(content.scrollHeight);
    };

    recompute();

    const resizeObserver = new ResizeObserver(recompute);
    if (outerRef.current) resizeObserver.observe(outerRef.current);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, [children]);

  return (
    <div
      ref={outerRef}
      className="resume-scale-outer w-full flex justify-center"
      style={{
        height: naturalHeight != null ? naturalHeight * scale : undefined,
      }}
    >
      <div
        ref={contentRef}
        className="resume-scale-wrapper"
        style={{ "--resume-scale": scale } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
};

export default ResponsiveResumeScaler;
