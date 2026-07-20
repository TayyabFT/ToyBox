"use client";

import { useCallback, useEffect, useState } from "react";
import { adminServiceRequestJobsApi } from "@/api/adminServiceRequestJobs.api";
import { mapStaffJobListItems, type StaffJobListItem } from "@/lib/staffJobs";
import { showError } from "@/lib/toast";
import { AdminJobDetailModal } from "./AdminJobDetailModal";
import { AdminJobListSection } from "./AdminJobListSection";
import { useAdminJobDetail } from "./useAdminJobDetail";

export function AdminActiveJobsPanel() {
  const [jobs, setJobs] = useState<StaffJobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedJobId, selectedJob, detailLoading, selectJob, closeModal } =
    useAdminJobDetail();

  const loadActiveJobs = useCallback(async () => {
    setLoading(true);

    try {
      const response = await adminServiceRequestJobsApi.getActiveJobs();

      setJobs(mapStaffJobListItems(response.data?.jobs));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load active jobs";

      showError(message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadActiveJobs();
  }, [loadActiveJobs]);

  return (
    <div className="space-y-4">
      <AdminJobListSection
        title="Active Jobs"
        highlightLabel="Across all staff"
        jobs={jobs}
        loading={loading}
        emptyText="No active jobs right now."
        onSelect={selectJob}
        scrollable
      />

      <AdminJobDetailModal
        open={Boolean(selectedJobId)}
        job={selectedJob}
        loading={detailLoading}
        onClose={closeModal}
      />
    </div>
  );
}
