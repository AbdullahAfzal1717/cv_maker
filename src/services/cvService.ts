import { API_URL, getHeaders } from "./api";
import { storage } from "../utils/storage";
import type { CVProfile, CVExport } from "../types/resume";

const handleResponse = async (response: Response, defaultError: string) => {
  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.message || defaultError);
  }
  return resData.data;
};

export const cvService = {
  getCVProfiles: async (): Promise<CVProfile[]> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/cv/profile`, {
      method: "GET",
      headers: getHeaders(token),
    });
    return handleResponse(response, "Failed to retrieve CV profiles.");
  },

  getCVProfileById: async (id: string): Promise<CVProfile> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/cv/profile/${id}`, {
      method: "GET",
      headers: getHeaders(token),
    });
    return handleResponse(response, `Failed to load CV profile ${id}.`);
  },

  saveCVProfile: async (profile: Partial<CVProfile>): Promise<CVProfile> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/cv/profile/${profile._id}`, {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(profile),
    });
    return handleResponse(response, "Failed to save CV profile.");
  },

  deleteCVProfile: async (id: string): Promise<void> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/cv/profile/${id}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    const resData = await response.json();
    if (!response.ok || !resData.success) {
      throw new Error(resData.message || "Failed to delete CV profile.");
    }
  },

  getCVExports: async (): Promise<CVExport[]> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/cv/exports`, {
      method: "GET",
      headers: getHeaders(token),
    });
    return handleResponse(response, "Failed to retrieve CV exports.");
  },

  getCVExportById: async (id: string): Promise<CVExport> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/cv/exports/${id}`, {
      method: "GET",
      headers: getHeaders(token),
    });
    return handleResponse(response, `Failed to load CV export ${id}.`);
  },

  createCVExport: async (payload: {
    _id?: string;
    profileId: string;
    profileName: string;
    resumeData: CVProfile["resumeData"];
  }): Promise<CVExport> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/cv/exports`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({
        _id: payload._id ?? crypto.randomUUID(),
        profileId: payload.profileId,
        profileName: payload.profileName,
        resumeData: payload.resumeData,
      }),
    });
    return handleResponse(response, "Failed to create CV export.");
  },

  deleteCVExport: async (id: string): Promise<void> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/cv/exports/${id}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    const resData = await response.json();
    if (!response.ok || !resData.success) {
      throw new Error(resData.message || "Failed to delete CV export.");
    }
  },
};
