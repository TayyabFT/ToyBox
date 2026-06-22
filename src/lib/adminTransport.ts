import type {
  SectionMeta,
  TransportJob,
} from "@/components/admin/service-requests/types";
import {
  buildTransportSectionMeta as buildSharedTransportSectionMeta,
  mapTransportRequest,
  mapTransportRequests,
  type TransportRequestJob,
} from "@/lib/transportRequests";

export function mapAdminTransportRequest(
  request: Parameters<typeof mapTransportRequest>[0],
): TransportJob | null {
  return mapTransportRequest(request);
}

export function mapAdminTransportRequests(data: unknown): TransportJob[] {
  return mapTransportRequests(data);
}

export function buildTransportSectionMeta(
  jobs: TransportJob[],
  totalCount?: number,
): SectionMeta {
  return buildSharedTransportSectionMeta(
    jobs as TransportRequestJob[],
    totalCount,
  );
}
