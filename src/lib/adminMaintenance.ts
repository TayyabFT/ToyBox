import type {
  MaintenanceJob,
  SectionMeta,
} from "@/components/admin/service-requests/types";
import {
  buildMaintenanceSectionMeta as buildSharedMaintenanceSectionMeta,
  mapMaintenanceRequest,
  mapMaintenanceRequests,
  type MaintenanceRequestJob,
} from "@/lib/maintenanceRequests";

export function mapAdminMaintenanceRequest(
  request: Parameters<typeof mapMaintenanceRequest>[0],
): MaintenanceJob | null {
  return mapMaintenanceRequest(request);
}

export function mapAdminMaintenanceRequests(data: unknown): MaintenanceJob[] {
  return mapMaintenanceRequests(data);
}

export function buildMaintenanceSectionMeta(
  jobs: MaintenanceJob[],
  totalCount?: number,
): SectionMeta {
  return buildSharedMaintenanceSectionMeta(
    jobs as MaintenanceRequestJob[],
    totalCount,
  );
}
