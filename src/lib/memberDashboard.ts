import type {
  AuthProfileData,
  ClubhouseOverviewData,
  ClubhouseSpaceRaw,
  InboxNotificationRaw,
  MemberDashboardEventRaw,
  MemberDashboardGarageVehicleRaw,
  MemberDashboardQuickActionRaw,
  MemberDashboardReservationRaw,
  MemberDashboardSummaryData,
  NotificationInboxData,
} from "@/types/api";
import type {
  MemberActivityItem,
  MemberDashboardData,
  MemberDiaryEvent,
  MemberKpi,
  MemberNewsItem,
  MemberVehicleItem,
} from "@/components/member/dashboard/types";
import { memberDashboardMock } from "@/components/member/dashboard/mockData";
import { mapInboxNotification } from "@/lib/notifications";

export type MemberQuickActionView = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

const QUICK_ACTION_META: Record<
  string,
  { href: string; subtitle: string }
> = {
  garage: { href: "/member/garage", subtitle: "View Collection" },
  detailing: { href: "/member/concierge", subtitle: "Detailing & Wash" },
  maintenance: { href: "/member/concierge", subtitle: "Maintenance" },
  transport: { href: "/member/concierge", subtitle: "Transport" },
  sourcing: { href: "/member/marketplace", subtitle: "Find Rare Cars" },
};

const EVENT_TAG_TONES = ["gold", "teal", "pink"] as const;

function extractNotifications(data?: NotificationInboxData | null): InboxNotificationRaw[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  for (const key of ["items", "notifications", "records", "data", "inbox"] as const) {
    const value = data[key];
    if (Array.isArray(value)) return value;
  }

  return [];
}

function resolveMemberName(profile?: AuthProfileData | null): string {
  return (
    profile?.fullName?.trim() ||
    profile?.displayName?.trim() ||
    profile?.name?.trim() ||
    "Member"
  );
}

function resolveMemberNumber(profile?: AuthProfileData | null): string {
  if (profile?.memberNumberLabel?.trim()) {
    return profile.memberNumberLabel.trim();
  }

  if (profile?.memberNumber?.trim()) {
    const raw = profile.memberNumber.trim();
    // If it looks like a UUID (contains hyphens and is long), show only first 8 chars
    const isUuid = raw.length > 12 && raw.includes("-");
    const display = isUuid ? raw.slice(0, 8).toUpperCase() : raw;
    return `No. ${display}`;
  }

  return "—";
}

function resolveMembershipTier(profile?: AuthProfileData | null): string {
  return (
    profile?.membershipTierLabel?.trim() ||
    profile?.membershipTier?.trim() ||
    profile?.tier?.trim() ||
    "Member"
  );
}

function resolveMemberSince(profile?: AuthProfileData | null): string {
  if (!profile?.memberSince) {
    return "—";
  }

  const date = new Date(profile.memberSince);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return `Since ${date.getFullYear()}`;
}

function formatRelativeTime(value?: string): string {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatEventDateParts(startsAt?: string) {
  const date = startsAt ? new Date(startsAt) : null;
  const valid = date && !Number.isNaN(date.getTime()) ? date : new Date();

  const monthLabel = valid
    .toLocaleDateString("en-GB", { month: "short" })
    .toUpperCase();
  const dayLabel = String(valid.getDate()).padStart(2, "0");
  const dayName = valid
    .toLocaleDateString("en-GB", { weekday: "short" })
    .toUpperCase();

  return {
    monthLabel,
    dayLabel,
    dateLabel: `${dayLabel} ${monthLabel}`,
    dateShort: `${dayName} ${dayLabel} ${monthLabel}`,
    dayName,
    time: valid.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };
}

function resolveEventTag(event: MemberDashboardEventRaw, index: number) {
  if (event.isFeatured) {
    return { tag: "FEATURED", tagTone: "gold" as const };
  }

  if (event.isJoined || event.myRsvp) {
    return { tag: "CONFIRMED", tagTone: "teal" as const };
  }

  const tones = EVENT_TAG_TONES[index % EVENT_TAG_TONES.length];
  return { tag: "UPCOMING", tagTone: tones };
}

function formatMileageLabel(mileage?: string | null): string | undefined {
  if (!mileage) return undefined;
  const raw = String(mileage).trim();
  // If backend already formatted it (e.g. "8412 km") just return it.
  if (raw) return raw;
  return undefined;
}

function formatInspectedDate(dateStr?: string | null): string | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapVehicle(
  vehicle: MemberDashboardGarageVehicleRaw,
): MemberVehicleItem {
  const name =
    vehicle.displayName?.trim() ||
    [vehicle.make, vehicle.model].filter(Boolean).join(" ").trim() ||
    "Vehicle";

  const plateParts = [vehicle.year, vehicle.colour, vehicle.storageBay]
    .filter(Boolean)
    .map(String);

  return {
    id: String(vehicle.id ?? name),
    name,
    plate: plateParts.join(" · ") || "—",
    status: vehicle.statusKey || vehicle.status || "ready",
    statusLabel: vehicle.statusLabel || "Ready",
    imageUrl: vehicle.imageUrl || undefined,
    year: vehicle.year ? String(vehicle.year) : undefined,
    bay: vehicle.storageBay || undefined,
    engine: vehicle.engine || undefined,
    odometer: formatMileageLabel(vehicle.mileage),
    inspected: formatInspectedDate(vehicle.lastServicedAt),
  };
}

function mapDiaryEvent(
  event: MemberDashboardEventRaw,
  index: number,
): MemberDiaryEvent {
  const dateParts = formatEventDateParts(event.startsAt);
  const { tag, tagTone } = resolveEventTag(event, index);

  return {
    id: String(event.id ?? `${event.title}-${index}`),
    title: event.title?.trim() || "Event",
    location: event.location?.trim() || "—",
    dateLabel: dateParts.dateLabel,
    monthLabel: dateParts.monthLabel,
    dayLabel: dateParts.dayLabel,
    dayName: dateParts.dayName,
    dateShort: dateParts.dateShort,
    time: dateParts.time,
    attendingCount: event.attendingCount,
    attendingMembers: event.attendingMembers,
    userStatus: event.isJoined || event.myRsvp ? "going" : null,
    tag,
    tagTone,
    imageUrl: event.imageUrl || undefined,
    isFeatured: Boolean(event.isFeatured),
    status: event.status || "upcoming",
  };
}

function dedupeEvents(events: MemberDashboardEventRaw[]): MemberDashboardEventRaw[] {
  const seen = new Set<string>();

  return events.filter((event) => {
    const key = String(event.id ?? event.title ?? "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mapKpis(
  dashboard?: MemberDashboardSummaryData | null,
  profile?: AuthProfileData | null,
): MemberKpi[] {
  const stats = dashboard?.stats;
  const memberDays = profile?.memberDays ?? profile?.stats?.memberDays ?? 0;
  const featuredCount = dashboard?.events?.featured?.length ?? 0;
  const weekCount = dashboard?.events?.thisWeek?.length ?? 0;
  const upcomingEvents = featuredCount + weekCount;
  const tierLabel = resolveMembershipTier(profile);

  return [
    {
      label: "Vehicles",
      value: String(stats?.vehicles ?? profile?.stats?.vehicles ?? profile?.stats?.vehicleCount ?? 0),
      subtext: "In storage",
      iconKey: "vehicles",
      tone: "gold",
    },
    {
      label: "Active Requests",
      value: String(stats?.activeBookings ?? profile?.stats?.activeBookings ?? 0),
      subtext: "In progress",
      iconKey: "requests",
    },
    {
      label: "Upcoming Events",
      value: String(upcomingEvents),
      subtext: upcomingEvents === 1 ? "This week" : "Pending",
      iconKey: "events",
    },
    {
      label: "Days as Member",
      value: String(memberDays),
      subtext: tierLabel,
      iconKey: "days",
    },
  ];
}

function mapNewsItems(notifications: InboxNotificationRaw[]): MemberNewsItem[] {
  const bulletins = notifications.filter(
    (item) => item.type === "bulletin",
  );
  return bulletins.slice(0, 3).map((item, index) => {
    const mapped = mapInboxNotification(item);
    const title = mapped?.title || "Notification";
    const subtitle = mapped?.subheading || "";

    return {
      id: mapped?.id || String(index),
      title,
      subtitle,
      timeLabel: formatRelativeTime(item.createdAt),
      category: item.type?.toUpperCase() || "NEWS",
      isUnread: mapped ? !mapped.read : false,
      // imageUrl intentionally omitted — no image data in notification inbox
    };
  });
}

function mapActivityItems(
  notifications: InboxNotificationRaw[],
  reservations?: MemberDashboardReservationRaw[],
): MemberActivityItem[] {
  const items: MemberActivityItem[] = [];

  // Map reservations first — they're the most relevant new activity
  for (const res of reservations ?? []) {
    const areaLabel = (res.areaTitle || res.areaType || "Clubhouse")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const statusLabel =
      res.status === "confirmed"
        ? "Confirmed"
        : res.status === "pending"
          ? "Pending Confirmation"
          : res.status
              ? res.status.charAt(0).toUpperCase() + res.status.slice(1)
              : "Submitted";

    const guestLine = res.guests
      ? `${res.guests} guest${res.guests !== 1 ? "s" : ""}`
      : "";
    const slotLine = res.timeSlot ? ` · ${res.timeSlot}` : "";

    items.push({
      id: `res-${res.id ?? res.referenceNumber ?? items.length}`,
      title: `Clubhouse — ${areaLabel}`,
      titlePrefix: "Clubhouse",
      titleHighlight: areaLabel,
      detail: `${guestLine}${slotLine} · ${statusLabel}`,
      timeLabel: formatRelativeTime(res.confirmedAt ?? res.createdAt),
      tone: "gold",
    });
  }

  // Fill remaining slots from notifications
  const remaining = Math.max(0, 4 - items.length);
  for (const item of notifications.slice(0, remaining)) {
    const mapped = mapInboxNotification(item);
    const idx = items.length;
    items.push({
      id: mapped?.id || String(idx),
      title: mapped?.title || "Activity",
      detail: mapped?.subheading || "",
      timeLabel: formatRelativeTime(item.createdAt),
      tone: idx % 2 === 0 ? "gold" : "default",
    });
  }

  return items.slice(0, 4);
}

// ── Clubhouse venues ─────────────────────────────────────────────────────────

const CLUB_AREA_ORDER = ["private_lounge", "suite_lounge", "restaurant"] as const;

const CLUB_VENUE_FALLBACK_IMAGES: Record<
  "clubhouse" | "lounge" | "suites",
  string
> = {
  clubhouse:
    memberDashboardMock.clubVenues.find((v) => v.iconKey === "clubhouse")
      ?.imageUrl ??
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85",
  lounge:
    memberDashboardMock.clubVenues.find((v) => v.iconKey === "lounge")
      ?.imageUrl ??
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=85",
  suites:
    memberDashboardMock.clubVenues.find((v) => v.iconKey === "suites")
      ?.imageUrl ??
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85",
};

function resolveClubVenueImageUrl(
  space: ClubhouseSpaceRaw,
  iconKey: "clubhouse" | "lounge" | "suites",
): string {
  return (
    space.coverImage?.trim() ||
    space.images?.find((image) => image?.trim())?.trim() ||
    CLUB_VENUE_FALLBACK_IMAGES[iconKey]
  );
}

function sortClubSpaces(spaces: ClubhouseSpaceRaw[]): ClubhouseSpaceRaw[] {
  return [...spaces].sort((a, b) => {
    const aIndex = CLUB_AREA_ORDER.indexOf(a.areaType as (typeof CLUB_AREA_ORDER)[number]);
    const bIndex = CLUB_AREA_ORDER.indexOf(b.areaType as (typeof CLUB_AREA_ORDER)[number]);
    const safeA = aIndex === -1 ? CLUB_AREA_ORDER.length : aIndex;
    const safeB = bIndex === -1 ? CLUB_AREA_ORDER.length : bIndex;
    return safeA - safeB;
  });
}

function resolveVenueIconKey(
  areaType: string,
): "clubhouse" | "lounge" | "suites" {
  if (areaType === "private_lounge") return "lounge";
  if (areaType === "suite_lounge") return "suites";
  return "clubhouse";
}

function resolveVenueFooter(space: ClubhouseSpaceRaw): string | undefined {
  if (space.areaType === "restaurant") {
    // Show service hours e.g. "10:00 – 22:00"
    if (space.openingTime && space.closingTime) {
      return `${space.openingTime} – ${space.closingTime}`;
    }
    if (space.capacity) return `Cap. ${space.capacity}`;
  }

  if (space.areaType === "suite_lounge") {
    // Show room count e.g. "4 ROOMS"
    if (space.roomCount) {
      return `${space.roomCount} ROOM${space.roomCount !== 1 ? "S" : ""}`;
    }
    if (space.capacity) return `Cap. ${space.capacity}`;
  }

  if (space.areaType === "private_lounge") {
    // Show 24/7 status or capacity e.g. "OPEN 24/7"
    if (space.isAvailable24x7) return "OPEN 24/7";
    if (space.capacity) return `Cap. ${space.capacity}`;
  }

  // Generic fallback
  if (space.openingTime && space.closingTime) {
    return `${space.openingTime} – ${space.closingTime}`;
  }
  if (space.roomCount) return `${space.roomCount} ROOM${space.roomCount !== 1 ? "S" : ""}`;
  if (space.capacity) return `Cap. ${space.capacity}`;
  return undefined;
}

export function buildClubStatusLine(clubhouse?: ClubhouseOverviewData | null): string {
  // No API data — show generic fallback
  if (!clubhouse) return "Available to Book";

  const { counts, totalSpaces, name } = clubhouse;

  const parts: string[] = [];

  // Venue name from API (e.g. "The Club")
  if (name?.trim() && name.trim().toLowerCase() !== "the club") {
    parts.push(name.trim());
  }

  // Space type counts e.g. "1 Restaurant · 2 Lounges · 4 Suites"
  const spaceParts: string[] = [];
  if (counts.restaurant > 0) {
    spaceParts.push(`${counts.restaurant} Restaurant${counts.restaurant !== 1 ? "s" : ""}`);
  }
  if (counts.privateLounge > 0) {
    spaceParts.push(`${counts.privateLounge} Lounge${counts.privateLounge !== 1 ? "s" : ""}`);
  }
  if (counts.suiteLounge > 0) {
    spaceParts.push(`${counts.suiteLounge} Suite${counts.suiteLounge !== 1 ? "s" : ""}`);
  }

  if (spaceParts.length > 0) {
    parts.push(spaceParts.join(" · "));
  } else if (totalSpaces > 0) {
    parts.push(`${totalSpaces} Space${totalSpaces !== 1 ? "s" : ""}`);
  }

  parts.push("Available to Book");

  return parts.join(" · ");
}

export function mapClubVenues(
  clubhouse?: ClubhouseOverviewData | null,
  limit?: number
): import("@/components/member/dashboard/types").MemberClubVenue[] {
  if (!clubhouse?.spaces?.length) {
    // No spaces seeded yet — return empty so static layout falls through in the UI
    return [];
  }

  // Group by areaType and pick one representative space per group
  // (the dashboard shows one card per area type, not one per space)
  const grouped = new Map<string, ClubhouseSpaceRaw>();
  for (const space of sortClubSpaces(clubhouse.spaces)) {
    if (!grouped.has(space.areaType)) {
      grouped.set(space.areaType, space);
    }
  }

  const representatives = Array.from(grouped.values());
  const sliced = limit !== undefined ? representatives.slice(0, limit) : representatives;

  return sliced.map((space) => {
    const iconKey = resolveVenueIconKey(space.areaType);

    return {
      id: String(space.id),
      name: space.title,
      description: space.description ?? "",
      imageUrl: resolveClubVenueImageUrl(space, iconKey),
      tag: space.statusLabel?.toUpperCase() ?? "OPEN",
      tagTone: "gold" as const,
      iconKey,
      footerLeft: resolveVenueFooter(space),
      actionLabel: (space.action ?? "RESERVE").toUpperCase(),
      href: `/member/concierge?space=${space.id}`,
    };
  });
}

export function mapQuickActions(
  actions?: MemberDashboardQuickActionRaw[],
): MemberQuickActionView[] {
  return [
    { id: "garage", title: "Garage", subtitle: "View Collection", href: "/member/garage" },
    { id: "concierge", title: "Concierge", subtitle: "Contact James", href: "/member/concierge" },
    { id: "book", title: "Book", subtitle: "Reserve a spot", href: "/member/concierge" },
    { id: "sourcing", title: "Source", subtitle: "Find Rare Cars", href: "/member/garage" },
  ];
}

function createEmptyMemberDashboardData(): MemberDashboardData {
  return {
    memberName: "Member",
    memberNumber: "—",
    membershipTier: "Member",
    memberSince: "—",
    kpis: mapKpis(),
    vehicles: [],
    diary: [],
    clubVenues: memberDashboardMock.clubVenues,
    clubStatusLine: memberDashboardMock.clubStatusLine,
    news: [],
    recentActivity: [],
  };
}

export function mapMemberDashboard(
  dashboard?: MemberDashboardSummaryData | null,
  profile?: AuthProfileData | null,
  inbox?: NotificationInboxData | null,
  clubhouse?: ClubhouseOverviewData | null,
): MemberDashboardData {
  const notifications = extractNotifications(inbox);
  const events = dedupeEvents([
    ...(dashboard?.events?.featured ?? []),
    ...(dashboard?.events?.thisWeek ?? []),
  ]);

  const vehicles = (dashboard?.garage?.vehicles ?? []).map(mapVehicle);
  const diary = events.map(mapDiaryEvent);
  const news = mapNewsItems(notifications);
  const recentActivity = mapActivityItems(notifications, dashboard?.recentReservations);
  const clubVenues = mapClubVenues(clubhouse, 3);
  const clubStatusLine = buildClubStatusLine(clubhouse);

  return {
    memberName: resolveMemberName(profile),
    memberNumber: resolveMemberNumber(profile),
    membershipTier: resolveMembershipTier(profile),
    memberSince: resolveMemberSince(profile),
    kpis: mapKpis(dashboard, profile),
    vehicles,
    diary,
    clubVenues,
    clubStatusLine,
    news,
    recentActivity,
  };
}

export function createEmptyMemberDashboard(): MemberDashboardData {
  return createEmptyMemberDashboardData();
}
