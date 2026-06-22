import type {
  SectionMeta,
  TransportJob,
} from "@/components/staff/service-requests/types";
import {
  buildTransportSectionMeta as buildSharedTransportSectionMeta,
  mapTransportRequest,
  mapTransportRequests,
  type TransportRequestJob,
} from "@/lib/transportRequests";

export function mapStaffTransportRequest(
  request: Parameters<typeof mapTransportRequest>[0],
): TransportJob | null {
  return mapTransportRequest(request);
}

export function mapStaffTransportRequests(data: unknown): TransportJob[] {
  return mapTransportRequests(data);
}

export function buildStaffTransportSectionMeta(
  jobs: TransportJob[],
  totalCount?: number,
): SectionMeta {
  return buildSharedTransportSectionMeta(
    jobs as TransportRequestJob[],
    totalCount,
  );
}
