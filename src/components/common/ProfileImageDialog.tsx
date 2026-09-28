"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, ImageUp } from "lucide-react";

interface ProfileImageDialogProps {
  open: boolean;
  image: string;
  onClose: () => void;
  onChangePhoto: () => void;
  onDeletePhoto: () => void;
}

const ProfileImageDialog: React.FC<ProfileImageDialogProps> = ({
  open,
  image,
  onClose,
  onChangePhoto,
  onDeletePhoto,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm sm:max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 sm:px-5">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            Profile Photo
          </h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="px-4 pt-5 flex justify-center">
          <div className="w-full max-w-55 sm:max-w-65 md:max-w-75 aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
            <img
              src={image}
              alt="Profile"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        </div>

        <div className="flex gap-3 p-4">
          <button
            onClick={() => {
              onClose();
              onChangePhoto();
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            <ImageUp className="w-4 h-4" />
            <span>Change</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onDeletePhoto();
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] font-semibold text-red-600 transition-all hover:bg-red-100 active:scale-[0.98]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ProfileImageDialog;
