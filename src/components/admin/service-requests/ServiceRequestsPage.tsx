"use client";

import { adminDetailingApi } from "@/api/adminDetailing.api";
import { adminMaintenanceApi } from "@/api/adminMaintenance.api";
import { adminTransportApi } from "@/api/adminTransport.api";
import { adminOverviewApi } from "@/api/adminOverview.api";
import {
  buildDetailingSectionMeta,
  mapAdminDetailingBookings,
} from "@/lib/adminDetailing";
import {
  buildMaintenanceSectionMeta,
  mapAdminMaintenanceRequests,
} from "@/lib/adminMaintenance";
import {
  buildTransportSectionMeta,
  mapAdminTransportRequests,
} from "@/lib/adminTransport";
import {
  createEmptyServiceRequestStats,
  mapAdminOverviewJobsStats,
} from "@/lib/adminServiceRequestStats";
import { ServiceRequestsDashboard } from "@/components/shared/service-requests/ServiceRequestsDashboard";
import { AdminActiveJobsPanel } from "./AdminActiveJobsPanel";
import { AdminAllJobsPanel } from "./AdminAllJobsPanel";

export function ServiceRequestsPage() {
  return (
    <ServiceRequestsDashboard
      basePath="/admin"
      leftPanel={<AdminAllJobsPanel />}
      rightPanel={<AdminActiveJobsPanel />}
      transport={{
        load: async () => {
          const response = await adminTransportApi.getRequests();
          const jobs = mapAdminTransportRequests(response.data);
          return { jobs, count: jobs.length };
        },
        buildMeta: buildTransportSectionMeta,
      }}
      maintenance={{
        load: async () => {
          const response = await adminMaintenanceApi.getRequests();
          const jobs = mapAdminMaintenanceRequests(response.data);
          const count =
            typeof response.data?.count === "number"
              ? response.data.count
              : jobs.length;
          return { jobs, count };
        },
        buildMeta: buildMaintenanceSectionMeta,
      }}
      detailing={{
        load: async () => {
          const response = await adminDetailingApi.getBookings();
          const jobs = mapAdminDetailingBookings(response.data);
          const count =
            typeof response.data?.count === "number"
              ? response.data.count
              : jobs.length;
          return { jobs, count };
        },
        buildMeta: buildDetailingSectionMeta,
      }}
      loadStats={async () => {
        try {
          const response = await adminOverviewApi.getJobs();
          return mapAdminOverviewJobsStats(response.data);
        } catch {
          return createEmptyServiceRequestStats();
        }
      }}
    />
  );
}
