"use client";

import React, { useState, useRef } from "react";
import { Plus, Tag, X, AlertCircle } from "lucide-react";
import type { ResumeData, AdditionalSections } from "../../types/resume";

interface AdditionalFormProps {
  data: AdditionalSections;
  onChange: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const SECTIONS: {
  key: keyof AdditionalSections;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "skills",
    label: "Skills",
    placeholder: "e.g. MERN Stack, TypeScript, Git",
  },
  {
    key: "languages",
    label: "Languages",
    placeholder: "e.g. English, Urdu, Chinese",
  },
  {
    key: "interests",
    label: "Interests / Hobbies",
    placeholder: "e.g. Tape ball cricket, open-source",
  },
  {
    key: "certificates",
    label: "Certifications",
    placeholder: "e.g. AWS Certified Developer",
  },
  {
    key: "references",
    label: "References",
    placeholder: "Available upon request",
  },
];

const AdditionalForm: React.FC<AdditionalFormProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] =
    useState<keyof AdditionalSections>("skills");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_TAGS = 20;
  const currentTags = data[activeTab];
  const isMaxReached = currentTags.length >= MAX_TAGS;

  const handleAddTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isMaxReached) return;

    const cleanValue = inputValue.trim();
    if (!cleanValue) return;

    if (currentTags.includes(cleanValue)) {
      setInputValue("");
      return;
    }

    onChange((prev) => ({
      ...prev,
      additional: {
        ...prev.additional,
        [activeTab]: [...prev.additional[activeTab], cleanValue],
      },
    }));
    setInputValue("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange((prev) => ({
      ...prev,
      additional: {
        ...prev.additional,
        [activeTab]: prev.additional[activeTab].filter(
          (tag) => tag !== tagToRemove,
        ),
      },
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "" && currentTags.length > 0) {
      e.preventDefault();
      const lastTag = currentTags[currentTags.length - 1];
      handleRemoveTag(lastTag);
    }
  };

  const currentActiveSectionInfo = SECTIONS.find((s) => s.key === activeTab)!;

  return (
    <div className="space-y-4 animate-fadeIn flex flex-col h-full">
      <div>
        <h2 className="text-base font-bold text-slate-800">
          Additional Data Elements
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Enrich your profile with specialized meta-tags.
        </p>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 shrink-0 border-b border-slate-100 scrollbar-none">
        {SECTIONS.map((sec) => (
          <button
            key={sec.key}
            type="button"
            onClick={() => {
              setActiveTab(sec.key);
              setInputValue("");
              inputRef.current?.focus();
            }}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
              activeTab === sec.key
                ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/15"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1 shrink-0 mt-2">
        <form onSubmit={handleAddTag} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isMaxReached}
              placeholder={
                isMaxReached
                  ? "Maximum items reached"
                  : currentActiveSectionInfo.placeholder
              }
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all disabled:opacity-50 disabled:bg-slate-100"
            />
          </div>
          <button
            type="submit"
            disabled={isMaxReached}
            className="p-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-all cursor-pointer shadow-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
        {isMaxReached && (
          <span className="text-[10px] flex items-center gap-1 text-amber-500 font-bold ml-1">
            <AlertCircle className="w-3 h-3" /> Max 20 items reached for this
            section.
          </span>
        )}
      </div>

      <div className="grow border border-dashed border-slate-200 rounded-xl bg-slate-50/30 p-4 overflow-y-auto mt-2 max-h-56">
        {currentTags.length === 0 ? (
          <div className="text-center py-6 text-slate-400 font-medium text-[11px]">
            No tags appended inside {currentActiveSectionInfo.label} yet. Type a
            term and press + above.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {currentTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg text-[10px] animate-scaleIn shadow-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="p-0.5 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalForm;
