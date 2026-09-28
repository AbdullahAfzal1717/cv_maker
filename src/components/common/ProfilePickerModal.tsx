"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  User,
  FilePlus,
  ChevronRight,
  Star,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { cvService } from "../../services/cvService";
import type { CVProfile, CVDraft } from "../../types/resume";
import { storage } from "../../utils/storage";
import Image from "next/image";

interface ProfilePickerModalProps {
  onClose: () => void;
}

const ProfilePickerModal: React.FC<ProfilePickerModalProps> = ({ onClose }) => {
  const router = useRouter();
  const [profiles, setProfiles] = useState<CVProfile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [step, setStep] = useState<"list" | "name">("list");
  const [profileName, setProfileName] = useState("My Resume");

  useEffect(() => {
    const localProfiles: CVProfile[] = storage
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

    if (!storage.getToken()) {
      const sorted = [...localProfiles].sort((a, b) => {
        if (a.isMainProfile && !b.isMainProfile) return -1;
        if (!a.isMainProfile && b.isMainProfile) return 1;
        return 0;
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time modal initialization
      setProfiles(sorted);
      const main = sorted.find((p) => p.isMainProfile);
      setSelectedId(main?._id ?? sorted[0]?._id ?? null);
      setLoading(false);
      return;
    }

    cvService
      .getCVProfiles()
      .then((data) => {
        const merged = [
          ...data,
          ...localProfiles.filter(
            (lp) => !data.some((rp) => rp._id === lp._id),
          ),
        ];
        const sorted = [...merged].sort((a, b) => {
          if (a.isMainProfile && !b.isMainProfile) return -1;
          if (!a.isMainProfile && b.isMainProfile) return 1;
          return 0;
        });
        setProfiles(sorted);
        const main = sorted.find((p) => p.isMainProfile);
        setSelectedId(main?._id ?? sorted[0]?._id ?? null);
      })
      .catch(() => {
        setProfiles(localProfiles);
        setError("Could not load cloud profiles. Showing local drafts only.");
      })
      .finally(() => setLoading(false));
  }, []);

  const openExistingProfile = (profile: CVProfile) => {
    onClose();
    const params = new URLSearchParams({
      profileId: profile._id,
      templateId: profile.resumeData?.templateId ?? "classic-clean",
    });
    router.push(`/builder?${params.toString()}`);
  };

  const startNew = () => {
    onClose();
    const params = new URLSearchParams({ profileName });
    router.push(`/choose-template?${params.toString()}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-left">
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {step === "name" && (
              <button
                onClick={() => setStep("list")}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                {step === "list"
                  ? "Create Resume Manually"
                  : "Name Your Resume"}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {step === "list"
                  ? "Continue an existing profile or start fresh."
                  : "Give this resume a label before picking a template."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === "list" ? (
          <>
            {/* ── Start Fresh CTA ── */}
            <div className="px-6 pt-5">
              <button
                onClick={() => setStep("name")}
                className="w-full group flex items-center justify-between gap-4 p-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <FilePlus className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-blue-700">
                      Start a New Resume
                    </p>
                    <p className="text-[11px] text-blue-500 font-medium mt-0.5">
                      Choose a template and fill from scratch
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            </div>

            {/* ── Existing Profiles ── */}
            <div className="px-6 pt-4 pb-6 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-6 text-slate-400 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs font-medium">Loading profiles…</span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-xs text-red-500 font-medium py-4 justify-center">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              ) : profiles.length === 0 ? (
                <p className="text-[11px] text-slate-400 font-medium text-center py-3">
                  No saved profiles yet — start fresh above!
                </p>
              ) : (
                <>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Continue Existing ({profiles.length})
                  </span>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {profiles.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => setSelectedId(p._id)}
                        className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all text-left cursor-pointer ${
                          selectedId === p._id
                            ? "border-blue-500 bg-blue-50/40"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                            {p.resumeData?.personalInfo?.profilePhoto ? (
                              <Image
                                src={p.resumeData.personalInfo.profilePhoto}
                                alt={p.profileName}
                                width={32}
                                height={32}
                                unoptimized
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
                              {p.profileName}
                              {p.isMainProfile && (
                                <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded uppercase">
                                  <Star className="w-2 h-2 fill-amber-500 text-amber-500" />{" "}
                                  Main
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">
                              {p.resumeData?.personalInfo?.fullName ||
                                "No Name"}
                              {p.resumeData?.personalInfo?.jobTitle
                                ? ` · ${p.resumeData.personalInfo.jobTitle}`
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${selectedId === p._id ? "border-blue-500 bg-blue-500 text-white" : "border-slate-300"}`}
                        >
                          {selectedId === p._id && (
                            <span className="text-[9px] font-bold">✓</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={!selectedId}
                    onClick={() => {
                      const p = profiles.find((x) => x._id === selectedId);
                      if (p) openExistingProfile(p);
                    }}
                    className="w-full mt-1 py-2.5 px-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Open Selected Profile{" "}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          /* ── Name Step ── */
          <div className="px-6 py-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Resume Label / Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && profileName.trim() && startNew()
                }
                placeholder="e.g. Software Engineer Resume"
                className="w-full px-4 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl text-sm font-semibold outline-none transition-colors bg-slate-50/50 focus:bg-white"
                autoFocus
              />
              <p className="text-[10px] text-slate-400 font-medium mt-1.5">
                You can always rename it later in the builder.
              </p>
            </div>
            <button
              disabled={!profileName.trim()}
              onClick={startNew}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Choose a Template <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePickerModal;
