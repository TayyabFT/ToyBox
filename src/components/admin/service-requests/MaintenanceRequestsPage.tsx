"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminMaintenanceApi } from "@/api/adminMaintenance.api";
import {
  buildMaintenanceSectionMeta,
  mapAdminMaintenanceRequests,
} from "@/lib/adminMaintenance";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
import { showError } from "@/lib/toast";
import { MaintenanceJobCard } from "@/components/shared/service-requests/MaintenanceJobCard";
import { ServiceSectionListPage } from "@/components/shared/service-requests/ServiceSectionListPage";
import type { MaintenanceJob } from "@/components/shared/service-requests/types";

export function MaintenanceRequestsPage() {
  const [jobs, setJobs] = useState<MaintenanceJob[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useSetAdminPageSubtitle("Maintenance & Service");

  const loadRequests = useCallback(async () => {
    setLoading(true);

    try {
      const response = await adminMaintenanceApi.getRequests();
      const requests = mapAdminMaintenanceRequests(response.data);

      setJobs(requests);
      setTotalCount(
        typeof response.data?.count === "number"
          ? response.data.count
          : requests.length,
      );
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load maintenance requests";

      showError(message);
      setJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const meta = useMemo(
    () => buildMaintenanceSectionMeta(jobs, totalCount),
    [jobs, totalCount],
  );

  return (
    <ServiceSectionListPage
      backHref="/admin/service-requests"
      meta={meta}
      loading={loading}
      jobCount={jobs.length}
      loadingText="Loading maintenance requests..."
      emptyText="No maintenance requests found."
    >
      {jobs.map((job) => (
        <MaintenanceJobCard key={job.id} job={job} />
      ))}
    </ServiceSectionListPage>
  );
}
