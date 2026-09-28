"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/Home/Navbar";
import QuickActions from "@/components/Dashboard/QuickActions";
import MyResumesSection from "@/components/Dashboard/MyResumesSection";
import StatsRow from "@/components/Dashboard/StatsRow";
import ProfilePickerModal from "@/components/common/ProfilePickerModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { cvService } from "@/services/cvService";
import type { CVProfile, CVExport, CVDraft } from "@/types/resume";
import { storage } from "@/utils/storage";

const readLocalProfiles = (): CVProfile[] => {
  return storage
    .listDraftIds()
    .map((id) => {
      const draft = storage.getDraft<CVDraft>(id);
      if (!draft) return null;
      const iso = draft.lastSaved ?? new Date(0).toISOString();
      return {
        _id: id,
        userId: "local",
        profileName: draft.profileName || "My Resume",
        isMainProfile: draft.isMainProfile ?? false,
        status: draft.status ?? "incomplete",
        resumeData: draft.resumeData,
        createdAt: iso,
        updatedAt: iso,
      } satisfies CVProfile;
    })
    .filter(Boolean) as CVProfile[];
};

const readLocalExports = (): CVExport[] => {
  return storage
    .listExportIds()
    .map((id) => storage.getExport<CVExport>(id))
    .filter(Boolean) as CVExport[];
};

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [profiles, setProfiles] = useState<CVProfile[]>([]);
  const [exports, setExports] = useState<CVExport[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<{ id: string; name: string } | null>(null);
  const [exportToDelete, setExportToDelete] = useState<{ id: string; label: string } | null>(null);

  const fetchData = useCallback(async () => {
    setStatsLoading(true);
    const token = storage.getToken();
    const localProfiles = readLocalProfiles();
    const localExports = readLocalExports();

    if (!token) {
      setProfiles(localProfiles);
      setExports(localExports);
      setStatsLoading(false);
      return;
    }

    try {
      const [profileData, exportData] = await Promise.all([
        cvService.getCVProfiles(),
        cvService.getCVExports(),
      ]);
      setProfiles([
        ...profileData,
        ...localProfiles.filter(
          (lp) => !profileData.some((rp) => rp._id === lp._id),
        ),
      ]);
      setExports([
        ...exportData,
        ...localExports.filter(
          (le) => !exportData.some((re) => re._id === le._id),
        ),
      ]);
    } catch {
      setProfiles(localProfiles);
      setExports(localExports);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const handleRename = useCallback(async (id: string, newName: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p._id === id ? { ...p, profileName: newName } : p)),
    );
    const localDraft = storage.getDraft<CVDraft>(id);
    if (localDraft) {
      storage.setDraft(id, { ...localDraft, profileName: newName });
    }
    try {
      const token = storage.getToken();
      if (token) {
        await cvService.saveCVProfile({ _id: id, profileName: newName });
      }
    } catch {
      fetchData();
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, user]);

  const handleDelete = useCallback((id: string) => {
    const prof = profiles.find((p) => p._id === id);
    if (prof) {
      setProfileToDelete({ id, name: prof.profileName });
    }
  }, [profiles]);

  const confirmDeleteProfile = useCallback(async () => {
    if (!profileToDelete) return;
    const { id, name } = profileToDelete;
    const token = storage.getToken();
    if (token) {
      await cvService.deleteCVProfile(id);
    }
    storage.deleteDraft(id);
    storage.clearActiveDraftIdIfMatch(id);
    setProfiles((prev) => prev.filter((p) => p._id !== id));
    showToast(`Profile "${name}" deleted successfully.`, "success");
    setProfileToDelete(null);
  }, [profileToDelete, showToast]);

  const handleDeleteExport = useCallback((id: string) => {
    const exp = exports.find((e) => e._id === id);
    if (exp) {
      setExportToDelete({ id, label: exp.exportLabel });
    }
  }, [exports]);

  const confirmDeleteExport = useCallback(async () => {
    if (!exportToDelete) return;
    const { id, label } = exportToDelete;
    const localExport = storage.getExport<CVExport>(id);
    const token = storage.getToken();
    if (token && (!localExport || localExport.userId !== "local")) {
      await cvService.deleteCVExport(id);
    }
    storage.deleteExport(id);
    setExports((prev) => prev.filter((e) => e._id !== id));
    showToast(`Export "${label}" deleted successfully.`, "success");
    setExportToDelete(null);
  }, [exportToDelete, showToast]);

  const handleDownloadExport = useCallback((id: string) => {
    router.push(`/export/${id}`);
  }, [router]);

  useEffect(() => {
    const target = searchParams.get("scrollTo");
    if (!target) return;

    requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({
        behavior: "smooth",
      });
    });

    router.replace("/dashboard");
  }, [searchParams, router]);

  const handleClosePicker = useCallback(() => setShowPickerModal(false), []);
  const handleOpenPicker = useCallback(() => setShowPickerModal(true), []);
  const handleCreateWithAI = useCallback(() => {
    if (user) {
      router.push("/ai-chat");
    } else {
      router.push("/login");
    }
  }, [user, router]);
  const handleCancelDeleteProfile = useCallback(() => setProfileToDelete(null), []);
  const handleCancelDeleteExport = useCallback(() => setExportToDelete(null), []);

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col font-sans select-none text-slate-700">
      <Navbar user={user} signOut={signOut} isInDashboard={true} />

      {showPickerModal && (
        <ProfilePickerModal onClose={handleClosePicker} />
      )}

      <main className="grow p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8">
        <div id="hero" className="text-left">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight m-0">
            {user
              ? `Welcome back, ${user.username?.split(" ")[0]}!`
              : "Welcome! Your CVs are saved locally on this device."}
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Let&apos;s start building your career assets.
          </p>
        </div>

        <div className="bg-linear-to-r from-[#1349c5] to-[#1e6df9] rounded-2xl shadow-xl shadow-blue-500/5 p-6 md:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-left group">
          <div className="absolute right-0 top-0 w-60 h-60 bg-blue-300 rounded-full filter blur-3xl opacity-10 -translate-y-10 translate-x-10" />
          <div className="space-y-4 max-w-lg relative z-10">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 text-[10px] text-yellow-300 font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>AI Powered</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight m-0">
              Create Your CV with AI
            </h1>
            <p className="text-xs md:text-sm text-blue-100 font-light leading-relaxed">
              Chat or speak your details to our intelligent assistant, and let
              Google Gemini build a highly professional resume for you
              automatically in seconds.
            </p>
          </div>
          <div className="mt-6 md:mt-0 relative z-10 flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-10 h-10 text-white animate-bounce"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
              />
            </svg>
          </div>
        </div>

        <QuickActions
          onCreateWithAI={handleCreateWithAI}
          onCreateManually={handleOpenPicker}
        />
        <div id="my-resumes">
          <MyResumesSection
            profiles={profiles}
            exports={exports}
            loading={statsLoading}
            onDelete={handleDelete}
            onRename={handleRename}
            onDeleteExport={handleDeleteExport}
            onDownloadExport={handleDownloadExport}
            onCreateManually={handleOpenPicker}
          />
        </div>

        <StatsRow
          resumeCount={profiles.length}
          exportCount={exports.length}
          loading={statsLoading}
        />
      </main>

      <ConfirmDialog
        isOpen={!!profileToDelete}
        title="Delete CV Profile"
        message={profileToDelete ? `Delete '${profileToDelete.name}'? This cannot be undone.` : ""}
        onConfirm={confirmDeleteProfile}
        onCancel={handleCancelDeleteProfile}
      />

      <ConfirmDialog
        isOpen={!!exportToDelete}
        title="Delete CV Export"
        message={exportToDelete ? `Delete export '${exportToDelete.label}'? This cannot be undone.` : ""}
        onConfirm={confirmDeleteExport}
        onCancel={handleCancelDeleteExport}
      />
    </div>
  );
};

export default DashboardPage;
