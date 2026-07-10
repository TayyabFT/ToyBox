// ── Events page data types ───────────────────────────────────────────────────

export type EventFilter = "all" | "drives" | "auctions" | "dining" | "track" | "concours";

export type EventItem = {
  id: string;
  title: string;
  titlePrefix: string;
  titleHighlight?: string;
  location: string;
  dateLabel: string;   // e.g. "SAT 26 APR"
  timeLabel?: string;  // e.g. "19:00"
  timeEndLabel?: string; // e.g. "23:00" — shown as range on featured card
  description?: string; // short paragraph shown on featured card only
  tag: string;
  tagTone: "gold" | "teal" | "pink";
  imageUrl: string;
  membersCount?: number;
  attendingCount?: number;
  attendingMembers?: { name: string; initial: string }[];
  userStatus?: "going" | "rsvp" | null;
  isFeatured?: boolean;
  filter: EventFilter[];
  detailLines?: { icon: "pin" | "users" | "badge"; text: string }[];
};

export type EventsData = {
  groups: {
    id: string;
    label: string;
    events: EventItem[];
  }[];
};
