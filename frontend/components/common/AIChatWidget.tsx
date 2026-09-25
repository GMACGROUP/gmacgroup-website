"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };
type ChatTurn = [string, string];

const aiApiUrl =
  process.env.NEXT_PUBLIC_AI_API_URL || "https://gmac-group-assistant.onrender.com/api/chat";

function formatInlineText(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} className="rounded bg-slate-950/80 px-1.5 py-0.5 text-xs font-mono text-cyan-300">{part.slice(1, -1)}</code>;
    }
    return <span key={index}>{part}</span>;
  });
}

function formatAssistantMessage(content: string): ReactNode {
  const normalizedContent = content
    .replace(/\s+(#{1,3}\s+)/g, "\n\n$1")
    .replace(/\s+(\*|-)\s+(?=\*\*)/g, "\n$1 ");

  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-100">
      {normalizedContent.split(/\r?\n/).map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return <div key={index} className="h-1" />;

        const heading = trimmedLine.match(/^#{1,3}\s+(.+)/);
        if (heading) {
          return <h4 key={index} className="pt-1 text-sm font-bold leading-snug text-white font-serif">{formatInlineText(heading[1])}</h4>;
        }

        const bullet = trimmedLine.match(/^(?:\*|-|•)\s+(.+)/);
        if (bullet) {
          return (
            <div key={index} className="flex gap-2 pl-1 leading-relaxed">
              <span className="mt-0.5 text-cyan-400 font-bold">•</span>
              <span>{formatInlineText(bullet[1])}</span>
            </div>
          );
        }

        return <p key={index}>{formatInlineText(trimmedLine)}</p>;
      })}
    </div>
  );
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am GMAC Group's assistant. How can I help you explore our research, human capital programmes, or investment advisory services?" },
  ]);
  const [history, setHistory] = useState<ChatTurn[]>([["Hi", ""]]);
  const [suggestions, setSuggestions] = useState<string[]>([
    "What services does Gmac Group offer?",
    "How can institutions partner with Gmac Group?",
    "What research capabilities are available?",
  ]);
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, messages]);

  // Handle escape key to close modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function resetConversation(showWelcome = true) {
    setMessages(
      showWelcome
        ? [{ role: "assistant", content: "Hello! I am GMAC Group's assistant. How can I help you explore our research, human capital programmes, or investment advisory services?" }]
        : [],
    );
    setHistory([["Hi", ""]]);
    setSuggestions(showWelcome ? [
      "What services does Gmac Group offer?",
      "How can institutions partner with Gmac Group?",
      "What research capabilities are available?",
    ] : []);
    setPrompt("");
    setError(null);
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>, suggestedPrompt?: string) {
    event.preventDefault();
    const message = (suggestedPrompt || prompt).trim();
    if (!message || isSending) return;

    setMessages((current) => [...current, { role: "user", content: message }]);
    setPrompt("");
    setSuggestions([]);
    setError(null);
    setIsSending(true);

    try {
      const response = await fetch(aiApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      if (!response.ok) throw new Error("The assistant is temporarily unavailable.");

      const data = (await response.json()) as { reply?: string; suggestions?: string[] };
      const reply = data.reply || "I could not find an answer for that yet.";
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
      setHistory((current) => [...current, [message, reply]]);
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The assistant is temporarily unavailable.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      {/* Mobile Backdrop for Full Sheet */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs sm:hidden animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Main AI Chat Modal */}
      {isOpen && (
        <section
          aria-label="GMACGROUP AI assistant"
          className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-6 sm:right-8 z-50 flex h-[88dvh] max-h-[88dvh] sm:h-[min(620px,calc(100dvh-6rem))] sm:w-[min(420px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border border-slate-700/80 bg-[#07111F] text-white shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl animate-modalPanelIn"
        >
          {/* Header */}
          <header className="flex flex-shrink-0 items-center justify-between border-b border-slate-800 bg-[#060E1A] px-5 py-3.5 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-red to-amber-600 text-white shadow-sm border border-white/20">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m12 3 1.35 5.65L19 10l-5.65 1.35L12 17l-1.35-5.65L5 10l5.65-1.35L12 3Z" strokeLinejoin="round" />
                  <path d="m19 16 .55 2.45L22 19l-2.45.55L19 22l-.55-2.45L16 19l2.45-.55L19 16Z" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  GMAC Group <span className="rounded-md border border-cyan-400/40 bg-cyan-400/10 px-1.5 py-0.2 text-[10px] font-extrabold text-cyan-300">AI</span>
                </p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Research &amp; Human Capital
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => resetConversation(true)}
                aria-label="Start a new AI conversation"
                title="New conversation"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => resetConversation(false)}
                aria-label="Delete AI conversation"
                title="Clear conversation"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-500/20 hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI assistant"
                title="Close assistant"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </header>

          {/* Messages Body */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[#0B1523] p-4 sm:p-5" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    message.role === "user"
                      ? "rounded-br-xs bg-brand-red text-white"
                      : "rounded-bl-xs border border-slate-700/80 bg-[#122033] text-slate-100 shadow-md"
                  }`}
                >
                  {message.role === "assistant" ? formatAssistantMessage(message.content) : message.content}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-xs border border-slate-700/80 bg-[#122033] px-4 py-3 text-xs text-cyan-300">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  Thinking...
                </div>
              </div>
            )}

            {!isSending && suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={(event) => sendMessage(event as unknown as FormEvent<HTMLFormElement>, suggestion)}
                    className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-left text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/20 active:scale-98"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Footer */}
          <form onSubmit={sendMessage} className="flex-shrink-0 border-t border-slate-800 bg-[#060E1A] p-3 sm:p-4">
            <div className="flex gap-2 items-center">
              <label htmlFor="ai-widget-prompt" className="sr-only">Ask the Gmac Group assistant</label>
              <input
                ref={inputRef}
                id="ai-widget-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Ask about research, programmes, advisory..."
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-700 bg-[#122033] px-3.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 transition-colors"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !prompt.trim()}
                aria-label="Send message"
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-red text-white shadow-sm transition hover:bg-brand-redDark disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
              >
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m4 4 16 8-16 8 3-8-3-8Zm3 8h13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          </form>
        </section>
      )}

      {/* Floating Trigger Button Dock */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI assistant"
          title="Open GMAC Group AI"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-8 z-40 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-red to-[#B82218] text-white shadow-[0_8px_25px_rgba(154,55,34,0.4)] border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(154,55,34,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 h-12 w-12 sm:h-12 sm:w-auto sm:px-4.5"
        >
          <svg aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="m12 3 1.35 5.65L19 10l-5.65 1.35L12 17l-1.35-5.65L5 10l5.65-1.35L12 3Z" strokeLinejoin="round" />
            <path d="m19 16 .55 2.45L22 19l-2.45.55L19 22l-.55-2.45L16 19l2.45-.55L19 16Z" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline text-xs sm:text-sm font-bold tracking-wide">
            AI Assistant
          </span>
          <span className="hidden sm:inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </button>
      )}
    </>
  );
}