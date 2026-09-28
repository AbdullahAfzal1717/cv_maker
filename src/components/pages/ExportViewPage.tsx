"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Download, LayoutDashboard } from "lucide-react";
import AppBar from "@/components/common/AppBar";
import PageLoader from "@/components/common/PageLoader";
import { TemplateRegistry } from "@/components/Templates/TemplateRegistry";
import { cvService } from "@/services/cvService";
import { storage } from "@/utils/storage";
import type { CVExport } from "@/types/resume";

const ExportViewPage: React.FC = () => {
  const params = useParams();
  const exportId = params.exportId as string;
  const router = useRouter();
  const [exportItem, setExportItem] = useState<CVExport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!exportId) return;

    const loadExport = async () => {
      setLoading(true);
      try {
        const token = storage.getToken();
        if (token) {
          const data = await cvService.getCVExportById(exportId);
          setExportItem(data);
          return;
        }

        const local = storage.getExport<CVExport>(exportId);
        if (!local) throw new Error("not found");
        setExportItem(local);
      } catch {
        setError("Export not found or you do not have access.");
      } finally {
        setLoading(false);
      }
    };

    loadExport();
  }, [exportId]);

  if (loading) {
    return <PageLoader />;
  }

  if (error || !exportItem) {
    return (
      <div className="min-h-screen bg-[#f6f8fb] flex flex-col items-center justify-center p-6">
        <p className="text-sm font-semibold text-slate-600 mb-4">{error}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#f6f8fb] flex flex-col font-sans overflow-hidden select-none print:bg-white print:h-auto print:w-auto print:overflow-visible">
      <div className="print:hidden">
        <AppBar
          pageLabel={exportItem.exportLabel}
          onBack={() => router.push("/dashboard")}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </button>
            </div>
          }
        />
      </div>

      <div className="grow w-full flex flex-col overflow-y-auto p-4 md:p-8 items-center justify-start print:p-0 print:bg-white print:overflow-visible">
        <div
          id="resume-canvas-sheet"
          className="w-full max-w-[210mm] min-h-max bg-white border border-slate-200 shadow-xl rounded-sm print:border-none print:shadow-none print:w-full print:max-w-none print:overflow-visible print:h-auto"
        >
          <TemplateRegistry
            data={exportItem.resumeData}
            templateId={exportItem.resumeData.templateId}
          />
        </div>
      </div>
    </div>
  );
};

export default ExportViewPage;
