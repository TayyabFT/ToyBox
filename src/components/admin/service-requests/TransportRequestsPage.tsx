"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminTransportApi } from "@/api/adminTransport.api";
import {
  buildTransportSectionMeta,
  mapAdminTransportRequests,
} from "@/lib/adminTransport";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
import { showError } from "@/lib/toast";
import { ServiceSectionListPage } from "@/components/shared/service-requests/ServiceSectionListPage";
import { TransportJobCard } from "@/components/shared/service-requests/TransportJobCard";
import type { TransportJob } from "@/components/shared/service-requests/types";

export function TransportRequestsPage() {
  const [jobs, setJobs] = useState<TransportJob[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useSetAdminPageSubtitle("Transport & Delivery");

  const loadRequests = useCallback(async () => {
    setLoading(true);

    try {
      const response = await adminTransportApi.getRequests();
      const requests = mapAdminTransportRequests(response.data);

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
    () => buildTransportSectionMeta(jobs, totalCount),
    [jobs, totalCount],
  );

  return (
    <ServiceSectionListPage
      backHref="/admin/service-requests"
      meta={meta}
      loading={loading}
      jobCount={jobs.length}
      loadingText="Loading transport requests..."
      emptyText="No transport requests found."
    >
      {jobs.map((job) => (
        <TransportJobCard key={job.id} job={job} />
      ))}
    </ServiceSectionListPage>
  );
}
