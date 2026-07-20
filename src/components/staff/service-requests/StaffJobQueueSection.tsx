"use client";

import { useCallback, useEffect, useState } from "react";
import { staffJobsApi } from "@/api/staffJobs.api";
import { ServiceJobListSkeleton } from "@/components/shared/service-requests/ServiceJobListSkeleton";
import { ServiceSectionHeader } from "@/components/shared/service-requests/ServiceSectionHeader";
import {
  mapStaffJobListItems,
  unwrapActiveJobPayload,
  type StaffJobListItem,
} from "@/lib/staffJobs";
import { showError } from "@/lib/toast";
import type { JobCompleteEvent } from "./jobCompleteTypes";
import { StaffJobListCard } from "./StaffJobListCard";

type StaffJobQueueSectionProps = {
  refreshToken?: number;
  completeEvent?: JobCompleteEvent | null;
};

export function StaffJobQueueSection({
  refreshToken = 0,
  completeEvent = null,
}: StaffJobQueueSectionProps) {
  const [jobs, setJobs] = useState<StaffJobListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQueue = useCallback(
    async (options?: { silent?: boolean; excludeIds?: string[] }) => {
      const silent = options?.silent ?? false;

      if (!silent) {
        setLoading(true);
      }

      try {
        const [queueResponse, activeResponse] = await Promise.all([
          staffJobsApi.getQueue(),
          staffJobsApi.getActive(),
        ]);
        const activeJobId = unwrapActiveJobPayload(activeResponse.data)?.id?.trim();
        const excludeIds = new Set(
          [...(options?.excludeIds ?? []), activeJobId].filter(
            (id): id is string => Boolean(id),
          ),
        );
        const mineJobs = mapStaffJobListItems(queueResponse.data?.mine?.jobs).filter(
          (job) => !excludeIds.has(job.id),
        );

        setJobs(mineJobs);
      } catch (error) {
        const message =
          (error as { message?: string }).message ?? "Failed to load job queue";

        if (!silent) {
          showError(message);
          setJobs([]);
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void loadQueue();
  }, [loadQueue, refreshToken]);

  useEffect(() => {
    if (!completeEvent) {
      return;
    }

    const { completedJobId, nextJobId } = completeEvent;

    const excludeIds = [completedJobId, nextJobId].filter(
      (id): id is string => Boolean(id),
    );

    setJobs((current) =>
      current.filter((job) => !excludeIds.includes(job.id)),
    );

    void loadQueue({ silent: true, excludeIds });
  }, [completeEvent, loadQueue]);

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

      {loading && jobs.length === 0 ? <ServiceJobListSkeleton count={3} /> : null}

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
