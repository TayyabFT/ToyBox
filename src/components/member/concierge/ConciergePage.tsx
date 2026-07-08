"use client";

import { useCallback, useEffect, useState } from "react";
import { memberChatApi } from "@/api/memberChat.api";
import type { ChatConversation } from "@/types/api";
import { ConciergeChatPanel } from "./ConciergeChatPanel";
import { ConciergeConversationPanel } from "./ConciergeConversationPanel";
import { ConciergeGreeting } from "./ConciergeGreeting";

export function MemberConciergePage() {
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [conversationLoading, setConversationLoading] = useState(true);

  const loadConversation = useCallback(async () => {
    setConversationLoading(true);

    try {
      const response = await memberChatApi.getConversation();
      setConversation(response.data ?? null);
    } catch {
      setConversation(null);
    } finally {
      setConversationLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConversation();
  }, [loadConversation]);

  return (
    <div className="space-y-6 p-8">
      <ConciergeGreeting />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ConciergeConversationPanel
          conversation={conversation}
          loading={conversationLoading}
        />

        <div className="col-span-2">
          <ConciergeChatPanel onMessageSent={loadConversation} />
        </div>
      </div>
    </div>
  );
}
