"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Star,
  Trash2,
  Clock,
  CheckCircle2,
  Circle,
  Pencil,
  Check,
  X,
} from "lucide-react";
import type { CVProfile } from "../../types/resume";
import { formatRelative } from "../../utils/formatDate";

interface ResumeCardProps {
  profile: CVProfile;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  profile,
  onDelete,
  onRename,
}) => {
  const router = useRouter();
  const updatedAt = profile.updatedAt ?? profile.createdAt ?? "";

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(profile.profileName);

  const startEditing = () => {
    setEditValue(profile.profileName);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValue(profile.profileName);
  };

  const confirmEditing = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== profile.profileName) {
      onRename(profile._id, trimmed);
    }
    setIsEditing(false);
  };

  const openResume = () => {
    const params = new URLSearchParams({
      profileId: profile._id,
      templateId: profile.resumeData?.templateId ?? "classic-clean",
    });
    router.push(`/builder?${params.toString()}`);
  };

  return (
    <div
      onClick={openResume}
      className={`bg-white rounded-2xl border p-5 shadow-xs group flex flex-col justify-between min-h-37 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer relative ${
        profile.isMainProfile
          ? "border-amber-300 ring-2 ring-amber-100"
          : "border-slate-200/80"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  value={editValue}
                  maxLength={60}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmEditing();
                    if (e.key === "Escape") cancelEditing();
                  }}
                  className="text-sm font-bold text-slate-800 border border-blue-300 focus:border-blue-500 rounded-lg px-2 py-0.5 outline-none w-32 bg-blue-50/30"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmEditing();
                  }}
                  className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 cursor-pointer shrink-0"
                  title="Save name"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelEditing();
                  }}
                  className="p-1 rounded-md text-slate-400 hover:bg-slate-100 cursor-pointer shrink-0"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <p className="text-sm font-bold text-slate-800 truncate flex items-center gap-1.5">
                {profile.profileName}
                {profile.isMainProfile && (
                  <Star className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" />
                )}
              </p>
            )}
            <p className="text-[10px] text-slate-400 font-medium truncate">
              {profile.resumeData?.personalInfo?.fullName || "No name set"}
              {profile.resumeData?.personalInfo?.jobTitle
                ? ` · ${profile.resumeData.personalInfo.jobTitle}`
                : ""}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
            profile.status === "complete"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-50 text-slate-500 border-slate-200"
          }`}
        >
          {profile.status === "complete" ? (
            <CheckCircle2 className="w-2.5 h-2.5" />
          ) : (
            <Circle className="w-2.5 h-2.5" />
          )}
          {profile.status === "complete" ? "Complete" : "Draft"}
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
          <Clock className="w-3 h-3" />
          <span suppressHydrationWarning>{updatedAt ? formatRelative(updatedAt) : "—"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              startEditing();
            }}
            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-all cursor-pointer "
            title="Rename profile"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(profile._id);
            }}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-all cursor-pointer "
            title="Delete profile"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
