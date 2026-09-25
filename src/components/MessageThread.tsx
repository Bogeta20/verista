"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type MessageData = {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string };
};

const POLL_MS = 4000;

export function MessageThread({
  bookingId,
  currentUserId,
  otherPartyName,
  initialMessages,
}: {
  bookingId: string;
  currentUserId: string;
  otherPartyName: string;
  initialMessages: MessageData[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/bookings/${bookingId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;

    setSending(true);
    setError(null);

    const res = await fetch(`/api/bookings/${bookingId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    setSending(false);

    if (!res.ok) {
      setError("Couldn't send. Try again.");
      return;
    }

    const { message } = await res.json();
    setMessages((prev) => [...prev, message]);
    setDraft("");
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
      <div
        ref={scrollRef}
        className="flex max-h-[360px] min-h-[160px] flex-col gap-2.5 overflow-y-auto p-4"
      >
        {messages.length === 0 && (
          <p className="text-center text-[13px] text-muted">
            No messages yet — say hello to {otherPartyName}.
          </p>
        )}
        {messages.map((message) => {
          const mine = message.sender.id === currentUserId;
          return (
            <div
              key={message.id}
              className={`max-w-[78%] px-3.5 py-2.5 text-sm leading-snug ${
                mine
                  ? "self-end rounded-[14px_14px_4px_14px] bg-accent text-white"
                  : "self-start rounded-[14px_14px_14px_4px] border border-border bg-white text-foreground"
              }`}
            >
              {message.content}
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2.5 border-t border-border p-3"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message ${otherPartyName}…`}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-[13px] text-foreground outline-none placeholder:text-[#A69F91]"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={sending || !draft.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent disabled:opacity-60"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
      {error && <p className="px-3 pb-3 text-xs text-accent">{error}</p>}
    </div>
  );
}
