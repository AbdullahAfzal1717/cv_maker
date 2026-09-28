"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit3, Briefcase, Calendar, X } from "lucide-react";
import type { ResumeData, ExperienceEntry } from "../../types/resume";
import MonthYearPicker from "../common/MonthYearPicker";
import { useToast } from "../../context/ToastContext";
import { formatMonthYear } from "../../utils/formatDate";

interface ExperienceFormProps {
  entries: ExperienceEntry[];
  onChange: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  entries,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [isPresent, setIsPresent] = useState(false);
  const { showToast } = useToast();

  const openForm = (entry?: ExperienceEntry) => {
    if (entry) {
      setEditingId(entry.id);
      setCompany(entry.company);
      setRole(entry.role);
      setStartDate(entry.startDate);
      setEndDate(entry.endDate === "Present" ? "" : entry.endDate);
      setIsPresent(entry.endDate === "Present");
      setDescription(entry.description);
    } else {
      setEditingId(null);
      setCompany("");
      setRole("");
      setStartDate("");
      setEndDate("");
      setIsPresent(false);
      setDescription("");
    }
    setIsOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;

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
      let updatedExp = [...prev.experience];

      if (editingId) {
        updatedExp = updatedExp.map((exp) =>
          exp.id === editingId
            ? {
                ...exp,
                company,
                role,
                startDate,
                endDate: finalEndDate,
                description,
              }
            : exp,
        );
      } else {
        const newEntry: ExperienceEntry = {
          id: crypto.randomUUID(),
          company,
          role,
          startDate,
          endDate: finalEndDate,
          description,
        };
        updatedExp.push(newEntry);
      }

      return { ...prev, experience: updatedExp };
    });

    setIsOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  return (
    <div className="space-y-4 animate-fadeIn relative min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Work Experience
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Detail your employment or internships.
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
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <span className="text-xs text-slate-400 font-medium block">
              No professional experiences listed yet.
            </span>
          </div>
        ) : (
          entries.map((exp) => (
            <div
              key={exp.id}
              onClick={() => openForm(exp)}
              className="group border border-slate-200 hover:border-blue-400 p-3 rounded-xl flex items-center justify-between cursor-pointer bg-slate-50/40 hover:bg-white transition-all"
            >
              <div className="space-y-0.5 max-w-[80%]">
                <h4 className="text-xs font-bold text-slate-800 truncate">
                  {exp.role}
                </h4>
                <p className="text-[11px] font-semibold text-slate-500 truncate">
                  {exp.company}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {formatMonthYear(exp.startDate) || "N/A"} —{" "}
                    {formatMonthYear(exp.endDate) || "Present"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="p-1.5 hover:bg-slate-100 rounded text-slate-500">
                  <Edit3 className="w-3.5 h-3.5" />
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDelete(exp.id, e)}
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
              {editingId ? "Edit Work Entry" : "Add Work Entry"}
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
                Company / Organization *
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. TechCorp Solutions"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Job Role / Title *
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. MERN Developer Intern"
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

            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Responsibilities & Achievements
              </label>
              <textarea
                value={description}
                maxLength={600}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Built features using React and Express.js, improved API execution time..."
                rows={4}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all resize-none leading-relaxed"
              />
              <div className="absolute bottom-2 right-2 text-[9px] font-bold text-slate-400 bg-white border border-slate-100 px-1.5 py-0.5 rounded shadow-sm">
                <span
                  className={description.length > 550 ? "text-amber-500" : ""}
                >
                  {description.length} / 600 chars
                </span>
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

export default ExperienceForm;
