"use client";

import { useCallback, useEffect, useState } from "react";
import { staffJobsApi } from "@/api/staffJobs.api";
import { ServiceSectionHeader } from "@/components/shared/service-requests/ServiceSectionHeader";
import {
  mapStaffJobListItem,
  mapStaffJobListItems,
  type StaffJobListItem,
} from "@/lib/staffJobs";
import { showError } from "@/lib/toast";
import type { JobCompleteEvent } from "./jobCompleteTypes";
import { StaffJobListCard } from "./StaffJobListCard";

type StaffCompletedJobsSectionProps = {
  refreshToken?: number;
  completeEvent?: JobCompleteEvent | null;
};

export function StaffCompletedJobsSection({
  refreshToken = 0,
  completeEvent = null,
}: StaffCompletedJobsSectionProps) {
  const [jobs, setJobs] = useState<StaffJobListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCompleted = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const response = await staffJobsApi.getCompleted();
      const completedJobs = mapStaffJobListItems(response.data?.jobs);

      setJobs(completedJobs);
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to load completed jobs";

      if (!silent) {
        showError(message);
        setJobs([]);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadCompleted();
  }, [loadCompleted, refreshToken]);

  useEffect(() => {
    if (!completeEvent?.completedJob) {
      return;
    }

    const completedItem = mapStaffJobListItem(completeEvent.completedJob);

    if (completedItem) {
      setJobs((current) => {
        const withoutDuplicate = current.filter(
          (job) => job.id !== completedItem.id,
        );

        return [completedItem, ...withoutDuplicate];
      });
    }

    void loadCompleted(true);
  }, [completeEvent, loadCompleted]);

  return (
    <section
      className={`flex flex-col overflow-hidden rounded-2xl border border-[#D4A8471A] bg-surface p-5 ${
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

      {jobs.length > 0 ? (
        <div className="Custom__Scrollbar mt-1 max-h-[480px] overflow-y-auto pr-1">
          <div className="space-y-3">
            {jobs.map((job) => (
              <StaffJobListCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
