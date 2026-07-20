"use client";

import { useCallback, useEffect, useState } from "react";
import { InviteModal } from "@/components/admin/InviteModal";
import { staffApi } from "@/api/staff.api";
import {
  createEmptyStaffStats,
  DEFAULT_STAFF_FILTERS,
  mapStaffDirectory,
} from "@/lib/staff";
import { showError } from "@/lib/toast";
import type { StaffFilterOption } from "@/types/api";
import { StaffDirectory } from "./StaffDirectory";
import { StaffPageHeader } from "./StaffPageHeader";
import { StaffStatsRow } from "./StaffStatsRow";
import { staffStats } from "./mockData";
import type { StaffProfile, StaffStatsDisplay } from "./types";

const PAGE_SIZE = 10;

export function StaffPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [stats, setStats] = useState<StaffStatsDisplay>(staffStats);
  const [filters, setFilters] =
    useState<StaffFilterOption[]>(DEFAULT_STAFF_FILTERS);
  const [activeStatus, setActiveStatus] = useState("all");
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadStaff = useCallback(
    async (status: string, pageNumber: number) => {
      setLoading(true);

      try {
        const response = await staffApi.getStaff({
          status,
          limit: PAGE_SIZE,
          offset: (pageNumber - 1) * PAGE_SIZE,
        });

        const result = mapStaffDirectory(response.data);

        setStats(result.summary);
        setFilters(result.filters);
        setActiveStatus(result.status);
        setStaff(result.staff);
        setTotal(result.total);
      } catch (error) {
        const message =
          (error as { message?: string }).message ?? "Failed to load staff";

        showError(message);

        setStats(createEmptyStaffStats());
        setStaff([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadStaff(activeStatus, page);
  }, [activeStatus, page, loadStaff]);

  function handleFilterChange(key: string) {
    setActiveStatus(key);
    setPage(1);
  }

  return (
    <div className="space-y-7 p-8">
      <StaffPageHeader onInviteClick={() => setInviteOpen(true)} />
      <StaffStatsRow stats={stats} loading={loading} />
      <StaffDirectory
        filters={filters}
        activeFilter={activeStatus}
        onFilterChange={handleFilterChange}
        staff={staff}
        loading={loading}
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />
      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        lockedRole="staff"
      />
    </div>
  );
}
