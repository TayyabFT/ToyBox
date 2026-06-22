import type {
  DetailingJob,
  SectionMeta,
} from "@/components/admin/service-requests/types";
import {
  buildDetailingSectionMeta as buildSharedDetailingSectionMeta,
  mapDetailingBooking,
  mapDetailingBookings,
  type DetailingBookingJob,
} from "@/lib/detailingBookings";

export function mapAdminDetailingBooking(
  booking: Parameters<typeof mapDetailingBooking>[0],
): DetailingJob | null {
  return mapDetailingBooking(booking);
}

export function mapAdminDetailingBookings(data: unknown): DetailingJob[] {
  return mapDetailingBookings(data);
}

export function buildDetailingSectionMeta(
  jobs: DetailingJob[],
  totalCount?: number,
): SectionMeta {
  return buildSharedDetailingSectionMeta(
    jobs as DetailingBookingJob[],
    totalCount,
  );
}
