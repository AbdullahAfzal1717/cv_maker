"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Menu, ArrowLeft, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/types/aiChat";
import type { ChatSessionSummary } from "@/services/aiService";
import ChatSidebar from "@/components/AiChat/ChatSidebar";
import ChatMessageList from "@/components/AiChat/ChatMessageList";
import ChatInput from "@/components/AiChat/ChatInput";
import { aiService } from "@/services/aiService";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useToast } from "@/context/ToastContext";

const CV_KEYWORDS = [
  "name",
  "experience",
  "education",
  "skills",
  "company",
  "project",
  "degree",
  "university",
  "job",
  "developer",
  "manager",
  "designer",
  "work",
  "worked",
  "school",
  "resume",
  "cv",
];

function getVaguenessReason(messages: ChatMessage[]): string | null {
  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0)
    return "Add a bit more detail before generating your CV.";
  const rawCombinedText = userMessages.map((m) => m.text).join(" ");
  const combinedText = rawCombinedText.toLowerCase();
  const wordCount = combinedText
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const hasKeyword = CV_KEYWORDS.some((keyword) =>
    combinedText.includes(keyword),
  );
  if (wordCount <= 3 && !hasKeyword) {
    return "Add a bit more detail before generating your CV.";
  }
  const hasIdentity =
    /([A-Z][a-z]+ [A-Z][a-z]+)/.test(rawCombinedText) ||
    /(my name is|i am|i'm)\s+[a-z]+/i.test(rawCombinedText);
  const hasContact =
    /[\w.-]+@[\w.-]+\.\w+/.test(rawCombinedText) ||
    /(?:\+?[\d][\d\s-]{6,})/.test(rawCombinedText);
  if (!hasIdentity || !hasContact) {
    return "Please share your name and either an email or phone number before generating.";
  }
  return null;
}

const INITIAL_ASSISTANT_MESSAGE: ChatMessage = {
  role: "model",
  text: "Hi there! I'm your AI Resume Assistant. Could you tell me a bit about your professional background and what kind of role you're applying for?",
  timestamp: new Date(),
};

const AiChatPage: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUnsavedSession, setIsUnsavedSession] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [sessionToDelete, setSessionToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectRequestId = useRef(0);
  const titleIntervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    return () => {
      if (titleIntervalRef.current) {
        clearInterval(titleIntervalRef.current);
      }
    };
  }, []);

  const initSession = useCallback(() => {
    const activeSession = crypto.randomUUID();
    setSessionId(activeSession);
    setErrorMsg("");
    setMessages([{ ...INITIAL_ASSISTANT_MESSAGE, timestamp: new Date() }]);
    setIsUnsavedSession(true);
  }, []);

  useEffect(() => {
    aiService
      .getSessions()
      .then(setSessions)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (sessionId || errorMsg) return;
    const storedId = sessionStorage.getItem("cvmaker_active_ai_session");
    if (storedId) {
      aiService
        .getSession(storedId)
        .then((session) => {
          setSessionId(session._id);
          setIsUnsavedSession(false);
          setMessages(
            session.messages.map((m) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })),
          );
        })
        .catch(() => {
          sessionStorage.removeItem("cvmaker_active_ai_session");
          initSession();
        });
    } else {
      initSession();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim() || isSending || !sessionId) return;
      const newMessage: ChatMessage = {
        role: "user",
        text: inputValue.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");
      setIsSending(true);
      setErrorMsg("");
      try {
        const reply = await aiService.sendMessage(sessionId, newMessage.text);
        setMessages((prev) => [
          ...prev,
          { ...reply, timestamp: new Date(reply.timestamp) },
        ]);
        if (isUnsavedSession) {
          setIsUnsavedSession(false);
          sessionStorage.setItem("cvmaker_active_ai_session", sessionId);

          if (reply.title) {
            const targetTitle = reply.title;
            const newSessionSummary: ChatSessionSummary = {
              _id: sessionId,
              title: "",
              isPinned: false,
              updatedAt: new Date().toISOString(),
              messages: [
                ...messages,
                newMessage,
                { ...reply, timestamp: new Date(reply.timestamp) },
              ],
            };
            setSessions((prev) => [newSessionSummary, ...prev]);
            let currentTitle = "";
            let charIndex = 0;
            if (titleIntervalRef.current) {
              clearInterval(titleIntervalRef.current);
            }
            titleIntervalRef.current = setInterval(() => {
              if (charIndex < targetTitle.length) {
                currentTitle += targetTitle[charIndex];
                setSessions((prev) =>
                  prev.map((s) =>
                    s._id === sessionId ? { ...s, title: currentTitle } : s,
                  ),
                );
                charIndex++;
              } else {
                clearInterval(titleIntervalRef.current!);
                titleIntervalRef.current = null;
              }
            }, 35);
          } else {
            aiService
              .getSessions()
              .then(setSessions)
              .catch(() => {});
          }
        }
      } catch (error: any) {
        setErrorMsg(error.message || "Failed to send message.");
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsSending(false);
      }
    },
    [inputValue, isSending, sessionId, isUnsavedSession, messages],
  );

  const startNewChat = useCallback(() => {
    if (isUnsavedSession) {
      setIsSidebarOpen(false);
      return;
    }
    selectRequestId.current++;
    sessionStorage.removeItem("cvmaker_active_ai_session");
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    setIsUnsavedSession(true);
    setErrorMsg("");
    setIsLoadingSession(false);
    setMessages([{ ...INITIAL_ASSISTANT_MESSAGE, timestamp: new Date() }]);
    setIsSidebarOpen(false);
  }, [isUnsavedSession]);

  const handleSelectSession = useCallback(
    async (summary: ChatSessionSummary) => {
      if (summary._id === sessionId) {
        setIsSidebarOpen(false);
        return;
      }
      const requestId = ++selectRequestId.current;
      setIsLoadingSession(true);
      setErrorMsg("");
      try {
        const session = await aiService.getSession(summary._id);
        if (requestId !== selectRequestId.current) return;
        sessionStorage.setItem("cvmaker_active_ai_session", session._id);
        setSessionId(session._id);
        setIsUnsavedSession(false);
        setMessages(
          session.messages.map((m) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        );
        setIsSidebarOpen(false);
      } catch (error: any) {
        if (requestId !== selectRequestId.current) return;
        setErrorMsg(error.message || "Failed to load chat.");
      } finally {
        if (requestId === selectRequestId.current) setIsLoadingSession(false);
      }
    },
    [sessionId],
  );

  const handleDeleteSession = useCallback(
    (id: string) => {
      const s = sessions.find((x) => x._id === id);
      if (s) {
        setSessionToDelete({ id, title: s.title });
      }
    },
    [sessions],
  );

  const confirmDeleteSession = useCallback(async () => {
    if (!sessionToDelete) return;
    const { id, title } = sessionToDelete;
    await aiService.deleteSession(id);
    setSessions((prev) => prev.filter((s) => s._id !== id));
    if (sessionId === id) {
      sessionStorage.removeItem("cvmaker_active_ai_session");
      startNewChat();
    }
    showToast(`Session "${title}" deleted successfully.`, "success");
    setSessionToDelete(null);
  }, [sessionToDelete, sessionId, startNewChat, showToast]);

  const handleRenameSession = useCallback(
    async (id: string, title: string) => {
      try {
        await aiService.renameSession(id, title);
        setSessions((prev) =>
          prev.map((s) => (s._id === id ? { ...s, title } : s)),
        );
      } catch {
        // Ignored
      }
    },
    [],
  );

  const handleTogglePin = useCallback(
    async (id: string, isPinned: boolean) => {
      try {
        await aiService.pinSession(id, isPinned);
        setSessions((prev) =>
          prev.map((s) => (s._id === id ? { ...s, isPinned } : s)),
        );
      } catch {
        // Ignored
      }
    },
    [],
  );

  const handleGenerateCV = useCallback(async () => {
    if (!sessionId) return;
    setIsGenerating(true);
    setErrorMsg("");
    try {
      const { resumeData, droppedFields } =
        await aiService.generateCV(sessionId);
      if (droppedFields.length > 0) {
        showToast(
          `Couldn't confidently read your ${droppedFields.join(" and ")} — please double-check ${droppedFields.length > 1 ? "these" : "it"} in the builder.`,
          "error",
        );
      }
      // Store resumeData in sessionStorage for ChooseTemplate to pick up
      const { setTransferData } = await import("@/utils/transferData");
      setTransferData("ai_resumeData", resumeData);
      router.push("/choose-template?fromAI=true&profileName=AI%20Generated%20Resume");
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to generate CV.");
    } finally {
      setIsGenerating(false);
    }
  }, [sessionId, showToast, router]);

  const handleOpenSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleCancelDelete = useCallback(() => setSessionToDelete(null), []);

  const vagueReason = useMemo(() => getVaguenessReason(messages), [messages]);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden relative">
      <ChatSidebar
        sessions={sessions}
        onNewChat={startNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onTogglePin={handleTogglePin}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        activeSessionId={sessionId}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center px-4 md:px-6 shrink-0 relative z-10">
          <button
            onClick={handleOpenSidebar}
            className="p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-700 md:hidden"
            title="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <button
            onClick={() => router.back()}
            className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 mr-4 transition-colors cursor-pointer"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-800 truncate">
              AI Resume Assistant
            </h1>
            <p className="text-xs font-medium text-slate-500 truncate">
              Powered by Google Gemini
            </p>
          </div>
          <button
            disabled={
              !!vagueReason || isGenerating || !sessionId || isLoadingSession
            }
            onClick={handleGenerateCV}
            className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 font-bold text-xs md:text-sm rounded-xl transition-all shrink-0 ml-2 ${
              vagueReason || isGenerating || !sessionId || isLoadingSession
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            }`}
            title={vagueReason || "Generate CV"}
          >
            <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">
              {isGenerating ? "Generating..." : "Generate CV"}
            </span>
          </button>
        </header>
        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-sm p-3 border-b border-red-100 text-center z-10 shrink-0 flex items-center justify-center gap-4">
            <span>{errorMsg}</span>
            {!sessionId && (
              <button
                onClick={initSession}
                className="font-bold underline hover:text-red-800 transition-colors cursor-pointer"
              >
                Retry
              </button>
            )}
          </div>
        )}
        {isLoadingSession ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium">
            Loading chat...
          </div>
        ) : (
          <ChatMessageList
            messages={messages}
            messagesEndRef={messagesEndRef}
            isSending={isSending}
          />
        )}
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={handleSend}
          disabled={isLoadingSession}
        />
      </main>
      <ConfirmDialog
        isOpen={!!sessionToDelete}
        title="Delete Chat Session"
        message={
          sessionToDelete
            ? `Delete '${sessionToDelete.title}'? This cannot be undone.`
            : ""
        }
        onConfirm={confirmDeleteSession}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default AiChatPage;
