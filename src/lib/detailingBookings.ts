import type { AdminDetailingBookingRaw } from "@/types/api";
import { compareResourceIdsDesc } from "@/lib/resourceId";

export type DetailingBookingJobStatus =
  | "urgent"
  | "assigned"
  | "overdue"
  | "in-progress"
  | "pending"
  | "active";

export type DetailingBookingJob = {
  id: string;
  title: string;
  jobId: string;
  member: string;
  vehicle: string;
  status: DetailingBookingJobStatus;
  statusLabel: string;
  type: string;
  addOn?: string;
  estimate: string;
  scheduled?: string;
  bay?: string;
  location?: string;
  notes?: string;
  progress?: number;
  progressNote?: string;
  category: "detailing";
};

export type DetailingSectionMeta = {
  title: string;
  requestCount: number;
  highlightLabel: string;
};

function mapBookingStatus(status?: string): DetailingBookingJobStatus {
  const normalized = status?.trim().toLowerCase() ?? "";

  if (normalized.includes("progress")) return "in-progress";
  if (normalized.includes("urgent")) return "urgent";
  if (normalized.includes("overdue")) return "overdue";
  if (normalized.includes("assign")) return "assigned";
  if (normalized.includes("complete")) return "active";

  return "pending";
}

function buildDetailingTitle(booking: AdminDetailingBookingRaw): string {
  const packageName =
    booking.package?.name?.trim() ||
    booking.service?.trim() ||
    "Detailing Request";
  const addonNames =
    booking.addons
      ?.map((addon) => addon.name?.trim())
      .filter((name): name is string => Boolean(name)) ?? [];

  if (addonNames.length === 0) {
    return packageName;
  }

  return `${packageName} + ${addonNames.join(" + ")}`;
}

function buildScheduledLabel(booking: AdminDetailingBookingRaw): string | undefined {
  const date =
    booking.preferredDateLabel?.trim() || booking.scheduledDate?.trim();
  const time = booking.timeWindow?.trim();

  if (date && time) {
    return `${date} · ${time}`;
  }

  return date || time || undefined;
}

function buildAddonLabel(booking: AdminDetailingBookingRaw): string | undefined {
  const addonNames =
    booking.addons
      ?.map((addon) => addon.name?.trim())
      .filter((name): name is string => Boolean(name)) ?? [];

  if (addonNames.length === 0) {
    return undefined;
  }

  return addonNames.join(", ");
}

export function mapDetailingBooking(
  booking: AdminDetailingBookingRaw,
): DetailingBookingJob | null {
  if (booking.id === undefined || booking.id === null) {
    return null;
  }

  const statusLabel = booking.status?.trim() || "Pending";

  return {
    id: String(booking.id),
    title: buildDetailingTitle(booking),
    jobId: booking.referenceNumber?.trim() || `BOOKING-${booking.id}`,
    member: "—",
    vehicle: booking.vehicle?.trim() || "—",
    status: mapBookingStatus(booking.status),
    statusLabel,
    type: booking.package?.name?.trim() || booking.service?.trim() || "—",
    addOn: buildAddonLabel(booking),
    estimate: booking.totalLabel?.trim() || "—",
    scheduled: buildScheduledLabel(booking),
    location:
      booking.serviceLocation?.trim() ||
      booking.location?.trim() ||
      undefined,
    notes:
      booking.specialInstructions?.trim() ||
      booking.notes?.trim() ||
      undefined,
    category: "detailing",
  };
}

export function mapDetailingBookings(data: unknown): DetailingBookingJob[] {
  const record =
    data && typeof data === "object"
      ? (data as { count?: number; bookings?: AdminDetailingBookingRaw[] })
      : {};

  return (record.bookings ?? [])
    .map(mapDetailingBooking)
    .filter((job): job is DetailingBookingJob => job !== null)
    .sort((a, b) => compareResourceIdsDesc(b.id, a.id));
}

export function buildDetailingSectionMeta(
  jobs: DetailingBookingJob[],
  totalCount?: number,
): DetailingSectionMeta {
  const count = totalCount ?? jobs.length;
  const inProgress = jobs.filter((job) => job.status === "in-progress").length;
  const pending = jobs.filter((job) => job.status === "pending").length;

  const highlightLabel =
    inProgress > 0
      ? `${inProgress} in progress`
      : pending > 0
        ? `${pending} pending`
        : "Up to date";

  return {
    title: "Detailing & Wash",
    requestCount: count,
    highlightLabel,
  };
}
