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
    <div className="space-y-2.5">
      {lines.map((raw, i) => {
        const line = raw.trim();
        if (!line) return null;
        const heading = line.match(/^#{1,3}\s+(.+)/);
        if (heading) return <p key={i} className="pt-1 font-display text-[17px] text-ink">{inline(heading[1])}</p>;
        const bullet = line.match(/^(?:\*|-|•)\s+(.+)/);
        if (bullet)
          return (
            <p key={i} className="grid grid-cols-[0.9rem_1fr]">
              <span aria-hidden="true" className="text-accent">·</span>
              <span>{inline(bullet[1])}</span>
            </p>
          );
        return <p key={i}>{inline(line)}</p>;
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
          className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col border-t-4 border-ink bg-paper shadow-[0_-12px_40px_-12px_rgba(14,26,43,0.35)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(600px,calc(100dvh-6rem))] sm:w-[400px] sm:border sm:border-t-4 sm:border-ink/15 sm:border-t-ink modal-panel-in"
        >
          <header className="flex items-start justify-between gap-4 border-b border-rule px-5 pb-4 pt-5">
            <div>
              <h2 id="ask-title" className="font-display text-2xl leading-tight">Ask Gmac Group</h2>
              <p className="mt-1 text-[13px] leading-snug text-ink-500">
                Quick answers about our work. For a proposal, <Link href="/contact" onClick={() => setOpen(false)} className="text-accent underline underline-offset-2">write to the team</Link>.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button type="button" onClick={reset} className="px-2 py-1 text-[13px] text-ink-500 hover:text-ink">
                Restart
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="p-1.5 text-ink-400 hover:text-ink">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 text-[15px] leading-relaxed text-ink-600" aria-live="polite">
            {messages.map((m, i) =>
              m.role === "assistant" ? (
                <div key={i} className="border-l-2 border-accent/60 pl-4">
                  <Formatted content={m.content} />
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[85%] bg-accent-light px-4 py-2.5 text-ink">{m.content}</p>
                </div>
              ),
            )}
            {sending && (
              <p className="border-l-2 border-accent/60 pl-4 text-ink-400">
                <span className="inline-flex gap-1" aria-label="Writing a reply">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-400" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-400 [animation-delay:300ms]" />
                </span>
              </p>
            )}
            {error && <p role="alert" className="border-l-2 border-danger pl-4 text-[14px] text-danger">{error}</p>}
            {suggestions.length > 0 && !sending && (
              <div className="flex flex-col items-start gap-2 pt-1">
                {suggestions.map((s) => (
                  <button key={s} type="button" onClick={() => send(null, s)} className="border border-ink/20 bg-white px-3 py-1.5 text-left text-[14px] text-ink hover:border-accent hover:text-accent">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-rule px-4 py-3">
            <label htmlFor="ask-input" className="sr-only">Your question</label>
            <input
              id="ask-input"
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              maxLength={1000}
              placeholder="Type a question"
              className="min-w-0 flex-1 border-0 bg-transparent py-2 text-[15px] text-ink placeholder:text-ink-400 focus:outline-none"
            />
            <button type="submit" disabled={!prompt.trim() || sending} className="btn-primary !px-4 !py-2 !text-sm disabled:opacity-40">
              Send
            </button>
          </form>
          <p className="px-5 pb-3 text-[11.5px] text-ink-400">Automated answers can be wrong. Please confirm important details with our team.</p>
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 border border-ink/15 bg-paper py-2.5 pl-3 pr-4 text-[14px] font-medium text-ink shadow-[0_10px_30px_-12px_rgba(14,26,43,0.45)] transition-colors hover:border-ink sm:bottom-6 sm:right-6"
        >
          <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center bg-ink font-display text-[15px] text-white">G</span>
          Ask Gmac
        </button>
      )}
    </>
  );
}
