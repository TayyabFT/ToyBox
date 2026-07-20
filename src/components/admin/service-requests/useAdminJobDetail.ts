"use client";

import { useState } from "react";
import { adminServiceRequestJobsApi } from "@/api/adminServiceRequestJobs.api";
import {
  mapStaffActiveJob,
  unwrapActiveJobPayload,
  type StaffActiveJobView,
} from "@/lib/staffJobs";
import { showError } from "@/lib/toast";

export function useAdminJobDetail() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<StaffActiveJobView | null>(
    null,
  );
  const [detailLoading, setDetailLoading] = useState(false);

  async function selectJob(jobId: string) {
    setSelectedJobId(jobId);
    setDetailLoading(true);

    try {
      const response = await adminServiceRequestJobsApi.getJobDetail(jobId);
      const job = unwrapActiveJobPayload(response.data);

      setSelectedJob(mapStaffActiveJob(job));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load job detail";

      showError(message);
      setSelectedJob(null);
    } finally {
      setDetailLoading(false);
    }
  }

  function closeModal() {
    setSelectedJobId(null);
    setSelectedJob(null);
  }

  return { selectedJobId, selectedJob, detailLoading, selectJob, closeModal };
}
