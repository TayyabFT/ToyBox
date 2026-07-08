import type { AdminBookingRaw } from "@/types/api";
import { confirmationStats as fallbackStats } from "@/components/admin/confirmations/mockData";
import type {
  BookingItem,
  CompletedTodayItem,
  ConfirmationBadgeTone,
  ConfirmationStatItem,
  PendingBookingItem,
} from "@/components/admin/confirmations/types";
import { mapConfirmationSummary } from "@/lib/confirmations";

function formatApiDate(value?: string): string {
  if (!value?.trim()) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.trim().toUpperCase();
  }

  return date
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

function formatDateRange(start?: string, end?: string): string {
  const formattedStart = formatApiDate(start);
  const formattedEnd = formatApiDate(end);

  if (formattedStart === "—" && formattedEnd === "—") {
    return "—";
  }

  if (formattedStart === formattedEnd || formattedEnd === "—") {
    return formattedStart;
  }

  if (formattedStart === "—") {
    return formattedEnd;
  }

  return `${formattedStart} – ${formattedEnd}`;
}

function getAdminBookingVehicle(item: AdminBookingRaw): string {
  return (
    item.vehicle?.displayName?.trim() ||
    [item.vehicle?.make, item.vehicle?.model].filter(Boolean).join(" ").trim() ||
    "—"
  );
}

function getAdminBookingSchedule(
  item: AdminBookingRaw,
  fallbackDate?: string,
): string {
  const preferredDates =
    item.preferredDates && typeof item.preferredDates === "object"
      ? item.preferredDates
      : undefined;

  const schedule = formatDateRange(
    preferredDates?.start || item.offerStartDate,
    preferredDates?.end || item.offerEndDate,
  );

  if (schedule !== "—") {
    return schedule;
  }

  if (fallbackDate) {
    return formatApiDate(fallbackDate);
  }

  return "—";
}

function mapAdminPendingStatus(item: AdminBookingRaw): ConfirmationBadgeTone {
  const status = `${item.confirmationStatus ?? ""} ${item.status ?? ""}`
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");

  if (status.includes("sign-off") || status.includes("signoff")) {
    return "sign-off";
  }

  return "awaiting";
}

function getPendingBookingIcon(item: AdminBookingRaw): "check" | "car" | "circle" {
  if (item.vehicle?.imageUrl?.trim()) {
    return "car";
  }

  return "circle";
}

export function mapAdminConfirmationStats(data: unknown): ConfirmationStatItem[] {
  const summary = mapConfirmationSummary(data);

  return [
    {
      label: fallbackStats[0].label,
      value: summary.pendingConfirm.value,
      subtext: summary.pendingConfirm.subtext,
    },
    {
      label: fallbackStats[1].label,
      value: summary.signOffQueue.value,
      subtext: summary.signOffQueue.subtext,
    },
    {
      label: fallbackStats[2].label,
      value: summary.completedToday.value,
      subtext: summary.completedToday.subtext,
      accent: "teal",
    },
    {
      label: fallbackStats[3].label,
      value: summary.shiftProgress.value,
      subtext: summary.shiftProgress.subtext,
    },
  ];
}

export function mapAdminPendingBookings(
  bookings: AdminBookingRaw[] | undefined,
): PendingBookingItem[] {
  return (bookings ?? []).map((item, index) => ({
    id: String(item.id ?? item.sourcingRequestId ?? ""),
    index: index + 1,
    title: getAdminBookingVehicle(item),
    bookingRef: item.referenceNumber?.trim() || "—",
    staff: item.member?.name?.trim().toUpperCase() || "—",
    bay: "—",
    price: "—",
    status: mapAdminPendingStatus(item),
    icon: getPendingBookingIcon(item),
  }));
}

export function mapAdminConfirmedBookings(
  bookings: AdminBookingRaw[] | undefined,
): BookingItem[] {
  return (bookings ?? []).map((item) => ({
    id: String(item.id ?? item.sourcingRequestId ?? ""),
    vehicle: getAdminBookingVehicle(item),
    reference: item.referenceNumber?.trim() || "—",
    member: item.member?.name?.trim().toUpperCase() || "—",
    schedule: getAdminBookingSchedule(item),
    status: "confirmed" as ConfirmationBadgeTone,
  }));
}

export function mapAdminInReviewBookings(bookings: AdminBookingRaw[] | undefined) {
  return (bookings ?? []).map((item) => ({
    id: String(item.id ?? item.sourcingRequestId ?? ""),
    vehicle: getAdminBookingVehicle(item),
    member: item.member?.name?.trim().toUpperCase() || "—",
    schedule: getAdminBookingSchedule(item, item.assignedAt),
  }));
}

export function mapAdminCompletedToday(
  bookings: AdminBookingRaw[] | undefined,
): CompletedTodayItem[] {
  return (bookings ?? []).map((item) => {
    const confirmedAt = item.confirmedAt
      ? new Date(item.confirmedAt).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "—";

    return {
      id: String(item.id ?? item.sourcingRequestId ?? ""),
      title: getAdminBookingVehicle(item),
      bookingRef: item.referenceNumber?.trim() || "—",
      confirmedAt,
      assignee: item.member?.name?.trim().toUpperCase() || "—",
    };
  });
}

export function getAdminInReviewCount(data: unknown): number {
  if (!data || typeof data !== "object") {
    return 0;
  }

  const record = data as Record<string, unknown>;
  const inReviewBookings = record.inReviewBookings;

  if (Array.isArray(inReviewBookings) && inReviewBookings.length > 0) {
    return inReviewBookings.length;
  }

  const summary = record.summary as { inReview?: { value?: number } } | undefined;

  return summary?.inReview?.value ?? 0;
}

export function createEmptyAdminConfirmationStats(): ConfirmationStatItem[] {
  return fallbackStats.map((stat, index) => ({
    ...stat,
    value: index === 3 ? "0%" : "0",
  }));
}
