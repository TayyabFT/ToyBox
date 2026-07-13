import type {
  AuthProfileData,
  ClubhouseOverviewData,
  ClubhouseSpaceRaw,
  InboxNotificationRaw,
  MemberDashboardEventRaw,
  MemberDashboardGarageVehicleRaw,
  MemberDashboardQuickActionRaw,
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
    return `No. ${profile.memberNumber.trim()}`;
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
  return notifications.slice(0, 3).map((item, index) => {
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
): MemberActivityItem[] {
  return notifications.slice(0, 4).map((item, index) => {
    const mapped = mapInboxNotification(item);
    const title = mapped?.title || "Activity";
    const detail = mapped?.subheading || "";

    return {
      id: mapped?.id || String(index),
      title,
      detail,
      timeLabel: formatRelativeTime(item.createdAt),
      tone: index % 2 === 0 ? "gold" : "default",
    };
  });
}

// ── Clubhouse venues ─────────────────────────────────────────────────────────

const CLUB_AREA_ORDER = ["restaurant", "private_lounge", "suite_lounge"] as const;

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
  if (space.openingTime && space.closingTime) {
    return `${space.openingTime} – ${space.closingTime}`;
  }
  if (space.capacity) return `Cap. ${space.capacity}`;
  if (space.roomCount) return `${space.roomCount} ROOMS`;
  return undefined;
}

export function buildClubStatusLine(clubhouse?: ClubhouseOverviewData | null): string {
  if (!clubhouse?.totalSpaces) {
    return memberDashboardMock.clubStatusLine ?? "Available to Book";
  }

  const { counts, totalSpaces } = clubhouse;
  const segments: string[] = [];

  if (counts.restaurant > 0) {
    segments.push(`${counts.restaurant} Restaurant${counts.restaurant !== 1 ? "s" : ""}`);
  }
  if (counts.privateLounge > 0) {
    segments.push(`${counts.privateLounge} Lounge${counts.privateLounge !== 1 ? "s" : ""}`);
  }
  if (counts.suiteLounge > 0) {
    segments.push(`${counts.suiteLounge} Suite${counts.suiteLounge !== 1 ? "s" : ""}`);
  }

  const summary =
    segments.length > 0
      ? segments.join(" · ")
      : `${totalSpaces} Space${totalSpaces !== 1 ? "s" : ""}`;

  return `${summary} · Available to Book`;
}

export function mapClubVenues(
  clubhouse?: ClubhouseOverviewData | null,
  limit?: number
): import("@/components/member/dashboard/types").MemberClubVenue[] {
  if (!clubhouse?.spaces?.length) {
    // Fallback to curated mock venues when DB has no spaces seeded yet
    return memberDashboardMock.clubVenues;
  }

  const spaces = sortClubSpaces(clubhouse.spaces);
  const sliced = limit !== undefined ? spaces.slice(0, limit) : spaces;

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
  const recentActivity = mapActivityItems(notifications);
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
