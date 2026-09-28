"use client";

import React from "react";
import { Sparkles, FileText, ChevronRight } from "lucide-react";

interface QuickActionsProps {
  onCreateManually: () => void;
  onCreateWithAI: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateManually,
  onCreateWithAI,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      <button
        onClick={onCreateWithAI}
        className="bg-[#1e6df9] text-white p-6 rounded-2xl shadow-md hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/15 active:scale-[0.99] transition-all duration-200 text-left flex flex-col justify-between h-44 relative group cursor-pointer border-0"
      >
        <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:scale-105 transition-transform duration-300">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-1 mb-1 mt-6">
          <h3 className="text-base font-bold text-white m-0">
            Make Resume with AI
          </h3>
          <p className="text-xs text-blue-100 font-light m-0">
            Chat or speak your details in natural flow
          </p>
        </div>
        <div className="absolute right-6 bottom-6 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center border border-white/10 group-hover:translate-x-1 transition-transform duration-200">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
      </button>

      <button
        onClick={onCreateManually}
        className="bg-white text-slate-800 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md active:scale-[0.99] transition-all duration-200 text-left flex flex-col justify-between h-44 relative group cursor-pointer"
      >
        <div className="w-12 h-12 bg-blue-50 text-[#1e6df9] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <FileText className="w-6 h-6" />
        </div>
        <div className="space-y-1 mb-1 mt-6">
          <h3 className="text-base font-bold text-slate-800 m-0">
            Create Resume Manually
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Choose a template and fill your information step by step
          </p>
        </div>
        <div className="absolute right-6 bottom-6 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200/60 group-hover:translate-x-1 transition-transform duration-200 text-slate-400 group-hover:text-[#1e6df9]">
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};

export default QuickActions;
