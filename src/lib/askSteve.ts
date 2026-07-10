import type { AiConversation, AiMessage, AiQueryData } from "@/types/api";
import type { ConciergeChatMessage } from "@/components/staff/concierge/types";

export type AskSteveMessage = {
  id: string;
  sender: "member" | "steve";
  senderName: string;
  time: string;
  message: string;
  pending?: boolean;
};

function formatAskSteveTime(iso?: string): string {
  if (!iso) return "";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function resolveAiConversationId(
  conversation?: AiConversation | null,
): string | undefined {
  return conversation?.conversationId ?? conversation?.id;
}

export function resolveAiMessageText(message?: AiMessage | null): string {
  if (!message) return "";

  return (
    message.content ??
    message.body ??
    message.query ??
    message.answer ??
    message.response ??
    ""
  );
}

export function isAiMemberMessage(message: AiMessage): boolean {
  const role = (message.role ?? message.senderType ?? "").toLowerCase();

  return role === "user" || role === "member";
}

export function mapAiMessage(
  message: AiMessage,
  memberName = "You",
): AskSteveMessage {
  const isMember = isAiMemberMessage(message);

  return {
    id: message.id,
    sender: isMember ? "member" : "steve",
    senderName: message.senderName ?? (isMember ? memberName : "Steve"),
    time: formatAskSteveTime(message.createdAt),
    message: resolveAiMessageText(message),
  };
}

export function mapAiMessages(
  messages: AiMessage[],
  memberName = "You",
): AskSteveMessage[] {
  return messages.map((message) => mapAiMessage(message, memberName));
}

export function mapAskSteveToConciergeMessage(
  message: AskSteveMessage,
): ConciergeChatMessage {
  return {
    id: message.id,
    sender: message.sender === "member" ? "member" : "staff",
    senderName: message.senderName,
    time: message.time,
    message: message.message,
  };
}

export function mapAskSteveToConciergeMessages(
  messages: AskSteveMessage[],
): ConciergeChatMessage[] {
  return messages.map(mapAskSteveToConciergeMessage);
}

export function resolveAiQueryAnswer(data: AiQueryData): string {
  const direct =
    data.answer ?? data.reply ?? data.response ?? resolveAiMessageText(
      data.assistantMessage ?? data.message,
    );

  return direct.trim();
}

export function getAskSteveGreeting(memberName?: string): string {
  const hour = new Date().getHours();
  const salutation =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (!memberName?.trim()) {
    return `${salutation},`;
  }

  const firstName = memberName.trim().split(/\s+/)[0];
  return `${salutation}, ${firstName}`;
}
