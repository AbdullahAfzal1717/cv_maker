"use client";

import React from "react";
import { FileText, Palette, Download, Loader2 } from "lucide-react";
import { TEMPLATES_DATA } from "../../constants/templates";

interface StatsRowProps {
  resumeCount: number;
  exportCount: number;
  loading?: boolean;
}

const StatsRow: React.FC<StatsRowProps> = ({
  resumeCount,
  exportCount,
  loading,
}) => {
  const templateCount = TEMPLATES_DATA.length;

  const stats = [
    {
      icon: <FileText className="w-4 h-4" />,
      value: resumeCount,
      label: "Resumes",
      color: "bg-blue-50 text-[#1e6df9]",
    },
    {
      icon: <Palette className="w-4 h-4" />,
      value: templateCount,
      label: "Templates",
      color: "bg-purple-50 text-purple-500",
    },
    {
      icon: <Download className="w-4 h-4" />,
      value: exportCount,
      label: "Exports",
      color: "bg-green-50 text-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center"
        >
          <div
            className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mb-3`}
          >
            {stat.icon}
          </div>
          <div className="h-8 flex items-center justify-center mb-1.5">
            {loading ? (
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            ) : (
              <span className="text-xl md:text-2xl font-extrabold text-slate-800 leading-none">
                {stat.value}
              </span>
            )}
          </div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
