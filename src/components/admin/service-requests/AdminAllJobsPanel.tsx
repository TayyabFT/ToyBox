"use client";

import { useCallback, useEffect, useState } from "react";
import { adminServiceRequestJobsApi } from "@/api/adminServiceRequestJobs.api";
import { mapStaffJobListItems, type StaffJobListItem } from "@/lib/staffJobs";
import { showError } from "@/lib/toast";
import { AdminJobDetailModal } from "./AdminJobDetailModal";
import { AdminJobListSection } from "./AdminJobListSection";
import { useAdminJobDetail } from "./useAdminJobDetail";

export function AdminAllJobsPanel() {
  const [jobs, setJobs] = useState<StaffJobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedJobId, selectedJob, detailLoading, selectJob, closeModal } =
    useAdminJobDetail();

  const loadAllJobs = useCallback(async () => {
    setLoading(true);

    try {
      const response = await adminServiceRequestJobsApi.getAllJobs();

      setJobs(mapStaffJobListItems(response.data?.jobs));
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to load jobs";

      showError(message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAllJobs();
  }, [loadAllJobs]);

  return (
    <div className="space-y-4">
      <AdminJobListSection
        title="All Jobs"
        highlightLabel="All service jobs"
        jobs={jobs}
        loading={loading}
        emptyText="No jobs found."
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
