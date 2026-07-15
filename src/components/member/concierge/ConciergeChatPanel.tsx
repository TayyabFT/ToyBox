"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { memberChatApi } from "@/api/memberChat.api";
import { VehicleSend } from "@/components/common/Svgs";
import { ChatMessage } from "@/components/staff/concierge/ChatMessage";
import type { ConciergeChatMessage } from "@/components/staff/concierge/types";
import { SectionHeader } from "@/components/staff/overview/SectionHeader";
import { mapChatMessages } from "@/lib/chat";
import { showError } from "@/lib/toast";

type ConciergeChatPanelProps = {
  enabled?: boolean;
  contactId?: string;
  chatTitle?: string;
  onMessageSent?: () => void | Promise<void>;
};

function isChatNotInitiated(message: string): boolean {
  return message.toLowerCase().includes("initiate");
}

export function ConciergeChatPanel({
  enabled = true,
  contactId,
  chatTitle = "Concierge Team",
  onMessageSent,
}: ConciergeChatPanelProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ConciergeChatMessage[]>([]);
  const [conversationActive, setConversationActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, []);

  const loadMessages = useCallback(async () => {
    if (!enabled || !contactId) {
      setMessages([]);
      setConversationActive(false);
      return;
    }

    setLoading(true);

    try {
      const response = await memberChatApi.getMessages(contactId);
      const nextMessages = response.data.messages ?? [];

      setMessages(mapChatMessages(nextMessages));
      setConversationActive(
        Boolean(response.data.conversationId || nextMessages.length > 0),
      );
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to load chat";

      if (!isChatNotInitiated(message)) {
        showError(message);
      }

      setMessages([]);
      setConversationActive(false);
    } finally {
      setLoading(false);
    }
  }, [contactId, enabled]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (loading || messages.length === 0) return;

    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [loading, messages, scrollToBottom]);

  async function handleSend() {
    const body = draft.trim();
    if (!enabled || !contactId || !body || sending) return;

    setSending(true);

    try {
      try {
        await memberChatApi.sendMessage({ contactId, body });
      } catch (error) {
        const message = (error as { message?: string }).message ?? "";

        if (isChatNotInitiated(message)) {
          await memberChatApi.initiate({
            targetId: contactId,
            initialMessage: body,
          });
        } else {
          throw error;
        }
      }

      setDraft("");
      await loadMessages();
      await onMessageSent?.();
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
      {!enabled ? (
        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <p className="font-roboto text-[11px] tracking-[0.06em] text-secondary uppercase">
            Select a request to view chat
          </p>
        </div>
      ) : (
        <>
          <div className="shrink-0 px-5 pt-5">
            <SectionHeader
              title={`Member Chat — ${chatTitle}`}
              badge={
                conversationActive
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
                <ChatMessage
                  key={message.id}
                  message={message}
                  viewerRole="member"
                />
              ))}
            </div>
          </div>

          <div className="shrink-0 border-t border-accent/6 p-5">
            <div className="flex h-12 items-center gap-3 rounded-xl border border-accent/14 bg-input-muted">
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
                className="staff-add-cta flex h-full w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-gold-bright to-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
