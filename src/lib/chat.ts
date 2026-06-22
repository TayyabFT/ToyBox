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

export function mapChatMessages(messages: ChatMessage[]): ConciergeChatMessage[] {
  return messages.map((message) => ({
    id: message.id,
    sender: message.senderType === "member" ? "member" : "staff",
    senderName: message.senderName,
    time: formatChatTime(message.createdAt),
    message: message.body,
  }));
}
