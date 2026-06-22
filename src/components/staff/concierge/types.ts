export type ConciergeFilter = "all" | "urgent" | "my-requests" | "resolved";

export type ConciergeRequestStatus =
  | "urgent"
  | "review"
  | "active"
  | "pending"
  | "done";

export type ConciergeRequestIcon = "car" | "clipboard" | "gear" | "check";

export type ConciergeOpenRequest = {
  id: string;
  title: string;
  member: string;
  tier: string;
  timeLabel: string;
  status: ConciergeRequestStatus;
  icon: ConciergeRequestIcon;
  filterTags: ConciergeFilter[];
  apiMemberId: string;
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
  sender: "staff" | "member";
  senderName: string;
  time: string;
  message: string;
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
