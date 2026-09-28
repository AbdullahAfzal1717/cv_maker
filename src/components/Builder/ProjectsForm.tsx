"use client";

import React, { useState, useMemo } from "react";
import { Plus, Trash2, Edit3, FolderGit, X, AlertCircle } from "lucide-react";
import type { ResumeData, ProjectEntry } from "../../types/resume";

interface ProjectsFormProps {
  entries: ProjectEntry[];
  onChange: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ entries, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techInput, setTechInput] = useState("");
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");

  const parsedTechTags = useMemo(() => {
    return techInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }, [techInput]);

  const openForm = (entry?: ProjectEntry) => {
    if (entry) {
      setEditingId(entry.id);
      setTitle(entry.title);
      setDescription(entry.description);
      setTechInput(entry.technologies.join(", "));
      setLink(entry.link);
    } else {
      setEditingId(null);
      setTitle("");
      setDescription("");
      setTechInput("");
      setLink("");
    }
    setLinkError("");
    setIsOpen(true);
  };

  const handleLinkChange = (value: string) => {
    setLink(value);
    if (!value) {
      setLinkError("");
      return;
    }

    const isValidProtocol =
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("github.com");
    if (!isValidProtocol) {
      setLinkError("URL should start with http://, https://, or github.com");
    } else {
      setLinkError("");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || linkError) return;

    onChange((prev) => {
      let updatedProj = [...prev.projects];

      if (editingId) {
        updatedProj = updatedProj.map((proj) =>
          proj.id === editingId
            ? {
                ...proj,
                title: title.trim(),
                description: description.trim(),
                technologies: parsedTechTags,
                link: link.trim(),
              }
            : proj,
        );
      } else {
        const newEntry: ProjectEntry = {
          id: crypto.randomUUID(),
          title: title.trim(),
          description: description.trim(),
          technologies: parsedTechTags,
          link: link.trim(),
        };
        updatedProj.push(newEntry);
      }

      return { ...prev, projects: updatedProj };
    });

    setIsOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  return (
    <div className="space-y-4 animate-fadeIn relative min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Projects Portfolio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Showcase your personal or commercial applications.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openForm()}
          className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      <div className="space-y-2 max-h-85 overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <FolderGit className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <span className="text-xs text-slate-400 font-medium block">
              No applications listed yet.
            </span>
          </div>
        ) : (
          entries?.map((proj) => (
            <div
              key={proj?.id}
              onClick={() => openForm(proj)}
              className="group border border-slate-200 hover:border-blue-400 p-3 rounded-xl flex items-center justify-between cursor-pointer bg-slate-50/40 hover:bg-white transition-all"
            >
              <div className="space-y-0.5 max-w-[80%]">
                <h4 className="text-xs font-bold text-slate-800 truncate">
                  {proj?.title}
                </h4>
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj?.technologies.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {proj?.technologies.length > 3 && (
                    <span className="text-[9px] font-bold text-slate-400">
                      +{proj?.technologies.length - 3} more
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
                  onClick={(e) => handleDelete(proj?.id, e)}
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
              {editingId ? "Edit Project Details" : "Add Project Entry"}
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={handleSave}
            className="space-y-3 flex-1 overflow-y-auto pb-4 pr-1"
          >
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Command-X (VitalSync)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Project Link / Repository URL
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => handleLinkChange(e.target.value)}
                placeholder="e.g. https://github.com/username/project"
                className={`w-full px-3 py-2 bg-slate-50 border ${linkError ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"} focus:bg-white rounded-xl text-xs font-medium outline-none transition-all`}
              />
              {linkError && (
                <span className="text-[10px] flex items-center gap-1 text-red-500 font-semibold mt-1">
                  <AlertCircle className="w-3 h-3" /> {linkError}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Technologies Used (Separated by commas)
              </label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="e.g. React Native, Node.js, Supabase"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all mb-2"
              />
              {parsedTechTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  {parsedTechTags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Project Description
              </label>
              <textarea
                value={description}
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe features, system architecture, or your contributions..."
                rows={4}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all resize-none leading-relaxed"
              />
              <div className="absolute bottom-2 right-2 text-[9px] font-bold text-slate-400 bg-white border border-slate-100 px-1.5 py-0.5 rounded shadow-sm">
                <span
                  className={description.length > 450 ? "text-amber-500" : ""}
                >
                  {description.length} / 500 chars
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
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
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

export default ProjectsForm;
