"use client";

import { FormEvent, ReactNode, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };
type ChatTurn = [string, string];

const aiApiUrl =
  process.env.NEXT_PUBLIC_AI_API_URL || "https://gmac-group-assistant.onrender.com/api/chat";

function formatInlineText(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} className="rounded bg-slate-900/70 px-1.5 py-0.5 text-cyan-200">{part.slice(1, -1)}</code>;
    }
    return <span key={index}>{part}</span>;
  });
}

function formatAssistantMessage(content: string): ReactNode {
  const normalizedContent = content
    .replace(/\s+(#{1,3}\s+)/g, "\n\n$1")
    .replace(/\s+(\*|-)\s+(?=\*\*)/g, "\n$1 ");

  return (
    <div className="space-y-3">
      {normalizedContent.split(/\r?\n/).map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return <div key={index} className="h-1" />;

        const heading = trimmedLine.match(/^#{1,3}\s+(.+)/);
        if (heading) {
          return <h3 key={index} className="pt-1 text-sm font-bold leading-snug text-white">{formatInlineText(heading[1])}</h3>;
        }

        const bullet = trimmedLine.match(/^(?:\*|-|•)\s+(.+)/);
        if (bullet) {
          return (
            <div key={index} className="flex gap-2 pl-1 leading-relaxed">
              <span className="mt-0.5 text-cyan-300">•</span>
              <span>{formatInlineText(bullet[1])}</span>
            </div>
          );
        }

        return <p key={index} className="leading-relaxed">{formatInlineText(trimmedLine)}</p>;
      })}
    </div>
  );
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Gmac Group connects talent to opportunity through research, human capital, and investment facilitation. What would you like to explore?" },
  ]);
  const [history, setHistory] = useState<ChatTurn[]>([["Hi", ""]]);
  const [suggestions, setSuggestions] = useState<string[]>([
    "What services does Gmac Group offer?",
    "How can an institution work with Gmac Group?",
    "What research services are available?",
  ]);
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetConversation(showWelcome = true) {
    setMessages(
      showWelcome
        ? [{ role: "assistant", content: "Gmac Group connects talent to opportunity through research, human capital, and investment facilitation. What would you like to explore?" }]
        : [],
    );
    setHistory([["Hi", ""]]);
    setSuggestions(showWelcome ? [
      "What services does Gmac Group offer?",
      "How can an institution work with Gmac Group?",
      "What research services are available?",
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
      {isOpen && (
        <section
          aria-label="GMACGROUP AI assistant"
          className="fixed top-20 right-4 z-50 flex h-[min(610px,calc(100dvh-7rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(6,28,48,0.25)] sm:right-24"
        >
          <header className="flex flex-shrink-0 items-center justify-between bg-[#07111f] px-5 py-4 text-white">
            <div>
              <p className="font-semibold">Gmac Group <span className="ml-1 rounded border border-cyan-400/40 px-1 text-[10px] text-cyan-300">AI</span></p>
              <p className="mt-0.5 text-xs text-white/65">Research, Human Capital &amp; Investment <span className="text-emerald-400">• Active</span></p>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => resetConversation(true)} aria-label="Start a new AI conversation" title="New conversation" className="flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan">
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" onClick={() => resetConversation(false)} aria-label="Delete AI conversation" title="Delete conversation" className="flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition hover:bg-red-500/20 hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan">
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close AI assistant" title="Close assistant" className="flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[#0b1422] p-4" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm ${message.role === "user" ? "rounded-br-sm bg-brand-red text-white leading-relaxed" : "rounded-bl-sm border border-slate-600 bg-[#172235] text-slate-200"}`}>
                  {message.role === "assistant" ? formatAssistantMessage(message.content) : message.content}
                </div>
              </div>
            ))}
            {isSending && <p className="text-sm text-slate-400">Thinking...</p>}
            {!isSending && suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={(event) => sendMessage(event as unknown as FormEvent<HTMLFormElement>, suggestion)} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-left text-xs text-cyan-200 transition hover:bg-cyan-400/20">
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex-shrink-0 border-t border-slate-700 bg-[#07111f] p-3">
            <div className="flex gap-2">
              <label htmlFor="ai-widget-prompt" className="sr-only">Ask the Gmac Group assistant</label>
              <input id="ai-widget-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask Gmac Group..." className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-600 bg-[#172235] px-3 text-base text-white outline-none placeholder:text-slate-500 focus:border-cyan-300 sm:text-sm" disabled={isSending} />
              <button type="submit" disabled={isSending || !prompt.trim()} aria-label="Send message" className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-red text-white transition hover:bg-brand-redDark disabled:cursor-not-allowed disabled:opacity-50">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 4 16 8-16 8 3-8-3-8Zm3 8h13" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
          </form>
        </section>
      )}

      {!isOpen && <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI assistant"
        title="AI assistant"
        className="fixed bottom-5 right-5 z-50 flex h-[52px] w-[52px] items-center justify-center gap-0 rounded-full bg-brand-red p-0 text-white shadow-[0_8px_24px_rgba(229,25,36,0.35)] ring-2 ring-white transition hover:-translate-y-1 hover:bg-brand-redDark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 sm:bottom-8 sm:right-24 sm:h-14 sm:w-auto sm:gap-2 sm:px-4"
      >
        {isOpen ? (
          <svg aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="m12 3 1.35 5.65L19 10l-5.65 1.35L12 17l-1.35-5.65L5 10l5.65-1.35L12 3Z" strokeLinejoin="round" />
            <path d="m19 16 .55 2.45L22 19l-2.45.55L19 22l-.55-2.45L16 19l2.45-.55L19 16Z" strokeLinejoin="round" />
          </svg>
        )}
        <span className="hidden text-sm font-bold sm:inline">{isOpen ? "Close" : "AI chat"}</span>
      </button>}
    </>
  );
}