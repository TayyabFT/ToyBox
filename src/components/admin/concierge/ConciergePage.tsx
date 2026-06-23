"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminChatApi } from "@/api/adminChat.api";
import { mapConversationsToInboxMessages } from "@/lib/adminConcierge";
import { showError } from "@/lib/toast";
import type { ChatConversation } from "@/types/api";
import { ConciergePageHeader } from "./ConciergePageHeader";
import { MemberChatPanel } from "./MemberChatPanel";
import { MessageInboxPanel } from "./MessageInboxPanel";
import type { ConciergeInboxMessage } from "./types";

export function ConciergePage() {
  const [selectedId, setSelectedId] = useState("");
  const [inboxMessages, setInboxMessages] = useState<ConciergeInboxMessage[]>(
    [],
  );
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const applyConversations = useCallback((nextConversations: ChatConversation[]) => {
    const messages = mapConversationsToInboxMessages(nextConversations);

    setConversations(nextConversations);
    setInboxMessages(messages);
    setSelectedId((current) => {
      if (current && messages.some((message) => message.id === current)) {
        return current;
      }

      return messages[0]?.id ?? "";
    });
  }, []);

  const loadConversations = useCallback(async () => {
    setLoading(true);

    try {
      const response = await adminChatApi.getConversations();
      applyConversations(response.data.conversations);
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load concierge messages";

      showError(message);
      setConversations([]);
      setInboxMessages([]);
      setSelectedId("");
    } finally {
      setLoading(false);
    }
  }, [applyConversations]);

  const refreshConversations = useCallback(async () => {
    try {
      const response = await adminChatApi.getConversations();
      applyConversations(response.data.conversations);
    } catch {
      // Keep the current inbox visible while silently refreshing.
    }
  }, [applyConversations]);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  const selectedMessage = useMemo(
    () =>
      inboxMessages.find((message) => message.id === selectedId) ??
      inboxMessages[0] ??
      null,
    [inboxMessages, selectedId],
  );

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.conversationId === selectedMessage?.id,
      ) ?? null,
    [conversations, selectedMessage],
  );

  return (
    <div className="flex h-[calc(100dvh-72px)] flex-col overflow-hidden p-8">
      <div className="shrink-0 space-y-6">
        <ConciergePageHeader />
      </div>

      <div className="mt-6 grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <MessageInboxPanel
          messages={inboxMessages}
          selectedId={selectedId}
          loading={loading}
          onSelect={setSelectedId}
        />

        <MemberChatPanel
          memberId={selectedMessage?.apiMemberId ?? null}
          memberName={selectedMessage?.memberName ?? "Member"}
          chatOnline={selectedConversation?.status === "active"}
          onMessageSent={refreshConversations}
        />
      </div>
    </div>
  );
}
