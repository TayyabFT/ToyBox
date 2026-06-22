import { serviceRequestStats as fallbackStats } from "@/components/staff/service-requests/mockData";
import type { ServiceRequestStat } from "@/components/staff/service-requests/types";
import {
  createEmptyOverviewJobsStats,
  mapOverviewJobsStats,
} from "@/lib/overviewJobsStats";

export function mapStaffOverviewJobsStats(data: unknown): ServiceRequestStat[] {
  return mapOverviewJobsStats(data, fallbackStats);
}

export function createEmptyStaffServiceRequestStats(): ServiceRequestStat[] {
  return createEmptyOverviewJobsStats(fallbackStats);
}
