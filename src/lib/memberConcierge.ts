import type { MemberChatThread } from "@/types/api";
import { formatRelativeTime } from "@/lib/concierge";
import type {
  ConciergeAlert,
  ConciergeFilter,
  ConciergeOpenRequest,
  ConciergeRequestIcon,
  ConciergeRequestStatus,
} from "@/components/staff/concierge/types";

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
}

function formatContactRole(role: string): string {
  const normalized = role.trim();
  if (!normalized) return "Support";

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function mapMemberConversationStatus(
  thread: MemberChatThread,
): ConciergeRequestStatus {
  if ((thread.unreadForMember ?? 0) > 0) return "urgent";
  if (thread.status === "active") return "active";
  if (thread.status === "closed") return "done";
  return "pending";
}

function mapMemberConversationIcon(
  status: ConciergeRequestStatus,
): ConciergeRequestIcon {
  if (status === "done") return "check";
  if (status === "urgent") return "car";
  if (status === "active") return "gear";
  return "clipboard";
}

function mapMemberConversationFilterTags(
  status: ConciergeRequestStatus,
  thread: MemberChatThread,
): ConciergeFilter[] {
  const tags: ConciergeFilter[] = ["all"];

  if ((thread.unreadForMember ?? 0) > 0 || status === "urgent") {
    tags.push("urgent");
  }

  if (status !== "done") {
    tags.push("my-requests");
  }

  if (status === "done") {
    tags.push("resolved");
  }

  return tags;
}

export function mapMemberThreadToOpenRequest(
  thread: MemberChatThread,
): ConciergeOpenRequest {
  const status = mapMemberConversationStatus(thread);

  return {
    id: thread.contact.id,
    title: thread.lastMessage
      ? truncate(thread.lastMessage, 42)
      : `Chat with ${thread.contact.name}`,
    member: thread.contact.name,
    tier: formatContactRole(thread.contact.role),
    timeLabel: formatRelativeTime(thread.lastMessageAt ?? ""),
    status,
    icon: mapMemberConversationIcon(status),
    filterTags: mapMemberConversationFilterTags(status, thread),
    apiMemberId: thread.contact.id,
  };
}

export function mapMemberThreadsToOpenRequests(
  threads: MemberChatThread[],
): ConciergeOpenRequest[] {
  return threads.map(mapMemberThreadToOpenRequest);
}

export function buildMemberUrgentAlert(
  threads: MemberChatThread[],
): ConciergeAlert | null {
  const unreadTotal = threads.reduce(
    (sum, thread) => sum + (thread.unreadForMember ?? 0),
    0,
  );

  if (unreadTotal <= 0) return null;

  const firstUnread =
    threads.find((thread) => (thread.unreadForMember ?? 0) > 0) ?? threads[0];

  return {
    highlight: `${unreadTotal} unread message${
      unreadTotal === 1 ? "" : "s"
    } from ${firstUnread.contact.name}`,
    detail: firstUnread.lastMessage || "Open your chat to catch up.",
    timeLabel: formatRelativeTime(firstUnread.lastMessageAt ?? ""),
  };
}

export function getMemberActiveConversationCount(
  threads: MemberChatThread[],
): number {
  return threads.filter((thread) => thread.status !== "closed").length;
}

export function getMemberUnreadMessageCount(
  threads: MemberChatThread[],
): number {
  return threads.reduce(
    (sum, thread) => sum + (thread.unreadForMember ?? 0),
    0,
  );
}
