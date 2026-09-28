import { API_URL, getHeaders } from "./api";
import { storage } from "../utils/storage";
import type { ChatMessage } from "../types/aiChat";
import type { ResumeData } from "../types/resume";

export interface ChatSessionSummary {
  _id: string;
  title: string;
  isPinned: boolean;
  updatedAt: string;
  messages: ChatMessage[];
}

const handleResponse = async (response: Response, defaultError: string) => {
  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.message || defaultError);
  }
  return resData;
};

export const aiService = {
  getSessions: async (): Promise<ChatSessionSummary[]> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/ai-chat/sessions`, {
      method: "GET",
      headers: getHeaders(token),
    });
    const data = await handleResponse(response, "Failed to load sessions.");
    return (data.sessions as Record<string, unknown>[]).map((s) => ({
      _id: s._id as string,
      title: (s.title as string) || "New Chat",
      isPinned: (s.isPinned as boolean) || false,
      updatedAt: s.updatedAt as string,
      messages: (s.messages as ChatMessage[]) ?? [],
    }));
  },

  getSession: async (id: string): Promise<ChatSessionSummary> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/ai-chat/session/${id}`, {
      method: "GET",
      headers: getHeaders(token),
    });
    const data = await handleResponse(response, "Failed to load session.");
    const session = data.session as Record<string, unknown>;
    return {
      _id: session._id as string,
      title: (session.title as string) || "New Chat",
      isPinned: (session.isPinned as boolean) || false,
      updatedAt: session.updatedAt as string,
      messages: (session.messages as ChatMessage[]) ?? [],
    };
  },

  sendMessage: async (
    sessionId: string,
    text: string,
  ): Promise<ChatMessage & { title?: string }> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/ai-chat/message`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ sessionId, text }),
    });
    const data = await handleResponse(response, "Failed to send message.");
    return {
      ...data.message,
      title: data.title,
    };
  },

  generateCV: async (
    sessionId: string,
  ): Promise<{ resumeData: ResumeData; droppedFields: string[] }> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/ai-chat/generate`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ sessionId }),
    });
    const data = await handleResponse(response, "Failed to generate CV.");
    return {
      resumeData: data.resumeData,
      droppedFields: data.droppedFields || [],
    };
  },

  deleteSession: async (id: string): Promise<void> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/ai-chat/session/${id}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    await handleResponse(response, "Failed to delete session.");
  },

  renameSession: async (id: string, title: string): Promise<void> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/ai-chat/session/${id}`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify({ title }),
    });
    await handleResponse(response, "Failed to rename session.");
  },

  pinSession: async (id: string, isPinned: boolean): Promise<void> => {
    const token = storage.getToken();
    const response = await fetch(`${API_URL}/ai-chat/session/${id}`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify({ isPinned }),
    });
    await handleResponse(response, "Failed to pin session.");
  },
};
