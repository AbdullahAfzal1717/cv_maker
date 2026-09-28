"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { storage } from "../utils/storage";
import { cvService } from "../services/cvService";
import type { CVDraft, CVExport } from "../types/resume";

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (
    username: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  signOut: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const signOut = (): void => {
    setUser(null);
    storage.clearAuth();
    storage.clearActiveDraftId();
  };

  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      const token = storage.getToken();
      const savedUser = storage.getUser<User>();

      if (!token || !savedUser) {
        signOut();
        setLoading(false);
        return;
      }

      setUser(savedUser);

      try {
        const data = await authService.getCurrentUser(token);
        setUser(data.user);
        storage.setUser(data.user);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        if (savedUser) {
          setUser(savedUser);
        } else {
          signOut();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await authService.login(email, password);
      storage.setToken(data.token);
      storage.setUser(data.user);
      setUser(data.user);

      const draftIds = storage.listDraftIds();
      await Promise.all(
        draftIds.map(async (id) => {
          const draft = storage.getDraft<CVDraft>(id);
          if (!draft) return;
          if (draft.isSyncedToAccount === true) {
            storage.deleteDraft(id);
            return;
          }
          try {
            await cvService.saveCVProfile({
              _id: id,
              profileName: draft.profileName,
              isMainProfile: draft.isMainProfile ?? false,
              status: draft.status ?? "incomplete",
              resumeData: draft.resumeData,
            });
            storage.deleteDraft(id);
            storage.clearActiveDraftIdIfMatch(id);
          } catch {
            // Keep local copy if sync fails
          }
        }),
      );

      const exportIds = storage.listExportIds();
      await Promise.all(
        exportIds.map(async (id) => {
          const localExport = storage.getExport<CVExport>(id);
          if (!localExport || localExport.userId !== "local") return;
          try {
            await cvService.createCVExport({
              _id: id,
              profileId: localExport.profileId,
              profileName: localExport.profileNameSnapshot,
              resumeData: localExport.resumeData,
            });
            storage.deleteExport(id);
          } catch {
            // Keep local export if sync fails.
          }
        }),
      );

      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Network communication breakdown.";
      throw new Error(message, { cause: error });
    }
  };

  const signUp = async (
    username: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      await authService.register(username, email, password);
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registration pipeline error.";
      throw new Error(message, { cause: error });
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      storage.setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
