"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminChatApi } from "@/api/adminChat.api";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { VehicleSend } from "@/components/common/Svgs";
import { mapChatMessage, mapChatMessages } from "@/lib/chat";
import { toResourceId } from "@/lib/resourceId";
import { showError } from "@/lib/toast";
import type { ChatConversation } from "@/types/api";
import { ChatMessage } from "./ChatMessage";
import { conciergePanelClass } from "./panelStyles";
import type { ConciergeChatMessage } from "./types";

function ChatBubbleSkeleton({ align }: { align: "start" | "end" }) {
  return (
    <div
      className={`flex flex-col gap-2 ${align === "end" ? "items-end" : "items-start"}`}
    >
      <ShimmerBlock className="h-12 w-2/3 rounded-2xl" />
      <ShimmerBlock className="h-2.5 w-20" />
    </div>
  );
}

type MemberChatPanelProps = {
  memberId: string | null;
  memberName: string;
  chatOnline?: boolean;
  onMessageSent?: () => void;
};

function isChatNotInitiated(message: string): boolean {
  return message.toLowerCase().includes("initiate");
}

function formatNowTime(): string {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function createOptimisticMessage(body: string): ConciergeChatMessage {
  return {
    id: `optimistic-${Date.now()}`,
    sender: "staff",
    senderName: "You",
    time: formatNowTime(),
    message: body,
  };
}

export function MemberChatPanel({
  memberId,
  memberName,
  chatOnline = false,
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

  const scrollToLatestMessage = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, []);

  const loadMessages = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (memberId === null) {
        setMessages([]);
        setConversation(null);
        setLoading(false);
        return;
      }

      if (!silent) {
        setLoading(true);
        setMessages([]);
        setConversation(null);
      }

      try {
        const response = await adminChatApi.getMessages(memberId);
        setMessages(mapChatMessages(response.data.messages));
        setConversation(response.data.conversation ?? null);

        if (response.data.messages.length > 0) {
          await adminChatApi.markRead(memberId);
        }
      } catch (error) {
        if (!silent) {
          const message =
            (error as { message?: string }).message ?? "Failed to load chat";

          showError(message);
          setMessages([]);
          setConversation(null);
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [memberId],
  );

  useEffect(() => {
    setDraft("");
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    scrollToLatestMessage();
  }, [memberId, messages, scrollToLatestMessage]);

  async function handleSend() {
    const body = draft.trim();
    if (!memberId || !body || sending) return;

    const optimisticMessage = createOptimisticMessage(body);

    setSending(true);
    setDraft("");
    setMessages((current) => [...current, optimisticMessage]);

    try {
      try {
        const response = await adminChatApi.sendMessage(memberId, { body });
        const sentMessage = mapChatMessage(response.data.message);

        setMessages((current) =>
          current.map((message) =>
            message.id === optimisticMessage.id ? sentMessage : message,
          ),
        );
        setConversation(response.data.conversation ?? null);
      } catch (error) {
        const message = (error as { message?: string }).message ?? "";

        if (isChatNotInitiated(message)) {
          await adminChatApi.initiate({
            memberId: toResourceId(memberId),
            initialMessage: body,
          });
          await loadMessages({ silent: true });
        } else {
          throw error;
        }
      }

      onMessageSent?.();
    } catch (error) {
      setMessages((current) =>
        current.filter((message) => message.id !== optimisticMessage.id),
      );
      setDraft(body);

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

  const dateLabel = messages[0] ? `TODAY · ${messages[0].time}` : undefined;

  return (
    <section
      className={`${conciergePanelClass} flex h-full min-h-0 flex-col overflow-hidden`}
    >
      <div className="mb-4 flex shrink-0 items-center justify-between gap-3 border-b border-[#1E1A14] px-1 pb-4">
        <p className="font-roboto text-[13px] font-semibold tracking-[0.04em] text-[#F2EAD5] uppercase">
          {chatTitle}
        </p>
        {chatOnline && (
          <span className="font-roboto rounded-full bg-[#1A2E1A] px-2.5 py-1 text-[10px] tracking-[0.08em] text-[#7EC87E] uppercase">
            Online
          </span>
        )}
      </div>

      <div
        ref={messagesContainerRef}
        className="Custom__Scrollbar mb-5 min-h-0 flex-1 space-y-6 overflow-y-auto px-1 py-2"
      >
        {loading ? (
          <div className="space-y-6" aria-busy="true" aria-live="polite">
            <ChatBubbleSkeleton align="start" />
            <ChatBubbleSkeleton align="end" />
            <ChatBubbleSkeleton align="start" />
            <ChatBubbleSkeleton align="end" />
          </div>
        ) : messages.length > 0 ? (
          <>
            {dateLabel ? (
              <p className="font-roboto text-center text-[11px] tracking-[0.12em] text-[#6B665E] uppercase">
                {dateLabel}
              </p>
            ) : null}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </>
        ) : (
          <p className="font-roboto py-10 text-center text-[11px] tracking-[0.06em] text-[#6B665E] uppercase">
            No messages yet
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#2A2620] bg-[#0D0C0A] px-5 py-4">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={memberId === null || sending}
          placeholder={`Reply to ${chatTitle}...`}
          className="font-roboto min-w-0 flex-1 bg-transparent text-[13px] tracking-[0.02em] text-[#E7E5E4] outline-none placeholder:text-[#6B665E] disabled:opacity-50"
        />
        <button
          type="button"
          aria-label="Send message"
          disabled={memberId === null || sending || !draft.trim()}
          onClick={() => void handleSend()}
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#F0C566] to-[#C9A84C] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <VehicleSend color="#0A0806" className="size-4" />
        </button>
      </div>
    </section>
  );
}
