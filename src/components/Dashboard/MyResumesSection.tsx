"use client";

import React, { useMemo, useState } from "react";
import { FolderOpen, FileText, Plus, Filter, Loader2 } from "lucide-react";
import type { CVProfile, CVExport } from "../../types/resume";
import ResumeCard from "./ResumeCard";
import ExportCard from "./ExportCard";

interface MyResumesSectionProps {
  profiles: CVProfile[];
  exports: CVExport[];
  loading: boolean;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDeleteExport: (id: string) => void;
  onDownloadExport: (id: string) => void;
  onCreateManually: () => void;
}

type DisplayItem =
  | {
      type: "profile";
      data: CVProfile;
    }
  | {
      type: "export";
      data: CVExport;
    };

const MyResumesSection: React.FC<MyResumesSectionProps> = ({
  profiles,
  exports,
  loading,
  onDelete,
  onRename,
  onDeleteExport,
  onDownloadExport,
  onCreateManually,
}) => {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "incomplete" | "complete" | "exported"
  >("all");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const sortedProfiles = useMemo(() => {
    let filtered = profiles;

    if (activeFilter === "incomplete") {
      filtered = profiles.filter((p) => p.status === "incomplete");
    }

    if (activeFilter === "complete") {
      filtered = profiles.filter((p) => p.status === "complete");
    }

    return [...filtered].sort((a, b) => {
      if (a.isMainProfile && !b.isMainProfile) return -1;
      if (!a.isMainProfile && b.isMainProfile) return 1;

      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [profiles, activeFilter]);

  const sortedExports = useMemo(() => {
    return [...exports].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [exports]);

  const displayItems = useMemo<DisplayItem[]>(() => {
    switch (activeFilter) {
      case "exported":
        return sortedExports.map((e) => ({
          type: "export",
          data: e,
        }));

      case "all":
        return [
          ...sortedProfiles.map((p) => ({
            type: "profile" as const,
            data: p,
          })),
          ...sortedExports.map((e) => ({
            type: "export" as const,
            data: e,
          })),
        ];

      default:
        return sortedProfiles.map((p) => ({
          type: "profile",
          data: p,
        }));
    }
  }, [activeFilter, sortedProfiles, sortedExports]);

  const totalPages = Math.max(1, Math.ceil(displayItems.length / itemsPerPage));

  const effectivePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (effectivePage - 1) * itemsPerPage;
    return displayItems.slice(start, start + itemsPerPage);
  }, [displayItems, effectivePage]);

  const handleFilterChange = (
    filter: "all" | "incomplete" | "complete" | "exported",
  ) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div
      id="my-resumes"
      className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 text-left"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-slate-400" />
          My Resumes
        </h3>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400" />

          {[
            { id: "all", label: "All" },
            { id: "incomplete", label: "Draft" },
            { id: "complete", label: "Complete" },
            { id: "exported", label: "Exported" },
          ].map((tab) => (
            <button
              key={tab.id}
              disabled={loading}
              onClick={() => handleFilterChange(tab.id as typeof activeFilter)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap disabled:opacity-50 cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>

          <h4 className="text-sm font-bold text-slate-800">
            Loading your resumes...
          </h4>

          <p className="mt-1 text-xs text-slate-400 font-medium">
            Please wait a moment.
          </p>
        </div>
      ) : profiles.length === 0 && exports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
            <FileText className="w-7 h-7" />
          </div>

          <h4 className="text-sm font-bold text-slate-800 mb-1">
            No resumes yet
          </h4>

          <p className="text-xs text-slate-400 max-w-64 leading-relaxed mb-6">
            Start building your professional resume and land your dream job.
          </p>

          <button
            onClick={onCreateManually}
            className="py-2.5 px-5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New Resume
          </button>
        </div>
      ) : (
        <div className="flex flex-col grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 content-start min-h-[300px]">
            {paginatedItems.map((item) =>
              item.type === "profile" ? (
                <ResumeCard
                  key={item.data._id}
                  profile={item.data}
                  onDelete={onDelete}
                  onRename={onRename}
                />
              ) : (
                <ExportCard
                  key={item.data._id}
                  exportItem={item.data}
                  onDelete={onDeleteExport}
                  onDownload={onDownloadExport}
                />
              ),
            )}

            {paginatedItems.length === 0 && (
              <div className="col-span-full py-10 text-center text-slate-500 text-xs font-medium">
                {activeFilter === "exported"
                  ? "No exported resumes yet."
                  : "No resumes found in this filter."}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Page {effectivePage} of {totalPages}
              </span>

              <div className="flex gap-2">
                <button
                  disabled={effectivePage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>

                <button
                  disabled={effectivePage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyResumesSection;
