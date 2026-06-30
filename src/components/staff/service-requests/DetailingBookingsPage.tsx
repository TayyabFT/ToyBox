"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { staffDetailingApi } from "@/api/staffDetailing.api";
import {
  buildStaffDetailingSectionMeta,
  mapStaffDetailingBookings,
} from "@/lib/staffDetailing";
import { showError } from "@/lib/toast";
import { DetailingJobCard } from "@/components/shared/service-requests/DetailingJobCard";
import { ServiceSectionListPage } from "@/components/shared/service-requests/ServiceSectionListPage";
import type { DetailingJob } from "@/components/shared/service-requests/types";

export function DetailingBookingsPage() {
  const [jobs, setJobs] = useState<DetailingJob[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    setLoading(true);

    try {
      const response = await staffDetailingApi.getBookings();
      const bookings = mapStaffDetailingBookings(response.data);

      setJobs(bookings);
      setTotalCount(
        typeof response.data?.count === "number"
          ? response.data.count
          : bookings.length,
      );
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load detailing bookings";

      showError(message);
      setJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const meta = useMemo(
    () => buildStaffDetailingSectionMeta(jobs, totalCount),
    [jobs, totalCount],
  );

  return (
    <ServiceSectionListPage
      backHref="/staff/service-requests"
      meta={meta}
      loading={loading}
      jobCount={jobs.length}
      loadingText="Loading detailing bookings..."
      emptyText="No detailing bookings found."
    >
      {jobs.map((job) => (
        <DetailingJobCard key={job.id} job={job} staffMode />
      ))}
    </ServiceSectionListPage>
  );
}
