"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutGrid,
  Download,
  ChevronDown,
  ChevronUp,
  MoreVertical,
} from "lucide-react";
import AppBar from "@/components/common/AppBar";
import PageLoader from "@/components/common/PageLoader";
import { storage } from "@/utils/storage";
import PersonalInfoForm from "@/components/Builder/PersonalInfoForm";
import ObjectiveForm from "@/components/Builder/ObjectiveForm";
import EducationForm from "@/components/Builder/EducationForm";
import ExperienceForm from "@/components/Builder/ExperienceForm";
import ProjectsForm from "@/components/Builder/ProjectsForm";
import AdditionalForm from "@/components/Builder/AdditionalForm";
import ExportForm from "@/components/Builder/ExportForm";
import { TemplateRegistry } from "@/components/Templates/TemplateRegistry";
import ResponsiveResumeScaler from "@/components/common/ResponsiveResumeScaler";
import { STEP_NAMES } from "@/constants/builder";
import { useCVProfileSync } from "@/hooks/useCVProfileSync";
import { cvService } from "@/services/cvService";
import { TEMPLATES_DATA } from "@/constants/templates";
import { getTransferData, clearTransferData } from "@/utils/transferData";
import type { SyncStatus, CVExport, ResumeData } from "@/types/resume";

const BuilderPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const incomingTemplateId: string =
    searchParams.get("templateId") ?? "classic-clean";
  const incomingProfileId: string | undefined =
    searchParams.get("profileId") ?? undefined;
  const incomingProfileName: string =
    searchParams.get("profileName") ?? "My Resume";
  const fromAI: boolean = searchParams.get("fromAI") === "true";
  const [incomingResumeData] = useState<ResumeData | undefined>(() => {
    if (!fromAI || typeof window === "undefined") return undefined;
    return getTransferData<ResumeData>("builder_resumeData") ?? undefined;
  });

  // Clean up transfer data after reading
  useEffect(() => {
    if (fromAI) {
      clearTransferData("builder_resumeData");
    }
  }, [fromAI]);

  const [profileId] = useState<string>(
    () => incomingProfileId ?? crypto.randomUUID(),
  );
  const [currentStep, setCurrentStep] = useState<number>(
    fromAI ? STEP_NAMES.length : 1,
  );

  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const validationErrorTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const {
    resumeData,
    setResumeData,
    profileName,
    setProfileName,
    isMainProfile,
    setIsMainProfile,
    status,
    isSyncedToAccount,
    syncStatus,
    loadingProfile,
    isInitialLoadRef,
    finishInitialLoad,
    loadProfile,
    persistLocal,
    syncRemote,
    instantSync,
  } = useCVProfileSync(
    profileId,
    incomingTemplateId,
    incomingProfileName,
    incomingResumeData,
  );
  const handleDownload = useCallback(async () => {
    await instantSync(resumeData);
    const token = storage.getToken();
    const dateStr = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const exportLabel = `${profileName} — ${dateStr}`;
    if (!token || !isSyncedToAccount) {
      const exportId = crypto.randomUUID();
      const localExport: CVExport = {
        _id: exportId,
        userId: "local",
        profileId,
        exportLabel,
        profileNameSnapshot: profileName,
        contentHash: "",
        resumeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      storage.setExport(exportId, localExport);
    }
    if (token && isSyncedToAccount) {
      try {
        await cvService.createCVExport({
          profileId,
          profileName,
          resumeData,
        });
      } catch {
        setValidationError(
          "Could not save export snapshot. PDF will still download.",
        );
        if (validationErrorTimerRef.current)
          clearTimeout(validationErrorTimerRef.current);
        validationErrorTimerRef.current = setTimeout(
          () => setValidationError(""),
          4000,
        );
      }
    }
    window.print();
  }, [instantSync, resumeData, profileId, profileName, isSyncedToAccount]);
  const showValidationError = useCallback((msg: string) => {
    setValidationError(msg);
    if (validationErrorTimerRef.current)
      clearTimeout(validationErrorTimerRef.current);
    validationErrorTimerRef.current = setTimeout(
      () => setValidationError(""),
      4000,
    );
  }, []);

  useEffect(() => {
    storage.setActiveDraftId(profileId);
    if (incomingProfileId) {
      loadProfile(
        incomingProfileId,
        !!incomingTemplateId && !!incomingProfileId,
      );
    } else {
      finishInitialLoad();
    }
  }, []);

  useEffect(() => {
    if (fromAI && !loadingProfile && isInitialLoadRef.current === false) {
      instantSync();
    }
  }, [fromAI, loadingProfile, instantSync]);

  useEffect(() => {
    if (loadingProfile) return;
    persistLocal(resumeData, profileName, isMainProfile, status);
  }, [
    resumeData,
    profileName,
    isMainProfile,
    status,
    profileId,
    loadingProfile,
  ]);

  useEffect(() => {
    if (isInitialLoadRef.current || !storage.getToken() || !isSyncedToAccount)
      return;
    const timer = setTimeout(() => {
      syncRemote(resumeData, profileName, isMainProfile, status);
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    resumeData,
    profileName,
    isMainProfile,
    status,
    profileId,
    isSyncedToAccount,
  ]);

  useEffect(() => {
    if (!isActionsMenuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (!actionsMenuRef.current?.contains(e.target as Node)) {
        setIsActionsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isActionsMenuOpen]);

  useEffect(() => {
    return () => {
      if (validationErrorTimerRef.current)
        clearTimeout(validationErrorTimerRef.current);
    };
  }, []);

  const goChangeTemplate = useCallback(() => {
    instantSync();
    const params = new URLSearchParams();
    params.set("profileId", profileId);
    params.set("profileName", profileName);
    params.set("selectedTemplateId", incomingTemplateId);
    router.push(`/choose-template?${params.toString()}`);
  }, [instantSync, router, profileId, profileName, incomingTemplateId]);

  const goBack = useCallback(() => {
    instantSync();
    router.back();
  }, [instantSync, router]);

  const stepBack = useCallback(() => {
    instantSync();
    setCurrentStep((p) => p - 1);
  }, [instantSync]);

  const stepNext = useCallback(() => {
    if (currentStep === 1) {
      const { fullName, email, phone } = resumeData.personalInfo;
      if (!fullName.trim())
        return showValidationError("Full Name is required.");
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return showValidationError("A valid Email Address is required.");
      if (phone.trim()) {
        const digitCount = phone.replace(/\D/g, "").length;
        if (
          !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(phone) ||
          digitCount < 9 ||
          digitCount > 12
        )
          return showValidationError(
            "Phone number must be between 9 and 12 digits, or left blank.",
          );
      }
    } else if (currentStep === 2) {
      if (!resumeData.objective.trim())
        return showValidationError("Professional Summary is required.");
    }
    instantSync();
    setCurrentStep((p) => p + 1);
  }, [instantSync, currentStep, resumeData, showValidationError]);

  const handleTopBarDownload = useCallback(() => {
    const { fullName, email, phone } = resumeData.personalInfo;
    if (!fullName.trim())
      return showValidationError("Full Name is required before downloading.");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return showValidationError(
        "A valid Email Address is required before downloading.",
      );
    if (phone.trim()) {
      const digitCount = phone.replace(/\D/g, "").length;
      if (
        !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(phone) ||
        digitCount < 9 ||
        digitCount > 12
      )
        return showValidationError(
          "Phone number must be between 9 and 12 digits, or left blank.",
        );
    }
    if (!resumeData.objective.trim())
      return showValidationError(
        "Professional Summary is required before downloading.",
      );
    handleDownload();
  }, [resumeData, handleDownload, showValidationError]);

  const goToStep = useCallback(
    (step: number) => {
      instantSync();
      setCurrentStep(step);
    },
    [instantSync],
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            data={resumeData.personalInfo}
            onChange={setResumeData}
            imageSpace={
              TEMPLATES_DATA.find((t) => t.id === resumeData.templateId)
                ?.hasImage ?? true
            }
          />
        );
      case 2:
        return (
          <ObjectiveForm data={resumeData.objective} onChange={setResumeData} />
        );
      case 3:
        return (
          <EducationForm
            entries={resumeData.education}
            onChange={setResumeData}
          />
        );
      case 4:
        return (
          <ExperienceForm
            entries={resumeData.experience}
            onChange={setResumeData}
          />
        );
      case 5:
        return (
          <ProjectsForm
            entries={resumeData.projects}
            onChange={setResumeData}
          />
        );
      case 6:
        return (
          <AdditionalForm
            data={resumeData.additional}
            onChange={setResumeData}
          />
        );
      case 7:
        return (
          <ExportForm
            data={resumeData}
            onDownload={handleDownload}
            profileName={profileName}
            setProfileName={setProfileName}
            isMainProfile={isMainProfile}
            setIsMainProfile={setIsMainProfile}
            syncStatus={syncStatus}
            onForceSync={() => instantSync()}
            onNavigateToStep={goToStep}
          />
        );
      default:
        return null;
    }
  };

  const syncPill: Record<SyncStatus, React.ReactNode> = {
    saving: (
      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-500">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
        Syncing…
      </span>
    ),
    synced: (
      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Synced
      </span>
    ),
    "saved-local": (
      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Saved locally
      </span>
    ),
    error: (
      <button
        onClick={() => instantSync()}
        className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 border border-red-100 bg-red-50 px-2 py-0.5 rounded-lg cursor-pointer"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Sync Error · Retry
      </button>
    ),
  };

  if (loadingProfile) {
    return <PageLoader />;
  }

  return (
    <div className="h-screen w-screen bg-[#f6f8fb] flex flex-col font-sans overflow-hidden select-none print:bg-white print:h-auto print:w-auto print:overflow-visible">
      <div className="print:hidden">
        <AppBar
          pageLabel={`Step ${currentStep} of ${STEP_NAMES.length} — ${STEP_NAMES[currentStep - 1]}`}
          onBack={goBack}
          actions={
            <>
              <div className="hidden sm:flex items-center gap-2">
                {syncPill[syncStatus]}
                <div className="h-4 w-px bg-slate-200" />
                <button
                  onClick={goChangeTemplate}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100/50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Change Template
                </button>
                <button
                  onClick={handleTopBarDownload}
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>

              <div
                ref={actionsMenuRef}
                className="relative flex sm:hidden items-center gap-1.5"
              >
                <button
                  onClick={handleTopBarDownload}
                  aria-label="Download resume"
                  className="p-2 rounded-lg text-white bg-slate-800 hover:bg-slate-900 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsActionsMenuOpen((o) => !o)}
                  aria-label="More actions"
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {isActionsMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-scaleIn">
                    <div className="px-2.5 py-2">{syncPill[syncStatus]}</div>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setIsActionsMenuOpen(false);
                        goChangeTemplate();
                      }}
                      className="w-full flex items-center gap-2 text-xs font-bold text-blue-600 px-2.5 py-2 rounded-xl hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      Change Template
                    </button>
                  </div>
                )}
              </div>
            </>
          }
        />
      </div>
      {validationError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5">
          <span className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-full shrink-0">
            !
          </span>
          {validationError}
        </div>
      )}
      <div className="grow w-full flex flex-col md:flex-row overflow-hidden print:overflow-visible print:block">
        <div className="md:hidden print:hidden w-full bg-white border-b border-slate-200 shrink-0">
          <button
            onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)}
            className="w-full py-3 px-6 flex items-center justify-between text-xs font-bold text-slate-700 active:bg-slate-50 cursor-pointer"
          >
            <span>
              {isMobilePreviewOpen
                ? "Hide Resume Preview"
                : "Show Resume Preview"}
            </span>
            {isMobilePreviewOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
        <aside
          className={`w-full md:w-[45%] lg:w-[40%] ${isMobilePreviewOpen ? "hidden md:flex" : "flex"} h-full bg-white border-r border-slate-200 flex-col overflow-hidden print:hidden`}
        >
          <div className="shrink-0 px-6 pt-6 pb-4">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400 uppercase tracking-wider">
                Step {currentStep} / {STEP_NAMES.length}
              </span>
              <span className="text-blue-600">
                {STEP_NAMES[currentStep - 1]}
              </span>
            </div>
          </div>
          <div className="grow relative overflow-y-auto custom-scrollbar px-4 pb-6">
            {renderStep()}
          </div>
          <footer className="shrink-0 px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between">
            <button
              disabled={currentStep === 1}
              onClick={stepBack}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 cursor-pointer"
            >
              Back
            </button>
            <button
              disabled={currentStep === STEP_NAMES.length}
              onClick={stepNext}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all disabled:opacity-40 cursor-pointer"
            >
              Next Step
            </button>
          </footer>
        </aside>
        <section
          className={`${isMobilePreviewOpen ? "flex" : "hidden md:flex"} flex-col grow h-full bg-slate-100 overflow-y-auto custom-scrollbar p-4 md:p-8 items-center justify-start print:p-0 print:bg-white print:flex print:h-auto print:overflow-visible print:w-full`}
        >
          <div className="w-full print:hidden">
            <ResponsiveResumeScaler>
              <TemplateRegistry
                data={resumeData}
                templateId={resumeData.templateId}
              />
            </ResponsiveResumeScaler>
          </div>

          {/* Print-only copy: kept in normal document flow at all times
      (moved off-screen, NOT display:none) so PaginatedSheet can
      continuously measure and paginate it — not just in the brief,
      unreliable window between `beforeprint` firing and Chrome
      finishing its print-media style recalculation. */}
          <div className="absolute -left-[9999px] top-0 w-[210mm] print:static print:left-auto print:top-auto print:w-full">
            <TemplateRegistry
              data={resumeData}
              templateId={resumeData.templateId}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default BuilderPage;
