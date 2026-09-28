"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, CheckCircle2 } from "lucide-react";
import type { Template } from "../../constants/templates";

interface TemplateCardProps {
  template: Template;
  onSelect: (id: string) => void;
  isCurrent?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  isCurrent = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    if (!isCurrent) {
      onSelect(template.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group relative overflow-hidden rounded-2xl bg-white border transition-all duration-300 ${
          isCurrent
            ? "border-blue-500 ring-2 ring-blue-500/20 shadow-xl"
            : "border-slate-200 hover:border-blue-300 hover:shadow-xl cursor-pointer hover:-translate-y-1"
        }
      `}
    >
      {template.isPopular && (
        <div className="absolute top-4 left-4 z-10 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 px-3 py-1 text-[11px] font-bold text-white shadow-lg flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Popular
        </div>
      )}

      {isCurrent && (
        <div className="absolute top-4 right-4 z-10 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow-lg">
          Current
        </div>
      )}

      <div className="relative aspect-3/4 overflow-hidden bg-slate-100">
        {!imageLoaded && (
          <div className="absolute inset-0 overflow-hidden bg-slate-200">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/70 to-transparent" />
          </div>
        )}

        <Image
          src={template.image}
          alt={template.name}
          fill
          onLoadingComplete={() => setImageLoaded(true)}
          className={`h-full w-full object-cover object-top transition-all duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } ${!isCurrent ? "group-hover:scale-[1.03]" : ""}`}
        />

        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isCurrent
              ? "bg-slate-900/30 opacity-100"
              : "bg-slate-900/45 opacity-0 group-hover:opacity-100"
          }`}
        >
          <span
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-xl transition-all duration-300 ${
              isCurrent
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-800 translate-y-3 group-hover:translate-y-0"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCurrent ? "Current Template" : "Use This Template"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3
          className={`text-base font-bold tracking-tight transition-colors ${
            isCurrent
              ? "text-blue-700"
              : "text-slate-800 group-hover:text-blue-600"
          }`}
        >
          {template.name}
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-500">
          {template.tagline}
        </p>
      </div>
    </div>
  );
};

export default TemplateCard;
