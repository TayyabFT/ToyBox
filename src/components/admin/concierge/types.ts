export type ConciergeFilter = "all" | "urgent" | "my-requests" | "resolved";

export type MessageInboxFilter = "all" | "unread";

export type MessagePriorityTag = "urgent" | "private" | "high" | "normal";

export type ConciergeRequestStatus =
  | "urgent"
  | "review"
  | "active"
  | "pending"
  | "done";

export type ConciergeRequestIcon = "car" | "camera" | "gear" | "check";

export type ConciergeOpenRequest = {
  id: string;
  title: string;
  member: string;
  tier: string;
  timeLabel: string;
  status: ConciergeRequestStatus;
  icon: ConciergeRequestIcon;
  filterTags: ConciergeFilter[];
};

export type ConciergeChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
};

export type ConciergeLogisticsItem = {
  label: string;
  value: string;
  highlight?: boolean;
};

export type ConciergeChatMessage = {
  id: string;
  sender: "staff" | "member" | "admin";
  senderName: string;
  time: string;
  message: string;
  highlights?: string[];
  read?: boolean;
};

export type ConciergeRequestDetail = {
  id: string;
  memberName: string;
  memberInitial: string;
  memberStatus: string;
  memberTier: string;
  memberId: string;
  conciergeLead: string;
  checklist: ConciergeChecklistItem[];
  logistics: ConciergeLogisticsItem[];
  chatTitle: string;
  chatOnline: boolean;
  chatMessages: ConciergeChatMessage[];
};

export type ConciergeAlert = {
  highlight: string;
  detail: string;
  timeLabel: string;
};

export type ConciergeInboxMessage = {
  id: string;
  memberName: string;
  memberInitial: string;
  preview: string;
  timeLabel: string;
  tags: MessagePriorityTag[];
  unread?: boolean;
  apiMemberId: string;
};
