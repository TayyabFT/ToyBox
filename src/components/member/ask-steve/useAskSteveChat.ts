"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { askSteveApi } from "@/api/askSteve.api";
import { authApi } from "@/api/auth.api";
import {
  getAskSteveGreeting,
  mapAiMessages,
  resolveAiConversationId,
  resolveAiQueryAnswer,
  type AskSteveMessage,
} from "@/lib/askSteve";
import { showError } from "@/lib/toast";
import type { AiMessage } from "@/types/api";

const THINKING_MESSAGE_ID = "ask-steve-thinking";

function createPendingUserMessage(query: string, memberName: string): AskSteveMessage {
  return {
    id: `pending-user-${Date.now()}`,
    sender: "member",
    senderName: memberName,
    time: "",
    message: query,
    pending: true,
  };
}

function createThinkingMessage(): AskSteveMessage {
  return {
    id: THINKING_MESSAGE_ID,
    sender: "steve",
    senderName: "Steve",
    time: "",
    message: "Thinking...",
    pending: true,
  };
}

function withoutThinking(messages: AskSteveMessage[]): AskSteveMessage[] {
  return messages.filter((message) => message.id !== THINKING_MESSAGE_ID);
}

export function useAskSteveChat() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<AskSteveMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [memberId, setMemberId] = useState<string | undefined>();
  const [memberName, setMemberName] = useState("You");
  const [greeting, setGreeting] = useState(getAskSteveGreeting());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [resetting, setResetting] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const hasConversation =
    messages.some((message) => !message.pending) || sending;

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, []);

  const applyConversationState = useCallback(
    (
      nextConversationId?: string,
      nextMemberId?: string,
      nextMessages: AiMessage[] = [],
    ) => {
      setConversationId(nextConversationId);
      setMemberId(nextMemberId);
      setMessages(mapAiMessages(nextMessages, memberName));
    },
    [memberName],
  );

  const refreshMessages = useCallback(
    async (activeConversationId?: string) => {
      if (!activeConversationId) {
        const conversationResponse = await askSteveApi.getConversation();
        const conversation = conversationResponse.data.conversation;
        const resolvedId = resolveAiConversationId(conversation);

        applyConversationState(
          resolvedId,
          conversation?.memberId,
          conversationResponse.data.messages ?? [],
        );

        return resolvedId;
      }

      const messagesResponse = await askSteveApi.getMessages(activeConversationId);

      applyConversationState(
        activeConversationId,
        messagesResponse.data.conversation?.memberId ?? memberId,
        messagesResponse.data.messages ?? [],
      );

      return activeConversationId;
    },
    [applyConversationState, memberId],
  );

  const loadInitialConversation = useCallback(async () => {
    setLoading(true);

    try {
      const [profileResponse, conversationResponse] = await Promise.all([
        authApi.getProfile().catch(() => null),
        askSteveApi.getConversation(),
      ]);

      const profileName =
        profileResponse?.data?.displayName ??
        profileResponse?.data?.fullName ??
        profileResponse?.data?.name;

      if (profileName?.trim()) {
        setMemberName(profileName.trim());
        setGreeting(getAskSteveGreeting(profileName));
      }

      const conversation = conversationResponse.data.conversation;
      const resolvedId = resolveAiConversationId(conversation);
      const nextMessages = conversationResponse.data.messages ?? [];

      setConversationId(resolvedId);
      setMemberId(conversation?.memberId);
      setMessages(mapAiMessages(nextMessages, profileName?.trim() || "You"));
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to load Ask Steve";

      showError(message);
      setMessages([]);
      setConversationId(undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitialConversation();
  }, [loadInitialConversation]);

  useEffect(() => {
    if (loading || messages.length === 0) return;

    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [loading, messages, scrollToBottom]);

  const sendQuery = useCallback(
    async (queryText?: string) => {
      const query = (queryText ?? draft).trim();
      if (!query || sending) return;

      setSending(true);
      setDraft("");

      const pendingUserMessage = createPendingUserMessage(query, memberName);

      setMessages((current) => [
        ...withoutThinking(current),
        pendingUserMessage,
        createThinkingMessage(),
      ]);

      try {
        const response = await askSteveApi.query({
          query,
          conversationId,
          memberId,
          newConversation: false,
        });

        const nextConversationId =
          response.data.conversationId ??
          resolveAiConversationId(response.data.conversation) ??
          conversationId;

        setConversationId(nextConversationId);

        if (response.data.conversation?.memberId) {
          setMemberId(response.data.conversation.memberId);
        }

        if (nextConversationId) {
          await refreshMessages(nextConversationId);
          return;
        }

        const answer = resolveAiQueryAnswer(response.data);

        setMessages((current) => {
          const settled = withoutThinking(current).filter(
            (message) => !message.pending,
          );

          return [
            ...settled,
            {
              id: pendingUserMessage.id,
              sender: "member",
              senderName: memberName,
              time: "",
              message: query,
            },
            ...(answer
              ? [
                  {
                    id: `assistant-${Date.now()}`,
                    sender: "steve" as const,
                    senderName: "Steve",
                    time: "",
                    message: answer,
                  },
                ]
              : []),
          ];
        });
      } catch (error) {
        const message =
          (error as { message?: string }).message ?? "Failed to send message";

        showError(message);
        setMessages((current) => withoutThinking(current).filter((item) => !item.pending));
      } finally {
        setSending(false);
      }
    },
    [conversationId, draft, memberId, memberName, refreshMessages, sending],
  );

  const startNewChat = useCallback(async () => {
    if (resetting || sending) return;

    setResetting(true);

    try {
      const response = await askSteveApi.resetConversation();
      const nextConversationId = resolveAiConversationId(
        response.data.conversation,
      );

      setConversationId(nextConversationId);
      setMemberId(response.data.conversation?.memberId);
      setMessages([]);
      setDraft("");
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to start a new chat";

      showError(message);
    } finally {
      setResetting(false);
    }
  }, [resetting, sending]);

  return {
    draft,
    setDraft,
    messages,
    greeting,
    loading,
    sending,
    resetting,
    hasConversation,
    messagesContainerRef,
    sendQuery,
    startNewChat,
  };
}
