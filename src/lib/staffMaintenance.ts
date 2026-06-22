import type {
  MaintenanceJob,
  SectionMeta,
} from "@/components/staff/service-requests/types";
import {
  buildMaintenanceSectionMeta as buildSharedMaintenanceSectionMeta,
  mapMaintenanceRequest,
  mapMaintenanceRequests,
  type MaintenanceRequestJob,
} from "@/lib/maintenanceRequests";

export function mapStaffMaintenanceRequest(
  request: Parameters<typeof mapMaintenanceRequest>[0],
): MaintenanceJob | null {
  return mapMaintenanceRequest(request);
}

export function mapStaffMaintenanceRequests(data: unknown): MaintenanceJob[] {
  return mapMaintenanceRequests(data);
}

export function buildStaffMaintenanceSectionMeta(
  jobs: MaintenanceJob[],
  totalCount?: number,
): SectionMeta {
  return buildSharedMaintenanceSectionMeta(
    jobs as MaintenanceRequestJob[],
    totalCount,
  );
}
