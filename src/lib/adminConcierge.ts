import type {
  ConciergeInboxMessage,
  MessagePriorityTag,
} from "@/components/admin/concierge/types";
import { formatRelativeTime } from "@/lib/concierge";
import { toResourceId } from "@/lib/resourceId";
import type { ChatConversation } from "@/types/api";

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
}

function toDisplayName(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function mapInboxTags(conversation: ChatConversation): MessagePriorityTag[] {
  if (conversation.unreadForAdmin > 0) return ["urgent"];
  return ["normal"];
}

export function mapConversationToInboxMessage(
  conversation: ChatConversation,
): ConciergeInboxMessage {
  const memberName = toDisplayName(conversation.memberName);

  return {
    id: conversation.conversationId,
    memberName,
    memberInitial: memberName.charAt(0).toUpperCase(),
    preview: conversation.lastMessage
      ? truncate(conversation.lastMessage, 96)
      : "New conversation",
    timeLabel: formatRelativeTime(conversation.lastMessageAt),
    tags: mapInboxTags(conversation),
    unread: conversation.unreadForAdmin > 0,
    apiMemberId: toResourceId(conversation.memberId),
  };
}

export function mapConversationsToInboxMessages(
  conversations: ChatConversation[],
): ConciergeInboxMessage[] {
  return [...conversations]
    .sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() -
        new Date(a.lastMessageAt).getTime(),
    )
    .map(mapConversationToInboxMessage);
}
