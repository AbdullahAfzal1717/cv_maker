"use client";

import React from "react";
import { FileText, Trash2, Clock, Download } from "lucide-react";
import type { CVExport } from "../../types/resume";
import { formatRelative } from "../../utils/formatDate";

interface ExportCardProps {
  exportItem: CVExport;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

const ExportCard: React.FC<ExportCardProps> = ({
  exportItem,
  onDelete,
  onDownload,
}) => {
  const exportedAt = exportItem.createdAt ?? "";

  const handleDownload = () => {
    onDownload(exportItem._id);
  };

  return (
    <div
      onClick={handleDownload}
      className="bg-white rounded-2xl border border-blue-100 p-5 shadow-xs group flex flex-col justify-between min-h-37 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer relative"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">
              {exportItem.exportLabel}
            </p>

            <p className="text-[10px] text-slate-400 font-medium truncate">
              {exportItem.resumeData?.personalInfo?.fullName || "No name set"}
              {exportItem.resumeData?.personalInfo?.jobTitle
                ? ` · ${exportItem.resumeData.personalInfo.jobTitle}`
                : ""}
            </p>

            <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
              From: {exportItem.profileNameSnapshot}
            </p>
          </div>
        </div>

        <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
          <Download className="w-2.5 h-2.5" />
          Exported
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
          <Clock className="w-3 h-3" />
          <span suppressHydrationWarning>{exportedAt ? formatRelative(exportedAt) : "—"}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(exportItem._id);
          }}
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-all cursor-pointer "
          title="Delete export"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ExportCard;
