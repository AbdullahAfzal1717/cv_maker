"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import type { ResumeData } from "../../types/resume";

interface ObjectiveFormProps {
  data: string;
  onChange: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const EXAMPLE_OBJECTIVES = [
  {
    label: "Frontend / MERN",
    text: "Detail-oriented and passionate MERN Stack Developer with a strong foundation in building responsive, modern web applications. Proficient in TypeScript, React, Node.js, and database architectures, with a focus on writing clean, maintainable code to deliver seamless user experiences.",
  },
  {
    label: "Entry Level / CS Graduate",
    text: "Ambitious Computer Science graduate eager to apply strong problem-solving skills and foundational knowledge in full-stack web development to a fast-paced engineering team. Committed to continuous learning, collaborative development, and implementing optimized digital solutions.",
  },
  {
    label: "Experienced Professional",
    text: "Results-driven Software Engineer with proven expertise in planning, developing, and deploying robust web and mobile applications using the MERN ecosystem. Adept at optimizing API performance, mentoring junior developers, and translating complex business requirements into scalable code architectures.",
  },
];

const ObjectiveForm: React.FC<ObjectiveFormProps> = ({ data, onChange }) => {
  const handleTextChange = (text: string) => {
    onChange((prev) => ({
      ...prev,
      objective: text,
    }));
  };

  const getWordCount = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const charCount = data.length;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <h2 className="text-base font-bold text-slate-800">
          Professional Objective
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Write a brief, impactful summary statement highlighting your skills
          and career ambitions.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          Need Inspiration? Click to auto-fill:
        </label>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_OBJECTIVES.map((chip, index) => {
            const isSelected = data.trim() === chip.text.trim();

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleTextChange(chip.text)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer text-left ring-offset-2 focus:ring-2 focus:ring-blue-500 ${
                  isSelected
                    ? "bg-blue-600 text-white border border-blue-600 shadow-sm"
                    : "bg-blue-50/60 text-blue-600 border border-blue-100 hover:bg-blue-100/80"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={data}
          maxLength={450}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Type your summary here or click an example above..."
          rows={6}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all resize-none leading-relaxed"
        />
        <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-md shadow-sm">
          <span className={charCount > 400 ? "text-amber-500" : ""}>
            {charCount} /  450 chars
          </span>
          <span className="mx-1.5 opacity-50">|</span>
          <span>{getWordCount(data)} words</span>
        </div>
      </div>
    </div>
  );
};

export default ObjectiveForm;
