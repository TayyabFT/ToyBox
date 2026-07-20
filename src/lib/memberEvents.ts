/**
 * Maps raw API event rows (from GET /api/v1/events?grouped=true)
 * into the EventItem view model used by the UI components.
 */
import type { MemberEventRaw } from "@/types/api";
import type { EventItem, EventFilter } from "@/components/member/events/types";

// ── Helpers ──────────────────────────────────────────────────────────────────

const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
const MON_ABBR = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
] as const;

function formatDateLabel(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const day = DAY_ABBR[d.getDay()];
  const num = d.getDate();
  const mon = MON_ABBR[d.getMonth()];
  return `${day} ${num} ${mon}`;
}

function formatTimeLabel(iso?: string, isAllDay?: boolean): string | undefined {
  if (isAllDay) return "All Day";
  if (!iso) return undefined;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return undefined;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** Split "Auction Day — Yas Marina" into { prefix: "Auction Day —", highlight: "Yas Marina" } */
function splitTitle(title: string): { prefix: string; highlight?: string } {
  const EM_DASH_RE = /\s*[—–-]\s*/;
  const parts = title.split(EM_DASH_RE);
  if (parts.length >= 2) {
    const prefix = parts.slice(0, -1).join(" — ");
    const highlight = parts[parts.length - 1];
    return { prefix: prefix + " —", highlight };
  }
  return { prefix: title };
}

/** Map API category → EventFilter token */
function mapCategory(category?: string): EventFilter {
  const map: Record<string, EventFilter> = {
    drives:   "drives",
    auctions: "auctions",
    dining:   "dining",
    track:    "track",
    concours: "concours",
  };
  return map[category?.toLowerCase() ?? ""] ?? "all";
}

/** Derive tag label and tone from category */
function tagFromCategory(
  category?: string,
): { tag: string; tagTone: "gold" | "teal" | "pink" } {
  const map: Record<string, { tag: string; tagTone: "gold" | "teal" | "pink" }> = {
    drives:   { tag: "DRIVE",   tagTone: "gold" },
    auctions: { tag: "AUCTION", tagTone: "gold" },
    dining:   { tag: "DINING",  tagTone: "teal" },
    track:    { tag: "TRACK",   tagTone: "gold" },
    concours: { tag: "SHOW",    tagTone: "teal" },
    social:   { tag: "SOCIAL",  tagTone: "pink" },
  };
  return map[category?.toLowerCase() ?? ""] ?? { tag: "EVENT", tagTone: "gold" };
}

// ── Main mapper ───────────────────────────────────────────────────────────────

export function mapMemberEventRaw(
  raw: MemberEventRaw,
  isFeaturedOverride?: boolean,
): EventItem {
  const { prefix, highlight } = splitTitle(raw.title ?? "Unnamed Event");
  const { tag, tagTone } = tagFromCategory(raw.category);
  const isFeatured = isFeaturedOverride ?? raw.isFeatured ?? false;
  const filter: EventFilter[] = ["all", mapCategory(raw.category)].filter(
    (f, i, arr) => arr.indexOf(f) === i,
  ) as EventFilter[];

  // RSVP status
  const rsvpStatus = raw.myRsvp?.status;
  const userStatus: "going" | null =
    rsvpStatus === "going" ? "going" : null;
  const isFavorite = raw.myRsvp?.isFavorite ?? false;

  // Build detail lines for featured card
  const detailLines: EventItem["detailLines"] = [];
  if (raw.location) {
    detailLines.push({ icon: "pin", text: raw.location });
  }
  if (raw.attendingCount != null) {
    const spotsText =
      raw.spotsRemaining != null
        ? `${raw.attendingCount} Members Attending — ${raw.spotsRemaining} spots remaining`
        : `${raw.attendingCount} Members Attending`;
    detailLines.push({ icon: "users", text: spotsText });
  }
  if (raw.accessType && raw.accessType !== "open") {
    detailLines.push({
      icon: "badge",
      text:
        raw.accessType === "invite-only"
          ? "By Invitation Only"
          : raw.accessType,
    });
  } else if (raw.accessType === "open") {
    detailLines.push({ icon: "badge", text: "Open to all members" });
  }

  return {
    id: raw.id,
    title: raw.title ?? "",
    titlePrefix: prefix,
    titleHighlight: highlight,
    location: raw.location ?? "",
    dateLabel: formatDateLabel(raw.startsAt),
    timeLabel: formatTimeLabel(raw.startsAt, raw.isAllDay),
    timeEndLabel: raw.endsAt ? formatTimeLabel(raw.endsAt) : undefined,
    description: raw.description,
    tag: isFeatured ? "FEATURED TONIGHT" : tag,
    tagTone: isFeatured ? "gold" : tagTone,
    imageUrl: raw.imageUrl ?? "",
    attendingCount: raw.attendingCount,
    attendingMembers: raw.attendingMembers,
    userStatus,
    isFavorite,
    isFeatured,
    filter,
    detailLines: isFeatured ? detailLines : undefined,
  };
}

export function mapMemberEventGroups(data: {
  featured: MemberEventRaw[];
  thisWeek: MemberEventRaw[];
  nextMonth: MemberEventRaw[];
}) {
  const featured = data.featured.map((r) => mapMemberEventRaw(r, true));
  const thisWeek = data.thisWeek.map((r) => mapMemberEventRaw(r, false));
  const nextMonth = data.nextMonth.map((r) => mapMemberEventRaw(r, false));

  return { featured, thisWeek, nextMonth, otherUpcoming: [] as EventItem[], past: [] as EventItem[] };
}

/**
 * Categorizes a flat list of raw events into Featured, This Week, Next Month,
 * Upcoming (future other weeks), and Past sections.
 */
export function groupFlatEvents(
  rawEvents: MemberEventRaw[],
  refDate: Date = new Date(),
) {
  // Map all rows without the featured override — tags are based on category.
  // We apply "FEATURED TONIGHT" only to the single hero card below.
  const mapped = rawEvents.map((r) => mapMemberEventRaw(r, false));

  // Determine the active featured hero event: prefer one explicitly flagged
  // isFeatured by the API, otherwise fall back to the first event.
  const heroRaw = rawEvents.find((r) => r.isFeatured) ?? rawEvents[0];
  const heroEvent = heroRaw
    ? mapMemberEventRaw(heroRaw, true)  // hero gets "FEATURED TONIGHT" tag
    : null;

  // The featured list returned should only contain the active hero
  const featured = heroEvent ? [heroEvent] : [];
  
  // All remaining events to be grouped in the grids (excluding the hero)
  const gridEvents = mapped.filter((e) => e.id !== heroEvent?.id);

  // Date boundaries
  const ref = new Date(refDate);
  
  // Monday of the reference week
  const day = ref.getDay();
  const diff = ref.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(ref.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);

  // Sunday of the reference week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  // Next calendar month boundaries
  const nextStart = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 1);
  nextStart.setHours(0, 0, 0, 0);
  const nextEnd = new Date(refDate.getFullYear(), refDate.getMonth() + 2, 0);
  nextEnd.setHours(23, 59, 59, 999);

  const thisWeek: EventItem[] = [];
  const nextMonth: EventItem[] = [];
  const otherUpcoming: EventItem[] = [];
  const past: EventItem[] = [];

  for (const e of gridEvents) {
    if (!e.dateLabel) {
      // Default to other upcoming if date is invalid
      otherUpcoming.push(e);
      continue;
    }

    const eventDate = new Date(e.id && rawEvents.find(r => r.id === e.id)?.startsAt || "");
    if (isNaN(eventDate.getTime())) {
      otherUpcoming.push(e);
      continue;
    }

    if (eventDate.getTime() < weekStart.getTime()) {
      past.push(e);
    } else if (eventDate.getTime() >= weekStart.getTime() && eventDate.getTime() <= weekEnd.getTime()) {
      thisWeek.push(e);
    } else if (eventDate.getTime() >= nextStart.getTime() && eventDate.getTime() <= nextEnd.getTime()) {
      nextMonth.push(e);
    } else {
      otherUpcoming.push(e);
    }
  }

  // Sort groups chronologically
  const sortByDate = (a: EventItem, b: EventItem) => {
    const rA = rawEvents.find((r) => r.id === a.id);
    const rB = rawEvents.find((r) => r.id === b.id);
    const dateA = new Date(rA?.startsAt || "");
    const dateB = new Date(rB?.startsAt || "");
    return dateA.getTime() - dateB.getTime();
  };

  thisWeek.sort(sortByDate);
  nextMonth.sort(sortByDate);
  otherUpcoming.sort(sortByDate);
  // Sort past reverse chronologically (most recent past event first)
  past.sort((a, b) => {
    const rA = rawEvents.find((r) => r.id === a.id);
    const rB = rawEvents.find((r) => r.id === b.id);
    const dateA = new Date(rA?.startsAt || "");
    const dateB = new Date(rB?.startsAt || "");
    return dateB.getTime() - dateA.getTime();
  });

  return {
    featured,
    thisWeek,
    nextMonth,
    otherUpcoming,
    past,
  };
}
