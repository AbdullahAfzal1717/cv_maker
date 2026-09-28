"use client";

import { useEffect, useState } from "react";

export const useScrollSpy = (ids: string[], offset = 160) => {
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    const handleScroll = () => {
      let current = ids[0] ?? "";

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;

        const top = el.getBoundingClientRect().top;
        if (top - offset <= 0) {
          current = id;
        }
      }

      setActiveId(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ids, offset]);

  return activeId;
};
