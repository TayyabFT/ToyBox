"use client";

import { staffDetailingApi } from "@/api/staffDetailing.api";
import { staffMaintenanceApi } from "@/api/staffMaintenance.api";
import { staffTransportApi } from "@/api/staffTransport.api";
import { staffOverviewApi } from "@/api/staffOverview.api";
import {
  buildStaffDetailingSectionMeta,
  mapStaffDetailingBookings,
} from "@/lib/staffDetailing";
import {
  buildStaffMaintenanceSectionMeta,
  mapStaffMaintenanceRequests,
} from "@/lib/staffMaintenance";
import {
  buildStaffTransportSectionMeta,
  mapStaffTransportRequests,
} from "@/lib/staffTransport";
import {
  createEmptyStaffServiceRequestStats,
  mapStaffOverviewJobsStats,
} from "@/lib/staffServiceRequestStats";
import { ServiceRequestsDashboard } from "@/components/shared/service-requests/ServiceRequestsDashboard";

export function ServiceRequestsPage() {
  return (
    <ServiceRequestsDashboard
      basePath="/staff"
      transport={{
        load: async () => {
          const response = await staffTransportApi.getRequests();
          const jobs = mapStaffTransportRequests(response.data);
          return { jobs, count: jobs.length };
        },
        buildMeta: buildStaffTransportSectionMeta,
      }}
      maintenance={{
        load: async () => {
          const response = await staffMaintenanceApi.getRequests();
          const jobs = mapStaffMaintenanceRequests(response.data);
          const count =
            typeof response.data?.count === "number"
              ? response.data.count
              : jobs.length;
          return { jobs, count };
        },
        buildMeta: buildStaffMaintenanceSectionMeta,
      }}
      detailing={{
        load: async () => {
          const response = await staffDetailingApi.getBookings();
          const jobs = mapStaffDetailingBookings(response.data);
          const count =
            typeof response.data?.count === "number"
              ? response.data.count
              : jobs.length;
          return { jobs, count };
        },
        buildMeta: buildStaffDetailingSectionMeta,
      }}
      loadStats={async () => {
        try {
          const response = await staffOverviewApi.getJobs();
          return mapStaffOverviewJobsStats(response.data);
        } catch {
          return createEmptyStaffServiceRequestStats();
        }
      }}
    />
  );
}
