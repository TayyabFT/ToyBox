export type OpUpdateFilter = "all" | "announcements" | "my-posts" | "flagged";

export type OpUpdateTab = {
  id: OpUpdateFilter;
  label: string;
};

export type OpUpdateHeader = {
  dateLabel: string;
  shiftLabel: string;
};

export type FeedStatus =
  | "issue"
  | "completed"
  | "in-transit"
  | "in-progress"
  | "management"
  | "inspection";

export type FeedTag = {
  label: string;
  tone?: "default" | "gold" | "pink" | "teal";
};

export type ShiftFeedItem = {
  id: string;
  author: string;
  authorInitial: string;
  status: FeedStatus;
  statusLabel: string;
  time: string;
  body: string;
  tags: FeedTag[];
  icon: "flag" | "check" | "truck" | "wrench" | "megaphone" | "inspect";
  filterTags: OpUpdateFilter[];
  isFlagged?: boolean;
  isAnnouncement?: boolean;
  isOwnPost?: boolean;
  isPinned?: boolean;
  canPin?: boolean;
};

export type ManagementBroadcast = {
  author: string;
  role: string;
  body: string;
  timeLabel: string;
};

export type PinnedNotice = {
  id: string;
  title: string;
  body: string;
  tone: "purple" | "gold" | "teal";
  isPinned?: boolean;
};

export type LinkedOption = {
  id: string;
  label: string;
};

export type ShiftLogEntry = {
  id: string;
  time: string;
  title: string;
  highlight?: string;
  tone: "gold" | "pink" | "teal" | "default";
};

export type PostCategory = "general" | "vehicle" | "member";
