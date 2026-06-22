import type { ChatConversation, MemberListItemRaw, MemberProfileData } from "@/types/api";
import { compareResourceIdsDesc, toResourceId } from "@/lib/resourceId";
import type {
  ConciergeAlert,
  ConciergeFilter,
  ConciergeOpenRequest,
  ConciergeRequestDetail,
  ConciergeRequestIcon,
  ConciergeRequestStatus,
} from "@/components/staff/concierge/types";

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

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return "Now";
  if (diffMinutes < 60) return `${diffMinutes}m`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ${diffMinutes % 60}m`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function mapConversationStatus(
  conversation: ChatConversation,
): ConciergeRequestStatus {
  if (conversation.unreadForAdmin > 0) return "urgent";
  if (conversation.status === "active") return "active";
  if (conversation.status === "closed") return "done";
  return "pending";
}

function mapConversationIcon(status: ConciergeRequestStatus): ConciergeRequestIcon {
  if (status === "done") return "check";
  if (status === "urgent") return "car";
  if (status === "active") return "gear";
  return "clipboard";
}

function mapConversationFilterTags(
  status: ConciergeRequestStatus,
  conversation: ChatConversation,
): ConciergeFilter[] {
  const tags: ConciergeFilter[] = ["all"];

  if (conversation.unreadForAdmin > 0 || status === "urgent") {
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

export function filterOpenRequests(
  requests: ConciergeOpenRequest[],
  filter: ConciergeFilter,
): ConciergeOpenRequest[] {
  if (filter === "all") return requests;

  return requests.filter((request) => request.filterTags.includes(filter));
}

export function mapConversationToOpenRequest(
  conversation: ChatConversation,
  member?: MemberListItemRaw,
): ConciergeOpenRequest {
  const status = mapConversationStatus(conversation);

  return {
    id: conversation.conversationId,
    title: conversation.lastMessage
      ? truncate(conversation.lastMessage, 42)
      : "New conversation",
    member: toDisplayName(conversation.memberName),
    tier: member?.tierLabel ?? member?.membershipTier ?? "Member",
    timeLabel: formatRelativeTime(conversation.lastMessageAt),
    status,
    icon: mapConversationIcon(status),
    filterTags: mapConversationFilterTags(status, conversation),
    apiMemberId: toResourceId(conversation.memberId),
  };
}

export function mapConversationsToOpenRequests(
  conversations: ChatConversation[],
  membersById: Record<string, MemberListItemRaw> = {},
): ConciergeOpenRequest[] {
  return [...conversations]
    .sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() -
        new Date(a.lastMessageAt).getTime(),
    )
    .map((conversation) =>
      mapConversationToOpenRequest(
        conversation,
        membersById[toResourceId(conversation.memberId)],
      ),
    );
}

export function getActiveConversationCount(
  conversations: ChatConversation[],
): number {
  return conversations.filter(
    (conversation) => conversation.status === "active",
  ).length;
}

export function getUnreadConversationCount(
  conversations: ChatConversation[],
): number {
  return conversations.filter(
    (conversation) => conversation.unreadForAdmin > 0,
  ).length;
}

export function buildUrgentAlert(
  conversations: ChatConversation[],
): ConciergeAlert | null {
  const urgent = [...conversations]
    .filter((conversation) => conversation.unreadForAdmin > 0)
    .sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() -
        new Date(a.lastMessageAt).getTime(),
    )[0];

  if (!urgent) return null;

  return {
    highlight: `Unread — ${toDisplayName(urgent.memberName)}`,
    detail: urgent.lastMessage,
    timeLabel: formatRelativeTime(urgent.lastMessageAt),
  };
}

export function mapMemberToConciergeDetail(
  member: MemberProfileData,
  conversation?: ChatConversation | null,
): ConciergeRequestDetail {
  const rawName =
    member.displayName?.trim() ||
    `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim() ||
    "Member";
  const displayName = toDisplayName(rawName);
  const stats = member.headerStats;

  return {
    id: conversation?.conversationId ?? String(member.id ?? ""),
    memberName: displayName,
    memberInitial: displayName.charAt(0).toUpperCase(),
    memberStatus: member.onPremises ? "Online" : member.lastSeen ?? "Offline",
    memberTier: member.tierLabel ?? member.membershipTier ?? "Member",
    memberId: member.memberNumberLabel ?? member.memberNumber ?? String(member.id ?? ""),
    conciergeLead: "—",
    checklist: [],
    logistics: [
      {
        label: "Last Message",
        value: conversation?.lastMessage
          ? truncate(conversation.lastMessage, 48)
          : "—",
        highlight: Boolean(conversation?.lastMessage),
      },
      {
        label: "Email",
        value: member.email ?? "—",
      },
      {
        label: "Member Since",
        value: member.memberSince ?? "—",
      },
      {
        label: "Account Status",
        value: member.accountStatus ?? "—",
      },
      {
        label: "Vehicles",
        value: String(stats?.vehicles ?? 0),
      },
      {
        label: "Events",
        value: String(stats?.events ?? 0),
      },
    ],
    chatTitle: displayName,
    chatOnline: member.onPremises ?? conversation?.status === "active",
    chatMessages: [],
  };
}

export function indexMembersById(
  members: MemberListItemRaw[] = [],
): Record<string, MemberListItemRaw> {
  return members.reduce<Record<string, MemberListItemRaw>>((acc, member) => {
    const id = toResourceId(member.id);

    if (id) {
      acc[id] = member;
    }

    return acc;
  }, {});
}
