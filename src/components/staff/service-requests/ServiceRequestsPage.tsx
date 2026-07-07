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
import type { JobCompleteEvent } from "./jobCompleteTypes";

export function ServiceRequestsPage() {
  const [jobsRefreshToken, setJobsRefreshToken] = useState(0);
  const [completeEvent, setCompleteEvent] = useState<JobCompleteEvent | null>(null);

  function handleJobCompleted(event: JobCompleteEvent) {
    setCompleteEvent(event);
    setJobsRefreshToken((current) => current + 1);
  }

  return (
    <ServiceRequestsDashboard
      basePath="/staff"
      staffMode
      staffContent={
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <StaffActiveJobDetailPanel
              onWorkflowChange={() =>
                setJobsRefreshToken((current) => current + 1)
              }
              onJobCompleted={handleJobCompleted}
            />
            <StaffJobQueueSection
              refreshToken={jobsRefreshToken}
              completeEvent={completeEvent}
            />
          </div>
          <StaffCompletedJobsSection
            refreshToken={jobsRefreshToken}
            completeEvent={completeEvent}
          />
        </div>
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
  );
}
