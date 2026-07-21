import { hasResourceId, toResourceId } from "@/lib/resourceId";
import type {
  AdminBookingRaw,
  SourcingRequestRaw,
  SourcingSummary,
  SourcingSummaryStat,
} from "@/types/api";
import type {
  ConfirmationBadgeTone,
  ConfirmationRequestItem,
  ConfirmationStatsDisplay,
} from "@/components/staff/confirmations/types";
import { confirmationStats as fallbackStats } from "@/components/staff/confirmations/mockData";

function extractSourcingRequests(data: unknown): SourcingRequestRaw[] {
  if (Array.isArray(data)) {
    return data as SourcingRequestRaw[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;

  for (const key of ["requests", "items", "records", "data"]) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value as SourcingRequestRaw[];
    }
  }

  return [];
}

function mapSummaryStat(
  stat: SourcingSummaryStat | undefined,
  fallback: { label: string; value: string; subtext: string },
  formatValue?: (value: number) => string,
): { label: string; value: string; subtext: string } {
  if (!stat) {
    return {
      label: fallback.label,
      value: formatValue ? formatValue(0) : "0",
      subtext: fallback.subtext,
    };
  }

  const value = stat.value ?? 0;

  return {
    label: fallback.label,
    value: formatValue ? formatValue(value) : String(value),
    subtext: stat.subtitle?.trim() || fallback.subtext,
  };
}

export function mapConfirmationSummary(data: unknown): ConfirmationStatsDisplay {
  if (!data || typeof data !== "object") {
    return createEmptyConfirmationStats();
  }

  const summary = (data as Record<string, unknown>).summary as
    | SourcingSummary
    | undefined;

  if (!summary) {
    return createEmptyConfirmationStats();
  }

  return {
    pendingConfirm: mapSummaryStat(summary.pendingConfirm, fallbackStats[0]),
    signOffQueue: mapSummaryStat(summary.signOffQueue, fallbackStats[1]),
    completedToday: mapSummaryStat(summary.completedToday, fallbackStats[2]),
    shiftProgress: mapSummaryStat(
      summary.shiftProgress,
      fallbackStats[3],
      (value) => `${value}%`,
    ),
  };
}

function getVehicleTitle(item: SourcingRequestRaw): string {
  const pendingOffer =
    item.pendingOffer && typeof item.pendingOffer === "object"
      ? item.pendingOffer
      : null;

  if (pendingOffer?.vehicle) {
    const { make, model, year } = pendingOffer.vehicle;
    const title = [make, model].filter(Boolean).join(" ").trim();

    if (title && year) {
      return `${title}`;
    }

    return title || "Vehicle offer";
  }

  const matchedVehicle = item.matches?.find((match) => match.make || match.model);

  if (matchedVehicle) {
    const title = [matchedVehicle.make, matchedVehicle.model]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (title) {
      return title;
    }
  }

  const title = [item.make, item.model].filter(Boolean).join(" ").trim();
  return title || `Request #${item.id ?? "—"}`;
}

function formatSchedule(item: SourcingRequestRaw): string {
  if (item.timelineNotes?.trim()) {
    return item.timelineNotes.trim().toUpperCase();
  }

  if (!item.createdAt) {
    return "—";
  }

  const date = new Date(item.createdAt);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

function mapConfirmationTone(status?: string): ConfirmationBadgeTone {
  const normalized = status?.trim().toLowerCase().replace(/_/g, "-") ?? "";

  if (normalized.includes("completed") || normalized.includes("confirmed")) {
    return "confirmed";
  }

  if (normalized.includes("review")) {
    return "in-review";
  }

  if (normalized.includes("sign-off") || normalized.includes("signoff")) {
    return "sign-off";
  }

  return "pending";
}

export function mapSourcingRequest(
  item: SourcingRequestRaw,
): ConfirmationRequestItem | null {
  if (item.id === undefined || item.id === null) {
    return null;
  }

  const memberName =
    item.member?.name?.trim() ||
    (item.memberId ? `Member #${item.memberId}` : "Member");

  const memberId = item.member?.id ?? item.memberId;

  return {
    id: String(item.id),
    vehicle: getVehicleTitle(item),
    reference: item.referenceNumber?.trim() || `SRC-${item.id}`,
    member: memberName.toUpperCase(),
    memberId: hasResourceId(memberId) ? toResourceId(memberId) : "",
    memberName,
    schedule: formatSchedule(item),
    status: mapConfirmationTone(item.confirmationStatus),
    confirmationStatus: item.confirmationStatus?.trim().toLowerCase() ?? "",
    showOfferVehicle: Boolean(item.canOfferVehicle),
  };
}

export function mapSourcingRequests(data: unknown): ConfirmationRequestItem[] {
  return extractSourcingRequests(data)
    .map(mapSourcingRequest)
    .filter((item): item is ConfirmationRequestItem => item !== null);
}

export function splitConfirmationRequests(
  requests: ConfirmationRequestItem[],
): {
  pending: ConfirmationRequestItem[];
  inReview: ConfirmationRequestItem[];
  confirmed: ConfirmationRequestItem[];
  completed: ConfirmationRequestItem[];
} {
  const pending: ConfirmationRequestItem[] = [];
  const inReview: ConfirmationRequestItem[] = [];
  const confirmed: ConfirmationRequestItem[] = [];
  const completed: ConfirmationRequestItem[] = [];

  for (const request of requests) {
    const status = request.confirmationStatus;

    if (status === "completed") {
      completed.push(request);
      continue;
    }

    if (status === "confirmed") {
      confirmed.push(request);
      continue;
    }

    if (status === "in_review" || status === "in-review") {
      inReview.push(request);
      continue;
    }

    pending.push(request);
  }

  return { pending, inReview, confirmed, completed };
}

export function createEmptyConfirmationStats(): ConfirmationStatsDisplay {
  return {
    pendingConfirm: { ...fallbackStats[0], value: "0" },
    signOffQueue: { ...fallbackStats[1], value: "0" },
    completedToday: { ...fallbackStats[2], value: "0" },
    shiftProgress: { ...fallbackStats[3], value: "0%" },
  };
}

// ── Per-section booking mapping (dedicated section arrays) ──────────────────
//
// The staff sourcing-requests endpoint now returns each section's bookings
// as its own array (pendingBookings / inReviewBookings / confirmedBookings /
// completedTodayBookings) alongside the combined `requests` list. The panels
// below are mapped straight from these section arrays instead of splitting
// the combined list client-side.

function getBookingVehicleTitle(item: AdminBookingRaw): string {
  const vehicle = item.vehicle;

  if (vehicle && typeof vehicle === "object") {
    const title =
      vehicle.displayName?.trim() ||
      [vehicle.make, vehicle.model].filter(Boolean).join(" ").trim();

    if (title) return title;
  }

  return "Vehicle offer pending";
}

function formatBookingApiDate(value?: string): string {
  if (!value?.trim()) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value.trim().toUpperCase();

  return date
    .toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    .toUpperCase();
}

function formatBookingSchedule(item: AdminBookingRaw, fallbackDate?: string): string {
  const preferredDates =
    item.preferredDates && typeof item.preferredDates === "object"
      ? item.preferredDates
      : undefined;

  const start = formatBookingApiDate(preferredDates?.start || item.offerStartDate);
  const end = formatBookingApiDate(preferredDates?.end || item.offerEndDate);

  if (start && end && start !== end) return `${start} – ${end}`;
  if (start) return start;
  if (end) return end;

  return formatBookingApiDate(fallbackDate) || "—";
}

function mapBookingItem(
  item: AdminBookingRaw,
  options: { showOfferVehicle: boolean; fallbackDate?: string },
): ConfirmationRequestItem | null {
  const id = item.id ?? item.sourcingRequestId;

  if (id === undefined || id === null) return null;

  const memberName = item.member?.name?.trim() || "Member";
  const memberId = item.member?.id;

  return {
    id: String(id),
    vehicle: getBookingVehicleTitle(item),
    reference: item.referenceNumber?.trim() || `SRC-${id}`,
    member: memberName.toUpperCase(),
    memberId: hasResourceId(memberId) ? toResourceId(memberId) : "",
    memberName,
    schedule: formatBookingSchedule(item, options.fallbackDate),
    status: mapConfirmationTone(item.confirmationStatus),
    confirmationStatus: item.confirmationStatus?.trim().toLowerCase() ?? "",
    showOfferVehicle: options.showOfferVehicle,
  };
}

export function mapConfirmationPendingBookings(
  bookings: AdminBookingRaw[] | undefined,
): ConfirmationRequestItem[] {
  return (bookings ?? [])
    .map((item) =>
      mapBookingItem(item, { showOfferVehicle: true, fallbackDate: item.createdAt }),
    )
    .filter((item): item is ConfirmationRequestItem => item !== null);
}

export function mapConfirmationInReviewBookings(
  bookings: AdminBookingRaw[] | undefined,
): ConfirmationRequestItem[] {
  return (bookings ?? [])
    .map((item) =>
      mapBookingItem(item, { showOfferVehicle: false, fallbackDate: item.assignedAt }),
    )
    .filter((item): item is ConfirmationRequestItem => item !== null);
}

export function mapConfirmationConfirmedBookings(
  bookings: AdminBookingRaw[] | undefined,
): ConfirmationRequestItem[] {
  return (bookings ?? [])
    .map((item) =>
      mapBookingItem(item, { showOfferVehicle: false, fallbackDate: item.confirmedAt }),
    )
    .filter((item): item is ConfirmationRequestItem => item !== null);
}

export function mapConfirmationCompletedBookings(
  bookings: AdminBookingRaw[] | undefined,
): ConfirmationRequestItem[] {
  return (bookings ?? [])
    .map((item) =>
      mapBookingItem(item, { showOfferVehicle: false, fallbackDate: item.confirmedAt }),
    )
    .filter((item): item is ConfirmationRequestItem => item !== null);
}

export function getInReviewPendingCount(data: unknown): number {
  if (!data || typeof data !== "object") {
    return 0;
  }

  const summary = (data as Record<string, unknown>).summary as
    | SourcingSummary
    | undefined;

  return summary?.inReview?.value ?? 0;
}
