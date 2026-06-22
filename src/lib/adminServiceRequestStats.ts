import { serviceRequestStats as fallbackStats } from "@/components/admin/service-requests/mockData";
import type { ServiceRequestStat } from "@/components/admin/service-requests/types";
import {
  createEmptyOverviewJobsStats,
  mapOverviewJobsStats,
} from "@/lib/overviewJobsStats";

export function mapAdminOverviewJobsStats(data: unknown): ServiceRequestStat[] {
  return mapOverviewJobsStats(data, fallbackStats);
}

export function createEmptyServiceRequestStats(): ServiceRequestStat[] {
  return createEmptyOverviewJobsStats(fallbackStats);
}
