"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Search,
  PanelLeft,
  MoreVertical,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import type { ChatSessionSummary } from "../../services/aiService";

interface ChatSidebarProps {
  sessions: ChatSessionSummary[];
  onNewChat: () => void;
  onSelectSession: (session: ChatSessionSummary) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, title: string) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
  activeSessionId?: string | null;
}

const SessionMenu: React.FC<{
  anchorRect: DOMRect;
  isPinned: boolean;
  onClose: () => void;
  onPinToggle: () => void;
  onRename: () => void;
  onDelete: () => void;
}> = ({ anchorRect, isPinned, onClose, onPinToggle, onRename, onDelete }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const MENU_HEIGHT = 120;

  const spaceBelow = window.innerHeight - anchorRect.bottom;

  const top =
    spaceBelow < MENU_HEIGHT
      ? anchorRect.top - MENU_HEIGHT - 4
      : anchorRect.bottom + 4;

  const left = Math.min(anchorRect.left, window.innerWidth - 176);

  return createPortal(
    <div
      ref={menuRef}
      style={{ position: "fixed", top, left, width: 168 }}
      className="z-100 bg-white border border-slate-200 rounded-xl shadow-lg py-1 overflow-hidden"
    >
      <button
        onClick={() => {
          onPinToggle();
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
      >
        {isPinned ? (
          <PinOff className="w-4 h-4" />
        ) : (
          <Pin className="w-4 h-4" />
        )}
        {isPinned ? "Unpin" : "Pin"}
      </button>
      <button
        onClick={() => {
          onRename();
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
      >
        <Pencil className="w-4 h-4" />
        Rename
      </button>
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>,
    document.body,
  );
};

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onTogglePin,
  isOpen,
  onClose,
  activeSessionId = null,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const [menuAnchorRect, setMenuAnchorRect] = useState<DOMRect | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const getLabel = (session: ChatSessionSummary) => session.title;

  const togglePin = (session: ChatSessionSummary) => {
    onTogglePin(session._id, !session.isPinned);
  };

  const startRename = (session: ChatSessionSummary) => {
    setRenamingId(session._id);
    setRenameValue(getLabel(session));
  };

  const commitRename = (id: string) => {
    const trimmed = renameValue.trim();
    if (trimmed) {
      onRenameSession(id, trimmed);
    }
    setRenamingId(null);
  };

  const deleteSession = (id: string) => {
    onDeleteSession(id);
  };

  const visibleSessions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return sessions.filter((s) =>
      q ? getLabel(s).toLowerCase().includes(q) : true,
    );
  }, [sessions, searchTerm]);

  const pinnedSessions = visibleSessions.filter((s) => s.isPinned);
  const recentSessions = visibleSessions.filter((s) => !s.isPinned);

  const handleToggle = () => {
    setCollapsed((c) => !c);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && collapsed) {
        setCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

  const renderRow = (session: ChatSessionSummary) => {
    const isActive = session._id === activeSessionId;
    const isRenaming = renamingId === session._id;
    const isPinned = session.isPinned;

    return (
      <div
        key={session._id}
        className={`group relative w-full rounded-xl transition-colors ${
          isActive ? "bg-blue-50" : "hover:bg-slate-50"
        }`}
      >
        {isRenaming ? (
          <div className="flex items-center gap-1 px-2.5 py-2">
            <input
              ref={renameInputRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename(session._id);
                if (e.key === "Escape") setRenamingId(null);
              }}
              className="flex-1 min-w-0 text-sm font-medium text-slate-700 bg-white border border-blue-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-100"
            />
            <button
              onClick={() => commitRename(session._id)}
              className="p-1 text-blue-600 hover:text-blue-700 cursor-pointer"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRenamingId(null)}
              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              onSelectSession(session);
              onClose();
            }}
            className="w-full text-left pl-3 pr-8 py-2.5 cursor-pointer"
          >
            <span
              className={`block text-sm font-medium truncate ${
                isActive ? "text-blue-700" : "text-slate-700"
              }`}
            >
              {getLabel(session)}
            </span>
          </button>
        )}

        {!isRenaming && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const rect = (
                e.currentTarget as HTMLElement
              ).getBoundingClientRect();
              setMenuAnchorRect(rect);
              setOpenMenuFor(session._id);
            }}
            className={`absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer transition-opacity ${
              openMenuFor === session._id
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
            title="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}

        {openMenuFor === session._id && menuAnchorRect && (
          <SessionMenu
            anchorRect={menuAnchorRect}
            isPinned={isPinned}
            onClose={() => setOpenMenuFor(null)}
            onPinToggle={() => togglePin(session)}
            onRename={() => startRename(session)}
            onDelete={() => deleteSession(session._id)}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        ${collapsed ? "md:w-17" : "md:w-64"} w-64`}
      >
        {collapsed ? (
          <div className="h-14 flex items-center justify-center shrink-0 border-b border-slate-100">
            <button
              onClick={handleToggle}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              title="Expand sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="h-14 flex items-center justify-between gap-2 px-3 shrink-0 border-b border-slate-100">
            <span className="text-base font-extrabold text-slate-800 truncate">
              CVMaker<span className="text-blue-600">AI</span>
            </span>

            <button
              onClick={handleToggle}
              className="hidden md:flex p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer shrink-0"
              title="Collapse sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="flex md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer shrink-0"
              title="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="p-3 space-y-2 shrink-0">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className={`w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm cursor-pointer ${
              collapsed ? "justify-center p-2.5" : "justify-center py-2.5"
            }`}
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
            {!collapsed && "New Chat"}
          </button>

          {collapsed ? (
            <button
              className="w-full flex items-center justify-center p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
              title="Search chats"
              onClick={() => setCollapsed(false)}
            >
              <Search className="w-4 h-4" />
            </button>
          ) : (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chats"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-slate-700 placeholder:text-slate-400"
              />
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 px-3 pb-3 space-y-4">
            {pinnedSessions.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">
                  Pinned
                </p>
                <div className="space-y-0.5">
                  {pinnedSessions.map(renderRow)}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">
                Recents
              </p>
              {recentSessions.length === 0 ? (
                <p className="text-xs text-slate-400 px-2 py-2">
                  No chats found.
                </p>
              ) : (
                <div className="space-y-0.5">
                  {recentSessions.map(renderRow)}
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default ChatSidebar;
