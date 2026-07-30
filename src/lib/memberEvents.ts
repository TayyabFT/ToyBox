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

export function parseEventDate(iso?: string | null): Date | null {
  if (!iso) return null;
  const normalized = iso.trim().replace(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:)/, "$1T$2");
  const d = new Date(normalized);
  if (!isNaN(d.getTime())) return d;
  const dDirect = new Date(iso);
  if (!isNaN(dDirect.getTime())) return dDirect;
  return null;
}

function formatDateLabel(iso?: string): string {
  if (!iso) return "";
  const d = parseEventDate(iso);
  if (!d) return "";
  const day = DAY_ABBR[d.getDay()];
  const num = d.getDate();
  const mon = MON_ABBR[d.getMonth()];
  return `${day} ${num} ${mon}`;
}

function formatTimeLabel(iso?: string, isAllDay?: boolean): string | undefined {
  if (isAllDay) return "All Day";
  if (!iso) return undefined;
  const d = parseEventDate(iso);
  if (!d) return undefined;
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
    social:   { tag: "SOCIAL",  tagTone: "pink" },
  };
  return map[category?.toLowerCase() ?? ""] ?? { tag: "EVENT", tagTone: "gold" };
}

function getFallbackEndsAt(startsAt?: string): string | undefined {
  if (!startsAt) return undefined;
  const d = parseEventDate(startsAt);
  if (!d) return undefined;
  const end = new Date(d.getTime() + 2 * 60 * 60 * 1000);
  return end.toISOString();
}

// ── Main mapper ───────────────────────────────────────────────────────────────

export function mapMemberEventRaw(
  raw: MemberEventRaw,
  isFeaturedOverride?: boolean,
  tagOverride?: string,
): EventItem {
  const { prefix, highlight } = splitTitle(raw.title ?? "Unnamed Event");
  const { tag: categoryTag, tagTone: categoryTagTone } = tagFromCategory(raw.category);
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

  const startsAtIso = raw.startsAt;
  const endsAtIso = raw.endsAt || getFallbackEndsAt(startsAtIso);

  const startDateLabel = formatDateLabel(startsAtIso);
  const endDateLabel = endsAtIso ? formatDateLabel(endsAtIso) : undefined;
  const dateEndLabel = endDateLabel && endDateLabel !== startDateLabel ? endDateLabel : undefined;

  const timeLabel = formatTimeLabel(startsAtIso, raw.isAllDay);
  const timeEndLabel = endsAtIso && !raw.isAllDay ? formatTimeLabel(endsAtIso) : undefined;

  let finalTag = tagOverride ?? categoryTag;
  let finalTagTone: "gold" | "teal" | "pink" = categoryTagTone;

  if (isFeatured) {
    finalTag = "FEATURED TONIGHT";
    finalTagTone = "gold";
  } else if (tagOverride === "IN PROGRESS") {
    finalTag = "IN PROGRESS";
    finalTagTone = "gold";
  } else if (tagOverride === "PAST") {
    finalTag = "PAST";
    finalTagTone = "pink";
  }

  return {
    id: raw.id,
    title: raw.title ?? "",
    titlePrefix: prefix,
    titleHighlight: highlight,
    location: raw.location ?? "",
    dateLabel: startDateLabel,
    dateEndLabel,
    timeLabel,
    timeEndLabel,
    description: raw.description,
    tag: finalTag,
    tagTone: finalTagTone,
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
 * Categorizes a flat list of raw events into Featured, In Progress (started but not ended),
 * Upcoming (starting date has not passed yet), and Past sections.
 */
export function groupFlatEvents(
  rawEvents: MemberEventRaw[],
  refDate: Date = new Date(),
) {
  const getEventDates = (r: MemberEventRaw) => {
    const dStart = parseEventDate(r.startsAt);
    let dEnd = parseEventDate(r.endsAt);
    if (!dEnd && dStart) {
      dEnd = new Date(dStart.getTime() + 2 * 3600 * 1000);
    }
    return { dStart, dEnd };
  };

  const isEventPast = (r: MemberEventRaw) => {
    const { dEnd } = getEventDates(r);
    if (!dEnd) return false;
    return dEnd.getTime() < refDate.getTime();
  };

  const isEventInProgress = (r: MemberEventRaw) => {
    const { dStart, dEnd } = getEventDates(r);
    if (!dStart || !dEnd) return false;
    const refTs = refDate.getTime();
    return dStart.getTime() <= refTs && dEnd.getTime() >= refTs;
  };

  const isEventUpcoming = (r: MemberEventRaw) => {
    const { dStart } = getEventDates(r);
    if (!dStart) return false;
    return dStart.getTime() > refDate.getTime();
  };

  // Hero selection: ONLY pick an event that is actually UPCOMING (startsAt > now)
  const heroRaw =
    rawEvents.find((r) => r.isFeatured && isEventUpcoming(r)) ??
    rawEvents.find((r) => isEventUpcoming(r)) ??
    rawEvents.find((r) => isEventInProgress(r)) ??
    rawEvents[0];

  const heroIsPast = heroRaw ? isEventPast(heroRaw) : false;
  const heroIsInProgress = heroRaw ? isEventInProgress(heroRaw) : false;
  const heroIsUpcoming = heroRaw ? isEventUpcoming(heroRaw) : false;

  const heroEvent = heroRaw
    ? mapMemberEventRaw(
        heroRaw,
        heroIsUpcoming,
        heroIsInProgress ? "IN PROGRESS" : heroIsPast ? "PAST" : undefined,
      )
    : null;

  const featured = heroEvent && heroIsUpcoming ? [heroEvent] : [];

  const mapped = rawEvents.map((r) => {
    let tagOverride: string | undefined;
    if (isEventInProgress(r)) tagOverride = "IN PROGRESS";
    else if (isEventPast(r)) tagOverride = "PAST";
    return mapMemberEventRaw(r, false, tagOverride);
  });

  const gridEvents = mapped.filter((e) => e.id !== heroEvent?.id);

  const thisWeek: EventItem[] = []; // Holds IN PROGRESS events
  const nextMonth: EventItem[] = []; // Empty
  const otherUpcoming: EventItem[] = []; // Holds UPCOMING events (startsAt > refDate)
  const past: EventItem[] = []; // Holds PAST events

  if (heroEvent && heroIsPast) {
    past.push(heroEvent);
  }

  for (const e of gridEvents) {
    const rawEvent = rawEvents.find((r) => r.id === e.id);
    if (!rawEvent) {
      otherUpcoming.push(e);
      continue;
    }

    if (isEventPast(rawEvent)) {
      past.push(e);
    } else if (isEventInProgress(rawEvent)) {
      thisWeek.push(e);
    } else if (isEventUpcoming(rawEvent)) {
      otherUpcoming.push(e);
    } else {
      otherUpcoming.push(e);
    }
  }

  const sortByDate = (a: EventItem, b: EventItem) => {
    const rA = rawEvents.find((r) => r.id === a.id);
    const rB = rawEvents.find((r) => r.id === b.id);
    const dateA = parseEventDate(rA?.startsAt);
    const dateB = parseEventDate(rB?.startsAt);
    const tA = dateA ? dateA.getTime() : 0;
    const tB = dateB ? dateB.getTime() : 0;
    return tA - tB;
  };

  thisWeek.sort(sortByDate);
  otherUpcoming.sort(sortByDate);
  past.sort((a, b) => {
    const rA = rawEvents.find((r) => r.id === a.id);
    const rB = rawEvents.find((r) => r.id === b.id);
    const dateA = parseEventDate(rA?.startsAt);
    const dateB = parseEventDate(rB?.startsAt);
    const tA = dateA ? dateA.getTime() : 0;
    const tB = dateB ? dateB.getTime() : 0;
    return tB - tA;
  });

  return {
    featured,
    thisWeek,
    nextMonth,
    otherUpcoming,
    past,
  };
}
