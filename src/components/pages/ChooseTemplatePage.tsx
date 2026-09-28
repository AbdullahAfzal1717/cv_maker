"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TEMPLATES_DATA, CATEGORIES } from "@/constants/templates";
import TemplateCard from "@/components/common/TemplateCard";
import AppBar from "@/components/common/AppBar";
import { LayoutDashboard } from "lucide-react";
import { getTransferData, setTransferData } from "@/utils/transferData";
import type { ResumeData } from "@/types/resume";

const ChooseTemplatePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const incomingProfileId = searchParams.get("profileId") ?? undefined;
  const incomingProfileName = searchParams.get("profileName") ?? undefined;
  const fromAI = searchParams.get("fromAI") === "true";
  const selectedTemplateId =
    searchParams.get("selectedTemplateId") ?? undefined;

  const [incomingResumeData, setIncomingResumeData] = useState<
    ResumeData | undefined
  >(() => {
    if (!fromAI) return undefined;
    return getTransferData<ResumeData>("ai_resumeData") ?? undefined;
  });

  const itemsPerPage = 6;
  
  const [activeCategory, setActiveCategory] = useState(() => {
    if (!selectedTemplateId) return "all";
    const template = TEMPLATES_DATA.find((t) => t.id === selectedTemplateId);
    return template?.category ?? "all";
  });

  const [currentPage, setCurrentPage] = useState(() => {
    if (!selectedTemplateId) return 1;
    const template = TEMPLATES_DATA.find((t) => t.id === selectedTemplateId);
    if (!template) return 1;
    const templates = TEMPLATES_DATA.filter(
      (t) => t.category === template.category,
    );
    const index = templates.findIndex((t) => t.id === selectedTemplateId);
    return index === -1 ? 1 : Math.floor(index / itemsPerPage) + 1;
  });

  useEffect(() => {
    if (fromAI && !incomingResumeData) {
      router.replace(
        "/ai-chat?errorMsg=Your%20generated%20CV%20data%20was%20lost%20%E2%80%94%20please%20generate%20again.",
      );
    }
  }, [fromAI, incomingResumeData, router]);

  const filteredTemplates = useMemo(
    () =>
      activeCategory === "all"
        ? TEMPLATES_DATA
        : TEMPLATES_DATA.filter((t) => t.category === activeCategory),
    [activeCategory],
  );

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);

  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTemplates.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTemplates, currentPage]);

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setCurrentPage(1);
  };

  const handleSelectTemplate = (templateId: string) => {
    const params = new URLSearchParams();
    params.set("templateId", templateId);
    if (incomingProfileId) params.set("profileId", incomingProfileId);
    if (incomingProfileName) params.set("profileName", incomingProfileName);
    if (fromAI) {
      params.set("fromAI", "true");
      if (incomingResumeData) {
        setTransferData("builder_resumeData", incomingResumeData);
      }
    }
    router.push(`/builder?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col font-sans select-none text-slate-700">
      <AppBar
        pageLabel="Choose Template"
        backTo="/dashboard"
        actions={
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
        }
      />

      <div className="w-full bg-white border-b border-slate-100 sticky top-18 z-30 px-4 pt-3 pb-2">
        <div className="max-w-6xl mx-auto flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 grow content-start">
          {paginatedTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleSelectTemplate}
              isCurrent={template.id === selectedTemplateId}
            />
          ))}
          {paginatedTemplates.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 font-medium">
              No templates found in this category.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4 border-t border-slate-200 pt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChooseTemplatePage;
