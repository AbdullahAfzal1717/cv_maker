"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, AlertTriangle, HelpCircle, Trash2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  isDangerous = true,
  onConfirm,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onCancel, isLoading]);

  if (!isOpen) return null;

  const handleConfirmClick = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      await onConfirm();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to delete — please try again",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={isLoading ? undefined : onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm sm:max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200"
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full ${
                isDangerous
                  ? "bg-red-50 text-red-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {isDangerous ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <HelpCircle className="w-5 h-5" />
              )}
            </div>
            <h2
              id="confirm-dialog-title"
              className="text-base sm:text-lg font-bold text-slate-800 pt-1.5 sm:pt-2"
            >
              {title}
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pb-5 pt-3 sm:px-6 sm:pb-6 space-y-4">
          <p className="text-sm text-slate-500 leading-relaxed pl-13 sm:pl-14 -mt-1">
            {message}
          </p>

          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-red-600 font-semibold bg-red-50 border border-red-100 p-3 rounded-xl animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50">
          <button
            disabled={isLoading}
            onClick={onCancel}
            className="flex-1 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 text-xs font-bold text-slate-700 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={handleConfirmClick}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 ${
              isDangerous
                ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-300"
                : "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-300"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isDangerous ? (
              <Trash2 className="w-3.5 h-3.5" />
            ) : null}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmDialog;