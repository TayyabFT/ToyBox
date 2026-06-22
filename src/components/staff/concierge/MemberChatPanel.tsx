"use client";

import { useCallback, useEffect, useState } from "react";
import { chatApi } from "@/api/chat.api";
import { VehicleSend } from "@/components/common/Svgs";
import { SectionHeader } from "@/components/staff/overview/SectionHeader";
import { toResourceId } from "@/lib/resourceId";
import { mapChatMessages } from "@/lib/chat";
import { showError } from "@/lib/toast";
import type { ChatConversation } from "@/types/api";
import { ChatMessage } from "./ChatMessage";
import type { ConciergeChatMessage } from "./types";

type MemberChatPanelProps = {
  memberId: string | null;
  memberName: string;
  onMessageSent?: () => void;
};

function isChatNotInitiated(message: string): boolean {
  return message.toLowerCase().includes("initiate");
}

export function MemberChatPanel({
  memberId,
  memberName,
  onMessageSent,
}: MemberChatPanelProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ConciergeChatMessage[]>([]);
  const [conversation, setConversation] = useState<ChatConversation | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const chatTitle = conversation?.memberName ?? memberName;

  const loadMessages = useCallback(async () => {
    if (memberId === null) {
      setMessages([]);
      setConversation(null);
      return;
    }

    setLoading(true);

    try {
      const response = await chatApi.getMessages(memberId);
      setMessages(mapChatMessages(response.data.messages));
      setConversation(response.data.conversation ?? null);

      if (response.data.messages.length > 0) {
        await chatApi.markRead(memberId);
      }
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to load chat";

      showError(message);
      setMessages([]);
      setConversation(null);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  async function handleSend() {
    const body = draft.trim();
    if (!memberId || !body || sending) return;

    setSending(true);

    try {
      try {
        await chatApi.sendMessage(memberId, { body });
      } catch (error) {
        const message = (error as { message?: string }).message ?? "";

        if (isChatNotInitiated(message)) {
          await chatApi.initiate({
            memberId: toResourceId(memberId),
            initialMessage: body,
          });
        } else {
          throw error;
        }
      }

      setDraft("");
      await loadMessages();
      onMessageSent?.();
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to send message";

      showError(message);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  }

  return (
    <section className="flex min-h-[420px] flex-col rounded-2xl border border-[#D4A8471A] bg-surface p-5">
      <SectionHeader
        title={`Member Chat — ${chatTitle}`}
        badge={
          conversation?.status === "active"
            ? { label: "online", tone: "green" }
            : undefined
        }
      />

      <div className="Custom__Scrollbar mb-4 flex-1 space-y-4 overflow-y-auto pr-1">
        {loading && messages.length === 0 && (
          <p className="font-roboto py-8 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
            Loading chat...
          </p>
        )}

        {!loading && messages.length === 0 && (
          <p className="font-roboto py-8 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
            No messages yet
          </p>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-[#D4A8471A] bg-card px-4 py-3">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={memberId === null || sending}
          placeholder={`Reply to ${chatTitle}...`}
          className="font-roboto min-w-0 flex-1 bg-transparent text-[12px] tracking-[0.02em] text-foreground outline-none placeholder:text-secondary disabled:opacity-50"
        />
        <button
          type="button"
          aria-label="Send message"
          disabled={memberId === null || sending || !draft.trim()}
          onClick={() => void handleSend()}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-[#F0C566] to-[#C9A84C] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <VehicleSend color="var(--dark)" />
        </button>
      </div>
    </section>
  );
}
