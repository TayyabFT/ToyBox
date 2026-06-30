"use client";

import { useState } from "react";
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
import { StaffActiveJobDetailPanel } from "./StaffActiveJobDetailPanel";
import { StaffCompletedJobsSection } from "./StaffCompletedJobsSection";
import { StaffJobQueueSection } from "./StaffJobQueueSection";

export function ServiceRequestsPage() {
  const [jobsRefreshToken, setJobsRefreshToken] = useState(0);

  return (
    <>
      <ServiceRequestsDashboard
      basePath="/staff"
      staffMode
      activeJobPanel={
        <StaffActiveJobDetailPanel
          onWorkflowChange={() =>
            setJobsRefreshToken((current) => current + 1)
          }
        />
      }
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
      <div className="grid grid-cols-1 gap-4 px-8 pb-8 xl:grid-cols-2">
        <StaffJobQueueSection refreshToken={jobsRefreshToken} />
        <StaffCompletedJobsSection refreshToken={jobsRefreshToken} />
      </div>
    </>
  );
}
