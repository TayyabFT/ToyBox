"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const chatTitle = conversation?.memberName ?? memberName;

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, []);

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

  useEffect(() => {
    if (loading || messages.length === 0) return;

    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [loading, messages, memberId, scrollToBottom]);

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
    <section className="flex max-h-[600px] flex-col overflow-hidden rounded-2xl border border-accent/10 bg-card">
      {memberId === null ? (
        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <p className="font-roboto text-[11px] tracking-[0.06em] text-secondary uppercase">
            Select a request to view chat
          </p>
        </div>
      ) : (
        <>
          <div className="shrink-0 pt-5 px-5">
            <SectionHeader
              title={`Member Chat — ${chatTitle}`}
              badge={
                conversation?.status === "active"
                  ? { label: "online", tone: "green" }
                  : undefined
              }
            />
          </div>

          <div
            ref={messagesContainerRef}
            className="Custom__Scrollbar min-h-0 flex-1 overflow-y-auto p-5"
          >
            <div className="space-y-4 pr-1">
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
          </div>

          <div className="shrink-0 border-t border-accent/6 p-5">
            <div className="flex items-center gap-3 rounded-xl border border-accent/14 bg-input-muted h-12">
              <input
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
                placeholder={`Reply to ${chatTitle}...`}
                className="font-roboto min-w-0 flex-1 bg-transparent p-4 text-sm tracking-[0.02em] text-foreground outline-none placeholder:text-secondary/70 disabled:opacity-50"
              />
              <button
                type="button"
                aria-label="Send message"
                disabled={sending || !draft.trim()}
                onClick={() => void handleSend()}
                className="flex h-full w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-gold-bright to-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <VehicleSend color="var(--dark)" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
