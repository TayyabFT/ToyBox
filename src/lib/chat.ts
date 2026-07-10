import type { ChatMessage } from "@/types/api";
import type { ConciergeChatMessage } from "@/components/staff/concierge/types";

function formatChatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function mapChatMessage(message: ChatMessage): ConciergeChatMessage {
  const senderType = message.senderType?.toLowerCase() ?? "";
  let sender: ConciergeChatMessage["sender"] = "staff";

  if (senderType === "member") {
    sender = "member";
  } else if (senderType === "admin") {
    sender = "admin";
  }

  return {
    id: message.id,
    sender,
    senderName: message.senderName,
    time: formatChatTime(message.createdAt),
    message: message.body,
  };
}

export function mapChatMessages(messages: ChatMessage[]): ConciergeChatMessage[] {
  return messages.map(mapChatMessage);
}
