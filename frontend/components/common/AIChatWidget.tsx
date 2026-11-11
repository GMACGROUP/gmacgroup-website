"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };
type ChatTurn = [string, string];

const aiApiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "https://gmac-group-assistant.onrender.com/api/chat";

const WELCOME =
  "Hello. I can answer questions about Gmac Group: our research and advisory work, programmes, events and how institutions engage with us.";
const STARTERS = [
  "What does Gmac Group do?",
  "How do institutions work with you?",
  "What events are coming up?",
];

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part.replace(/`/g, "")}</span>
    ),
  );
}

function Formatted({ content }: { content: string }) {
  const lines = content.replace(/\s+(#{1,3}\s+)/g, "\n\n$1").split(/\r?\n/);
  return (
    <div className="space-y-2">
      {lines.map((raw, i) => {
        const line = raw.trim();
        if (!line) return null;
        const heading = line.match(/^#{1,3}\s+(.+)/);
        if (heading) return <p key={i} className="pt-1 font-display text-[16px] font-semibold text-ink">{inline(heading[1])}</p>;
        const bullet = line.match(/^(?:\*|-|•)\s+(.+)/);
        if (bullet)
          return (
            <p key={i} className="grid grid-cols-[0.9rem_1fr] text-[14px]">
              <span aria-hidden="true" className="text-accent">·</span>
              <span>{inline(bullet[1])}</span>
            </p>
          );
        return <p key={i} className="text-[14px] leading-relaxed">{inline(line)}</p>;
      })}
    </div>
  );
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: WELCOME }]);
  const [history, setHistory] = useState<ChatTurn[]>([["Hi", ""]]);
  const [suggestions, setSuggestions] = useState<string[]>(STARTERS);
  const [prompt, setPrompt] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      inputRef.current?.focus();
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [open, messages]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function reset() {
    setMessages([{ role: "assistant", content: WELCOME }]);
    setHistory([["Hi", ""]]);
    setSuggestions(STARTERS);
    setPrompt("");
    setError(null);
  }

  async function send(event: FormEvent | null, preset?: string) {
    event?.preventDefault();
    const message = (preset || prompt).trim();
    if (!message || sending) return;
    setMessages((m) => [...m, { role: "user", content: message }]);
    setPrompt("");
    setSuggestions([]);
    setError(null);
    setSending(true);
    try {
      const res = await fetch(aiApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { reply?: string; suggestions?: string[] };
      const reply = data.reply || "I don't have an answer for that yet. Our team can help through the contact page.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      setHistory((h) => [...h, [message, reply]]);
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions.slice(0, 3) : []);
    } catch {
      setError("The assistant is not available right now. You can still reach us through the contact page.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="ask-title"
          className="fixed inset-x-3 bottom-3 z-50 flex max-h-[86dvh] flex-col overflow-hidden rounded-2xl border border-rule/90 bg-paper shadow-2xl transition-all sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[min(620px,calc(100dvh-7rem))] sm:w-[410px] modal-panel-in"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-rule/80 bg-white px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white shadow-xs">
                G
              </span>
              <div>
                <h2 id="ask-title" className="font-display text-[17px] font-semibold text-ink leading-tight">
                  Ask Gmac Group
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                  <p className="text-[11.5px] text-ink-500">Advisory & Programmes AI</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                title="Restart chat"
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-ink-500 transition-colors hover:bg-stone hover:text-ink"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Restart
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-stone hover:text-ink"
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
          </header>

          {/* Conversation history */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 text-[14.5px] leading-relaxed text-ink-700 bg-stone/20" aria-live="polite">
            {messages.map((m, i) =>
              m.role === "assistant" ? (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    G
                  </span>
                  <div className="flex-1 rounded-2xl rounded-tl-xs border border-rule/80 bg-white p-3.5 shadow-card text-ink-700">
                    <Formatted content={m.content} />
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-tr-xs bg-ink px-4 py-2.5 text-[14px] text-white shadow-xs">
                    {m.content}
                  </p>
                </div>
              ),
            )}

            {sending && (
              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                  G
                </span>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs border border-rule/80 bg-white px-4 py-3 shadow-xs">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
                {error}
              </div>
            )}

            {suggestions.length > 0 && !sending && (
              <div className="flex flex-wrap gap-2 pt-2 pl-8">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(null, s)}
                    className="rounded-full border border-rule/90 bg-white px-3.5 py-1.5 text-left text-[12.5px] font-medium text-ink-700 shadow-xs transition-all hover:border-accent hover:bg-accent-light/40 hover:text-accent active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Typing bar container */}
          <div className="border-t border-rule/80 bg-white p-3 sm:p-3.5">
            <form
              onSubmit={send}
              className="flex items-center gap-2 rounded-xl border border-rule bg-stone/40 px-3 py-1.5 transition-all focus-within:border-accent focus-within:bg-white focus-within:ring-2 focus-within:ring-accent/20"
            >
              <label htmlFor="ask-input" className="sr-only">Type a question</label>
              <input
                id="ask-input"
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={1000}
                placeholder="Ask about our research, programmes..."
                className="min-w-0 flex-1 border-0 bg-transparent py-2 text-[14px] text-ink placeholder:text-ink-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!prompt.trim() || sending}
                aria-label="Send message"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white shadow-xs transition-all hover:bg-accent-dark disabled:opacity-30 disabled:pointer-events-none active:scale-95"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
            <p className="mt-2 text-center text-[11px] text-ink-400">
              Automated answers. For bespoke proposals,{" "}
              <Link href="/contact" onClick={() => setOpen(false)} className="underline hover:text-accent">
                write to the team
              </Link>.
            </p>
          </div>
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-rule/90 bg-ink px-4 py-2.5 text-[14px] font-medium text-white shadow-elevate transition-all duration-200 hover:bg-accent hover:shadow-xl hover:scale-105 active:scale-95 sm:bottom-7 sm:right-7"
        >
          <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-ink font-bold text-xs">
            G
          </span>
          <span>Ask Gmac</span>
        </button>
      )}
    </>
  );
}
