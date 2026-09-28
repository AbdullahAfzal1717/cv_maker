"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface AppBarProps {
  pageLabel: string;
  backTo?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const AppBar: React.FC<AppBarProps> = ({
  pageLabel,
  backTo,
  onBack,
  actions,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    const historyState = window.history.state as { idx?: number } | null;
    const hasHistory =
      historyState &&
      typeof historyState.idx === "number" &&
      historyState.idx > 0;

    if (hasHistory) {
      router.back();
    } else if (backTo) {
      router.push(backTo);
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full px-2.5 sm:px-6 py-2.5 sm:py-3 bg-[#f6f8fb]">
      <header className="w-full max-w-7xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-[0_4px_24px_-4px_rgba(30,109,249,0.06)] rounded-2xl px-2.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group shrink-0"
          >
            <Image
              src="/images/icon.webp"
              alt="CV Maker"
              width={28}
              height={28}
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <span className="font-bold text-sm text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors duration-200 hidden sm:block">
              CV Maker
            </span>
          </Link>

          {(backTo || onBack) && (
            <>
              <div className="h-4 w-px bg-slate-200 shrink-0" />
              <button
                onClick={handleBack}
                className="p-1.5 -ml-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer flex items-center shrink-0"
                title="Go back"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <div className="h-4 w-px bg-slate-200 shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-slate-700 truncate min-w-0">
            {pageLabel}
          </span>
        </div>

        {actions && (
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {actions}
          </div>
        )}
      </header>
    </div>
  );
};

export default AppBar;
