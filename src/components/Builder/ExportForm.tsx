"use client";

import React, { useMemo } from "react";
import { CheckCircle2, AlertCircle, Download, Sparkles, Star, Settings, ChevronRight } from "lucide-react";
import type { ResumeData } from "../../types/resume";

interface ExportFormProps {
  data: ResumeData;
  onDownload: () => void;
  profileName: string;
  setProfileName: (name: string) => void;
  isMainProfile: boolean;
  setIsMainProfile: (val: boolean) => void;
  syncStatus: string;
  onForceSync: () => void;
  onNavigateToStep?: (step: number) => void;
}

const ExportForm: React.FC<ExportFormProps> = ({
  data,
  onDownload,
  profileName,
  setProfileName,
  isMainProfile,
  setIsMainProfile,
  onNavigateToStep,
}) => {
  const { checklist, progressPercent } = useMemo(() => {
    const items = [
      {
        name: "Personal Profile Details",
        isReady: !!data.personalInfo.fullName && !!data.personalInfo.email,
      },
      {
        name: "Professional Summary / Objective",
        isReady: !!data.objective.trim(),
      },
      { name: "Academic History Listed", isReady: data.education.length > 0 },
      {
        name: "Professional Experience Blocks",
        isReady: data.experience.length > 0,
      },
      { name: "Projects Portfolio Logged", isReady: data.projects.length > 0 },
      {
        name: "Core Skills & Tags Injected",
        isReady: data.additional.skills.length > 0,
      },
    ];
    const readyCount = items.filter((item) => item.isReady).length;
    return {
      checklist: items,
      progressPercent: Math.round((readyCount / items.length) * 100),
    };
  }, [
    data.personalInfo.fullName,
    data.personalInfo.email,
    data.objective,
    data.education.length,
    data.experience.length,
    data.projects.length,
    data.additional.skills.length,
  ]);

  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <h2 className="text-base font-bold text-slate-800">Review & Export</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Verify your metrics summary checklist and build your file.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700">Resume Integrity Score</span>
          <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            {progressPercent}% Ready
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 block">
          Section Completion Overview
        </label>
        <div className="space-y-2">
          {checklist.map((item, index) => {
            const stepNumber = index + 1;
            return (
              <button
                key={index}
                type="button"
                onClick={() => onNavigateToStep?.(stepNumber)}
                className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all text-xs font-medium cursor-pointer text-left hover:scale-[1.005] hover:shadow-sm active:scale-[0.99] ${
                  item.isReady
                    ? "bg-emerald-50/30 border-emerald-100 hover:border-emerald-200 text-emerald-800"
                    : "bg-amber-50/20 border-amber-100/70 hover:border-amber-200/70 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.isReady ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide ${item.isReady ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {item.isReady ? "Complete" : "Optional / Missing"}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-4 text-left">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Profile Configuration & Sync</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Profile Label / Name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="e.g. My Primary Resume"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none transition-colors"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className={`w-4 h-4 ${isMainProfile ? "text-amber-500 fill-amber-400" : "text-slate-400"}`} />
              <span className="text-xs font-bold text-slate-700">Set as Primary Profile</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isMainProfile}
                onChange={() => setIsMainProfile(!isMainProfile)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onDownload}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md active:scale-[0.99]"
        >
          <Download className="w-4 h-4" />
          Download Premium PDF Document
        </button>
        <p className="text-[10px] text-slate-400 font-medium text-center mt-2.5 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />{" "}
          Standardized layout structures optimized for parsing scripts.
        </p>
      </div>
    </div>
  );
};

export default ExportForm;
