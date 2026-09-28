"use client";

import React, { useEffect, useRef } from "react";
import { Send, Mic } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  onSend: (e: React.FormEvent) => void;
  disabled?: boolean;
}

const LISTEN_TIMEOUT_MS = 10 * 60 * 1000;

const ChatInput: React.FC<ChatInputProps> = ({ inputValue, setInputValue, onSend, disabled }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const originalTextRef = useRef("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [notSupported, setNotSupported] = React.useState(false);

  useEffect(() => {
    if (listening) {
      setInputValue(originalTextRef.current + transcript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      SpeechRecognition.stopListening();
    };
  }, []);

  const toggleMic = () => {
    if (disabled) return;

    if (!browserSupportsSpeechRecognition) {
      setNotSupported(true);
      setTimeout(() => setNotSupported(false), 3000);
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      originalTextRef.current = inputValue + (inputValue && !inputValue.endsWith(" ") ? " " : "");
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      timeoutRef.current = setTimeout(() => {
        SpeechRecognition.stopListening();
      }, LISTEN_TIMEOUT_MS);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-slate-200">
      {notSupported && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg z-20 transition-opacity">
          Voice input isn&apos;t supported in this browser
        </div>
      )}
      <form
        onSubmit={onSend}
        className="max-w-4xl mx-auto relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all"
      >
        <button
          type="button"
          onClick={toggleMic}
          disabled={disabled}
          className={`p-3 rounded-xl transition-all shrink-0 ${
            listening
              ? "bg-red-50 text-red-500 ring-2 ring-red-200 animate-pulse"
              : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          title={listening ? "Stop listening" : "Voice Input"}
        >
          <Mic className="w-5 h-5" />
        </button>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend(e);
            }
          }}
          disabled={disabled}
          placeholder={disabled ? "Loading chat..." : "Message your AI Assistant..."}
          className={`w-full max-h-32 bg-transparent text-slate-700 placeholder-slate-400 text-[15px] resize-none outline-none py-3 ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
          rows={1}
        />
        <button
          type="submit"
          disabled={disabled || !inputValue.trim()}
          className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl transition-colors shrink-0 flex items-center justify-center cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      <div className="text-center mt-2">
        <span className="text-[11px] font-medium text-slate-400">
          AI can make mistakes. Please verify important information.
        </span>
      </div>
    </div>
  );
};

export default ChatInput;
