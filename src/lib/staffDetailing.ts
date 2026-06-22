import type {
  DetailingJob,
  SectionMeta,
} from "@/components/staff/service-requests/types";
import {
  buildDetailingSectionMeta as buildSharedDetailingSectionMeta,
  mapDetailingBooking,
  mapDetailingBookings,
  type DetailingBookingJob,
} from "@/lib/detailingBookings";

export function mapStaffDetailingBooking(
  booking: Parameters<typeof mapDetailingBooking>[0],
): DetailingJob | null {
  return mapDetailingBooking(booking);
}

export function mapStaffDetailingBookings(data: unknown): DetailingJob[] {
  return mapDetailingBookings(data);
}

export function buildStaffDetailingSectionMeta(
  jobs: DetailingJob[],
  totalCount?: number,
): SectionMeta {
  return buildSharedDetailingSectionMeta(
    jobs as DetailingBookingJob[],
    totalCount,
  );
}
