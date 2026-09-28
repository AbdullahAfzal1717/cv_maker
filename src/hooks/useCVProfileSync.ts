import { useCallback, useEffect, useRef, useState } from "react";
import type { ResumeData, CVDraft, CVStatus, SyncStatus } from "@/types/resume";
import { storage } from "@/utils/storage";
import { cvService } from "@/services/cvService";
import { getCalculatedStatus } from "@/utils/resumeStatus";
import { BLANK_RESUME } from "@/constants/builder";
import { useAuth } from "@/context/AuthContext";

export function useCVProfileSync(
  profileId: string,
  incomingTemplateId: string,
  incomingProfileName: string,
  aiResumeData?: ResumeData,
) {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    if (typeof window === "undefined") {
      return aiResumeData ?? BLANK_RESUME(incomingTemplateId);
    }
    const draft = storage.getDraft<CVDraft>(profileId);
    return draft?.resumeData ?? aiResumeData ?? BLANK_RESUME(incomingTemplateId);
  });
  const [profileName, setProfileName] = useState(() => {
    if (typeof window === "undefined") return incomingProfileName;
    const draft = storage.getDraft<CVDraft>(profileId);
    return draft?.profileName ?? incomingProfileName;
  });
  const [isMainProfile, setIsMainProfile] = useState(() => {
    if (typeof window === "undefined") return false;
    const draft = storage.getDraft<CVDraft>(profileId);
    return draft?.isMainProfile ?? false;
  });
  const [status, setStatus] = useState<CVStatus>(() => {
    if (typeof window === "undefined") {
      return aiResumeData ? getCalculatedStatus(aiResumeData) : "incomplete";
    }
    const draft = storage.getDraft<CVDraft>(profileId);
    return (
      draft?.status ??
      (aiResumeData ? getCalculatedStatus(aiResumeData) : "incomplete")
    );
  });
  const [isSyncedToAccount, setIsSyncedToAccount] = useState(() => {
    if (typeof window === "undefined") return false;
    const draft = storage.getDraft<CVDraft>(profileId);
    return !!storage.getToken() || (draft?.isSyncedToAccount ?? false);
  });
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("saved-local");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const isInitialLoadRef = useRef(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || isSyncedToAccount) return;
    setIsSyncedToAccount(true);
  }, [user, isSyncedToAccount]);

  const finishInitialLoad = useCallback(() => {
    isInitialLoadRef.current = false;
    setLoadingProfile(false);
  }, []);

  const loadProfile = useCallback(
    async (id: string, keepTemplate = false) => {
      setLoadingProfile(true);
      isInitialLoadRef.current = true;
      const localDraft = storage.getDraft<CVDraft>(id);

      if (localDraft) {
        const data = keepTemplate
          ? { ...localDraft.resumeData, templateId: incomingTemplateId }
          : localDraft.resumeData;
        setResumeData(data);
        setProfileName(localDraft.profileName || incomingProfileName);
        setIsMainProfile(localDraft.isMainProfile || false);
        setStatus(localDraft.status || "incomplete");
        setIsSyncedToAccount(!!storage.getToken() || (localDraft.isSyncedToAccount ?? false));
      }

      if (storage.getToken()) {
        try {
          const remote = await cvService.getCVProfileById(id);
          if (remote) {
            const data = keepTemplate
              ? { ...remote.resumeData, templateId: incomingTemplateId }
              : remote.resumeData;
            setResumeData(data);
            setProfileName(remote.profileName);
            setIsMainProfile(remote.isMainProfile || false);
            setStatus(remote.status || "incomplete");
            setIsSyncedToAccount(true);
            storage.deleteDraft(id);
            setSyncStatus("synced");
          }
        } catch {
          setSyncStatus(localDraft ? "saved-local" : "error");
        }
      }

      finishInitialLoad();
      setLoadingProfile(false);
    },
    [incomingTemplateId, incomingProfileName, finishInitialLoad],
  );

  const persistLocal = useCallback(
    (data: ResumeData, name: string, main: boolean, st: CVStatus) => {
      if (storage.getToken() && isSyncedToAccount) return;

      storage.setDraft(profileId, {
        resumeData: data,
        profileName: name,
        isMainProfile: main,
        status: st,
        isSyncedToAccount: false,
        lastSaved: new Date().toISOString(),
      });
      setSyncStatus((prev) =>
        prev === "synced" || prev === "saving" ? prev : "saved-local",
      );
    },
    [profileId, isSyncedToAccount],
  );

  const syncRemote = useCallback(
    async (data: ResumeData, name: string, main: boolean, st: CVStatus) => {
      if (!storage.getToken() || !isSyncedToAccount) return;
      setSyncStatus("saving");
      try {
        await cvService.saveCVProfile({
          _id: profileId,
          profileName: name,
          isMainProfile: main,
          status: st,
          resumeData: data,
        });
        storage.deleteDraft(profileId);
        setSyncStatus("synced");
      } catch {
        setSyncStatus("error");
      }
    },
    [profileId, isSyncedToAccount],
  );

  const instantSync = useCallback(
    async (data = resumeData) => {
      const newStatus = getCalculatedStatus(data);
      if (newStatus !== status) setStatus(newStatus);
      persistLocal(data, profileName, isMainProfile, newStatus);
      await syncRemote(data, profileName, isMainProfile, newStatus);
    },
    [resumeData, status, profileName, isMainProfile, persistLocal, syncRemote],
  );

  return {
    resumeData,
    setResumeData,
    profileName,
    setProfileName,
    isMainProfile,
    setIsMainProfile,
    status,
    setStatus,
    isSyncedToAccount,
    setIsSyncedToAccount,
    syncStatus,
    loadingProfile,
    isInitialLoadRef,
    finishInitialLoad,
    loadProfile,
    persistLocal,
    syncRemote,
    instantSync,
  };
}
