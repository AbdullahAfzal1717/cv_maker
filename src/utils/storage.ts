const TOKEN_KEY = "cv_token";
const USER_KEY = "cv_user";
const DRAFT_PREFIX = "cv_draft_";
const EXPORT_PREFIX = "cv_export_";

export const storage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),

  getUser: <T>(): T | null => {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  },

  setUser: (user: unknown): void =>
    localStorage.setItem(USER_KEY, JSON.stringify(user)),

  clearAuth: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getDraft: <T>(id: string): T | null => {
    const data = localStorage.getItem(`${DRAFT_PREFIX}${id}`);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  },

  setDraft: (id: string, data: unknown): void => {
    localStorage.setItem(`${DRAFT_PREFIX}${id}`, JSON.stringify(data));
  },

  deleteDraft: (id: string): void => {
    localStorage.removeItem(`${DRAFT_PREFIX}${id}`);
  },

  getActiveDraftId: (): string | null =>
    localStorage.getItem("cv_active_profile_id"),

  setActiveDraftId: (id: string): void =>
    localStorage.setItem("cv_active_profile_id", id),

  clearActiveDraftId: (): void =>
    localStorage.removeItem("cv_active_profile_id"),

  clearActiveDraftIdIfMatch: (id: string): void => {
    if (storage.getActiveDraftId() === id) {
      storage.clearActiveDraftId();
    }
  },

  listDraftIds: (): string[] => {
    const ids: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(DRAFT_PREFIX)) {
        ids.push(key.replace(DRAFT_PREFIX, ""));
      }
    }
    return ids;
  },

  getExport: <T>(id: string): T | null => {
    const data = localStorage.getItem(`${EXPORT_PREFIX}${id}`);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  },

  setExport: (id: string, data: unknown): void => {
    localStorage.setItem(`${EXPORT_PREFIX}${id}`, JSON.stringify(data));
  },

  deleteExport: (id: string): void => {
    localStorage.removeItem(`${EXPORT_PREFIX}${id}`);
  },

  listExportIds: (): string[] => {
    const ids: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(EXPORT_PREFIX)) {
        ids.push(key.replace(EXPORT_PREFIX, ""));
      }
    }
    return ids;
  },
};
