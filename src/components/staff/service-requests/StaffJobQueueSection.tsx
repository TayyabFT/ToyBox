"use client";

import { useCallback, useEffect, useState } from "react";
import { staffJobsApi } from "@/api/staffJobs.api";
import { ServiceSectionHeader } from "@/components/shared/service-requests/ServiceSectionHeader";
import { mapStaffJobListItems, type StaffJobListItem } from "@/lib/staffJobs";
import { showError } from "@/lib/toast";
import { StaffJobListCard } from "./StaffJobListCard";

type StaffJobQueueSectionProps = {
  refreshToken?: number;
};

export function StaffJobQueueSection({ refreshToken = 0 }: StaffJobQueueSectionProps) {
  const [jobs, setJobs] = useState<StaffJobListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQueue = useCallback(async () => {
    setLoading(true);

    try {
      const response = await staffJobsApi.getQueue();
      const mineJobs = mapStaffJobListItems(response.data?.mine?.jobs);

      setJobs(mineJobs);
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to load job queue";

      showError(message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue, refreshToken]);

  return (
    <section
      className={`rounded-2xl border border-[#D4A8471A] bg-surface p-5 ${
        loading ? "opacity-70" : ""
      }`}
      aria-busy={loading}
    >
      <ServiceSectionHeader
        meta={{
          title: "Job Queue",
          requestCount: jobs.length,
          highlightLabel: "Assigned to you",
        }}
      />

      {loading && jobs.length === 0 ? (
        <p className="font-roboto py-6 text-center text-sm text-secondary">
          Loading queued jobs...
        </p>
      ) : null}

      {!loading && jobs.length === 0 ? (
        <p className="font-roboto py-6 text-center text-sm text-secondary">
          No jobs in your queue right now.
        </p>
      ) : null}

      <div className="space-y-3">
        {jobs.map((job) => (
          <StaffJobListCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
