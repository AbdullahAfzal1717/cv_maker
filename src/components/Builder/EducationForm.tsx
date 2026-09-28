"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit3, GraduationCap, Calendar, X } from "lucide-react";
import type { ResumeData, EducationEntry } from "../../types/resume";
import MonthYearPicker from "../common/MonthYearPicker";
import { useToast } from "../../context/ToastContext";
import { formatMonthYear } from "../../utils/formatDate";

interface EducationFormProps {
  entries: EducationEntry[];
  onChange: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const EducationForm: React.FC<EducationFormProps> = ({ entries, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [grade, setGrade] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPresent, setIsPresent] = useState(false);
  const { showToast } = useToast();

  const openForm = (entry?: EducationEntry) => {
    if (entry) {
      setEditingId(entry.id);
      setInstitution(entry.institution);
      setDegree(entry.degree);
      setGrade(entry.grade);
      setStartDate(entry.startDate);
      setEndDate(entry.endDate === "Present" ? "" : entry.endDate);
      setIsPresent(entry.endDate === "Present");
    } else {
      setEditingId(null);
      setInstitution("");
      setDegree("");
      setGrade("");
      setStartDate("");
      setEndDate("");
      setIsPresent(false);
    }
    setIsOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution || !degree) return;
    if (
      !isPresent &&
      startDate &&
      endDate &&
      new Date(startDate) > new Date(endDate)
    ) {
      showToast("End date cannot be earlier than start date.", "error");
      return;
    }

    const finalEndDate = isPresent ? "Present" : endDate;

    onChange((prev) => {
      let updatedEducation = [...prev.education];

      if (editingId) {
        updatedEducation = updatedEducation.map((edu) =>
          edu.id === editingId
            ? {
                ...edu,
                institution,
                degree,
                grade,
                startDate,
                endDate: finalEndDate,
              }
            : edu,
        );
      } else {
        const newEntry: EducationEntry = {
          id: crypto.randomUUID(),
          institution,
          degree,
          grade,
          startDate,
          endDate: finalEndDate,
        };
        updatedEducation.push(newEntry);
      }

      return { ...prev, education: updatedEducation };
    });

    setIsOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  return (
    <div className="space-y-4 animate-fadeIn relative min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Education History
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your academic qualifications.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openForm()}
          className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm shadow-blue-500/10"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      <div className="space-y-2">
        {entries.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <span className="text-xs text-slate-400 font-medium block">
              No academic info added yet.
            </span>
          </div>
        ) : (
          entries.map((edu) => (
            <div
              key={edu.id}
              onClick={() => openForm(edu)}
              className="group border border-slate-200 hover:border-blue-400 p-3 rounded-xl flex items-center justify-between cursor-pointer bg-slate-50/40 hover:bg-white transition-all"
            >
              <div className="space-y-0.5 max-w-[80%]">
                <h4 className="text-xs font-bold text-slate-800 truncate">
                  {edu.degree}
                </h4>
                <p className="text-[11px] font-semibold text-slate-500 truncate">
                  {edu.institution}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {formatMonthYear(edu.startDate) || "N/A"} —{" "}
                    {formatMonthYear(edu.endDate) || "Present"}
                  </span>
                  {edu.grade && (
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">
                      Result: {edu.grade}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="p-1.5 hover:bg-slate-100 rounded text-slate-500">
                  <Edit3 className="w-3.5 h-3.5" />
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDelete(edu.id, e)}
                  className="p-1.5 hover:bg-red-50 rounded text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isOpen && (
        <div className="absolute inset-0 bg-white z-20 flex flex-col animate-slideUp">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-xs font-bold text-slate-800">
              {editingId ? "Edit Education Entry" : "Add Education Entry"}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={handleSave}
            className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pb-4 pr-1"
          >
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                School / University *
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. NUML University"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Degree / Qualification *
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. BS Computer Science"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Grade / GPA / Percentage
              </label>
              <input
                type="text"
                maxLength={10}
                value={grade}
                onChange={(e) =>
                  setGrade(e.target.value.replace(/[^a-zA-Z0-9./\s-]/g, ""))
                }
                placeholder="e.g. 3.8 / 4.0, A+, or 85%"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="min-w-0">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Start Date
                </label>
                <MonthYearPicker value={startDate} onChange={setStartDate} />
              </div>
              <div className="min-w-0">
                <label className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                  End Date
                  <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-blue-600 font-semibold select-none">
                    <input
                      type="checkbox"
                      checked={isPresent}
                      onChange={(e) => {
                        setIsPresent(e.target.checked);
                        if (e.target.checked) setEndDate("");
                      }}
                      className="accent-blue-600 rounded cursor-pointer"
                    />
                    Present
                  </label>
                </label>
                <MonthYearPicker
                  value={endDate}
                  onChange={setEndDate}
                  disabled={isPresent}
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EducationForm;
