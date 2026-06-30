"use client";

import { useCallback, useEffect, useState } from "react";
import { staffJobsApi } from "@/api/staffJobs.api";
import { ServiceSectionHeader } from "@/components/shared/service-requests/ServiceSectionHeader";
import { mapStaffJobListItems, type StaffJobListItem } from "@/lib/staffJobs";
import { showError } from "@/lib/toast";
import { StaffJobListCard } from "./StaffJobListCard";

type StaffCompletedJobsSectionProps = {
  refreshToken?: number;
};

export function StaffCompletedJobsSection({
  refreshToken = 0,
}: StaffCompletedJobsSectionProps) {
  const [jobs, setJobs] = useState<StaffJobListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCompleted = useCallback(async () => {
    setLoading(true);

    try {
      const response = await staffJobsApi.getCompleted();
      const completedJobs = mapStaffJobListItems(response.data?.jobs);

      setJobs(completedJobs);
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to load completed jobs";

      showError(message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCompleted();
  }, [loadCompleted, refreshToken]);

  return (
    <section
      className={`rounded-2xl border border-[#D4A8471A] bg-surface p-5 ${
        loading ? "opacity-70" : ""
      }`}
      aria-busy={loading}
    >
      <ServiceSectionHeader
        meta={{
          title: "Completed Jobs",
          requestCount: jobs.length,
          highlightLabel: "Recently finished",
        }}
      />

      {loading && jobs.length === 0 ? (
        <p className="font-roboto py-6 text-center text-sm text-secondary">
          Loading completed jobs...
        </p>
      ) : null}

      {!loading && jobs.length === 0 ? (
        <p className="font-roboto py-6 text-center text-sm text-secondary">
          No completed jobs yet.
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
