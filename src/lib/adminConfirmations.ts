import type { AdminInReviewBookingRaw, SourcingRequestRaw } from "@/types/api";
import { confirmationStats as fallbackStats } from "@/components/admin/confirmations/mockData";
import type {
  BookingItem,
  CompletedTodayItem,
  ConfirmationBadgeTone,
  ConfirmationStatItem,
  PendingBookingItem,
} from "@/components/admin/confirmations/types";
import {
  mapConfirmationSummary,
  mapSourcingRequest,
} from "@/lib/confirmations";

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

function mapAdminPendingStatus(item: SourcingRequestRaw): ConfirmationBadgeTone {
  const status = `${item.confirmationStatus ?? ""} ${item.status ?? ""}`
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");

  if (status.includes("sign-off") || status.includes("signoff")) {
    return "sign-off";
  }

  return "awaiting";
}

function getPendingBookingIcon(
  item: SourcingRequestRaw,
): "check" | "car" | "circle" {
  if (
    item.pendingOffer &&
    typeof item.pendingOffer === "object" &&
    item.pendingOffer.vehicle
  ) {
    return "car";
  }

  return "circle";
}

function isConfirmedRequest(item: SourcingRequestRaw): boolean {
  const status = `${item.confirmationStatus ?? ""} ${item.status ?? ""}`
    .trim()
    .toLowerCase();

  return status.includes("confirmed") || status.includes("completed");
}

function isCompletedTodayRequest(item: SourcingRequestRaw): boolean {
  const status = (item.confirmationStatus ?? item.status ?? "")
    .trim()
    .toLowerCase();

  return status.includes("completed");
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
  requests: SourcingRequestRaw[] | undefined,
): PendingBookingItem[] {
  return (requests ?? []).flatMap((item, index) => {
    const mapped = mapSourcingRequest(item);

    if (!mapped || isConfirmedRequest(item)) {
      return [];
    }

    return [
      {
        id: mapped.id,
        index: index + 1,
        title: mapped.vehicle,
        bookingRef: mapped.reference,
        staff: mapped.member,
        bay: "—",
        price: "—",
        status: mapAdminPendingStatus(item),
        icon: getPendingBookingIcon(item),
      },
    ];
  });
}

export function mapAdminConfirmedBookings(
  requests: SourcingRequestRaw[] | undefined,
): BookingItem[] {
  return (requests ?? [])
    .filter(isConfirmedRequest)
    .flatMap((item) => {
      const mapped = mapSourcingRequest(item);

      if (!mapped) {
        return [];
      }

      return [
        {
          id: mapped.id,
          vehicle: mapped.vehicle,
          reference: mapped.reference,
          member: mapped.member,
          schedule: mapped.schedule,
          status: "confirmed" as ConfirmationBadgeTone,
        },
      ];
    });
}

export function mapAdminInReviewBookings(
  bookings: AdminInReviewBookingRaw[] | undefined,
) {
  return (bookings ?? []).map((item) => {
    const preferredDates =
      item.preferredDates && typeof item.preferredDates === "object"
        ? item.preferredDates
        : undefined;

    const schedule = formatDateRange(
      preferredDates?.start || item.offerStartDate,
      preferredDates?.end || item.offerEndDate,
    );

    const vehicle =
      item.vehicle?.displayName?.trim() ||
      [item.vehicle?.make, item.vehicle?.model].filter(Boolean).join(" ").trim() ||
      "—";

    return {
      id: String(item.id ?? item.sourcingRequestId ?? ""),
      vehicle,
      member: item.member?.name?.trim().toUpperCase() || "—",
      schedule: schedule === "—" ? formatApiDate(item.assignedAt) : schedule,
    };
  });
}

export function mapAdminCompletedToday(
  requests: SourcingRequestRaw[] | undefined,
): CompletedTodayItem[] {
  return (requests ?? [])
    .filter(isCompletedTodayRequest)
    .flatMap((item) => {
      const mapped = mapSourcingRequest(item);

      if (!mapped) {
        return [];
      }

      const confirmedAt = item.createdAt
        ? new Date(item.createdAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "—";

      return [
        {
          id: mapped.id,
          title: mapped.vehicle,
          bookingRef: mapped.reference,
          confirmedAt,
          assignee: mapped.member,
        },
      ];
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
