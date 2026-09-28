"use client";

import React, { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "../../types/aiChat";
import { Copy, Check } from "lucide-react";

interface ChatMessageListProps {
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isSending?: boolean;
}

const MessageRow: React.FC<{ msg: ChatMessage; isUser: boolean }> = ({
  msg,
  isUser,
}) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.text);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} group relative`}
    >
      <div
        className={`relative flex items-center ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] ${
            isUser
              ? "bg-blue-600 text-white rounded-br-sm shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm"
          }`}
        >
          {msg.text}
          <div
            className={`text-[10px] mt-2 font-medium ${
              isUser ? "text-blue-100 text-right" : "text-slate-400 text-left"
            }`}
          >
            {msg.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all ${isUser ? "mr-2" : "ml-2"}`}
          title="Copy message"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  messagesEndRef,
  isSending,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => {
          const isUser = msg.role === "user";
          return <MessageRow key={`${msg.role}-${msg.timestamp.getTime()}`} msg={msg} isUser={isUser} />;
        })}
      {isSending && (
        <div className="flex w-full justify-start">
          <div className="max-w-[85%] md:max-w-[75%] bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-sm shadow-sm px-5 py-4 flex items-center gap-1.5 h-12">
            <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef as React.RefObject<HTMLDivElement>} />
    </div>
  );
};

export default ChatMessageList;
