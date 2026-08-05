"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import type { ChatIntro } from "@/features/generation/types";
import { headingStyle, primaryButtonClass } from "../theme";

interface Props {
  slug: string;
  businessName: string;
  chatIntro: ChatIntro;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Floating live chat widget, backed by a real Claude call per message (see
 * /api/site-chat). Only rendered on the live /site/[slug] page -- the
 * downloaded static HTML export has no server behind it, so it gets a
 * direct call button instead (see WebsiteExportDocument).
 */
export default function ChatWidget({ slug, businessName, chatIntro }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/site-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--w-primary)] text-white shadow-lg transition hover:opacity-90"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
          <div className="flex items-center gap-3 bg-[var(--w-primary)] px-4 py-3.5 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg" aria-hidden>
              💬
            </div>
            <div>
              <p style={headingStyle} className="text-sm font-bold">
                {businessName}
              </p>
              <p className="text-xs text-white/80">Ask us anything</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[var(--w-bg)] px-4 py-4">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-sm text-[var(--w-text)] shadow-sm">
              {chatIntro.greeting}
            </div>

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                  m.role === "user"
                    ? "ml-auto rounded-br-sm bg-[var(--w-primary)] text-white"
                    : "rounded-bl-sm bg-white text-[var(--w-text)]"
                }`}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="flex max-w-[85%] items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 shadow-sm">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--w-text)]/50" />
              </div>
            )}

            {error && <p className="text-xs font-medium text-red-600">{error}</p>}

            {messages.length === 0 && chatIntro.quickReplies?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {chatIntro.quickReplies.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="rounded-full border border-[var(--w-primary)]/30 bg-white px-3 py-1.5 text-xs font-medium text-[var(--w-primary)] transition hover:bg-[var(--w-secondary)]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 border-t border-black/10 bg-white p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-black/10 px-3.5 py-2 text-sm focus:border-[var(--w-primary)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
              className={`${primaryButtonClass} !p-2.5 disabled:opacity-40`}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
