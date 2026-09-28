"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  title?: string;
  subtitle?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  title = "Loading...",
  subtitle,
}) => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#f6f8fb]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border border-slate-200 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>

        <h2 className="mt-6 text-lg font-bold text-slate-800">{title}</h2>

        {subtitle && (
          <p className="mt-2 text-sm text-slate-500 text-center">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default PageLoader;
