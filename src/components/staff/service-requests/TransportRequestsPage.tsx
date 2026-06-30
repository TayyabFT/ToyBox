"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { staffTransportApi } from "@/api/staffTransport.api";
import {
  buildStaffTransportSectionMeta,
  mapStaffTransportRequests,
} from "@/lib/staffTransport";
import { showError } from "@/lib/toast";
import { ServiceSectionListPage } from "@/components/shared/service-requests/ServiceSectionListPage";
import { TransportJobCard } from "@/components/shared/service-requests/TransportJobCard";
import type { TransportJob } from "@/components/shared/service-requests/types";

export function TransportRequestsPage() {
  const [jobs, setJobs] = useState<TransportJob[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    setLoading(true);

    try {
      const response = await staffTransportApi.getRequests();
      const requests = mapStaffTransportRequests(response.data);

      setJobs(requests);
      setTotalCount(requests.length);
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load transport requests";

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
    () => buildStaffTransportSectionMeta(jobs, totalCount),
    [jobs, totalCount],
  );

  return (
    <ServiceSectionListPage
      backHref="/staff/service-requests"
      meta={meta}
      loading={loading}
      jobCount={jobs.length}
      loadingText="Loading transport requests..."
      emptyText="No transport requests found."
    >
      {jobs.map((job) => (
        <TransportJobCard key={job.id} job={job} staffMode />
      ))}
    </ServiceSectionListPage>
  );
}
