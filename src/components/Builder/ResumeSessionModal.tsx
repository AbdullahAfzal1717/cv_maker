"use client";

import React, { useMemo } from "react";
import { FilePlus, FolderOpen, Clock, ChevronRight, X } from "lucide-react";
import type { ResumeData } from "../../types/resume";
import { formatRelative } from "../../utils/formatDate";

interface DraftSummary {
  id: string;
  profileName: string;
  fullName: string;
  jobTitle: string;
  templateId: string;
  lastSaved: string;
}

interface ResumeSessionModalProps {
  onStartFresh: () => void;
  onContinue: (profileId: string) => void;
}

const readLocalDrafts = (): DraftSummary[] => {
  if (typeof window === "undefined") return [];
  const drafts: DraftSummary[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith("cv_draft_")) continue;
    const id = key.replace("cv_draft_", "");
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed: { resumeData: ResumeData; profileName: string; lastSaved?: string } =
        JSON.parse(raw);
      drafts.push({
        id,
        profileName: parsed.profileName || "Untitled Resume",
        fullName: parsed.resumeData?.personalInfo?.fullName || "",
        jobTitle: parsed.resumeData?.personalInfo?.jobTitle || "",
        templateId: parsed.resumeData?.templateId || "",
        lastSaved: parsed.lastSaved || new Date(0).toISOString(),
      });
    } catch {
      // Corrupt draft — skip silently
    }
  }
  return drafts.sort(
    (a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()
  );
};

const ResumeSessionModal: React.FC<ResumeSessionModalProps> = ({
  onStartFresh,
  onContinue,
}) => {
  const drafts = useMemo(() => readLocalDrafts(), []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Resume Session
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Continue an existing draft or start a brand new resume.
            </p>
          </div>
          <button
            onClick={onStartFresh}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors cursor-pointer"
            title="Close and start fresh"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pt-5">
          <button
            onClick={onStartFresh}
            className="w-full group flex items-center justify-between gap-4 p-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <FilePlus className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-blue-700">
                  Start a New Resume
                </p>
                <p className="text-[11px] text-blue-500 font-medium mt-0.5">
                  Opens a blank form with your chosen template
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>

        {drafts.length > 0 && (
          <div className="px-6 pt-4 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Saved Drafts ({drafts.length})
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {drafts.map((draft) => (
                <button
                  key={draft.id}
                  onClick={() => onContinue(draft.id)}
                  className="w-full group flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition-all duration-200 cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-10 rounded-md bg-linear-to-br from-slate-200 to-slate-300 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                      <span className="text-[8px] font-bold text-slate-500 text-center leading-tight px-0.5">
                        CV
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {draft.profileName}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {draft.fullName
                          ? `${draft.fullName}${draft.jobTitle ? ` · ${draft.jobTitle}` : ""}`
                          : "No personal info yet"}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400 font-medium">
                        <Clock className="w-2.5 h-2.5" />
                        <span suppressHydrationWarning>{formatRelative(draft.lastSaved)}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {drafts.length === 0 && (
          <div className="px-6 pb-6 pt-2">
            <p className="text-[11px] text-slate-400 font-medium text-center py-3">
              No saved drafts found on this device.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeSessionModal;
