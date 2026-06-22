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

const PAGE_SIZE = 50;

export function StaffPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [stats, setStats] = useState<StaffStatsDisplay>(staffStats);
  const [filters, setFilters] =
    useState<StaffFilterOption[]>(DEFAULT_STAFF_FILTERS);
  const [activeStatus, setActiveStatus] = useState("all");
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadStaff = useCallback(
    async (status: string, nextOffset = 0, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await staffApi.getStaff({
          status,
          limit: PAGE_SIZE,
          offset: nextOffset,
        });

        const result = mapStaffDirectory(response.data);

        setStats(result.summary);
        setFilters(result.filters);
        setActiveStatus(result.status);
        setStaff((current) =>
          append ? [...current, ...result.staff] : result.staff,
        );
        setTotal(result.total);
        setOffset(nextOffset + result.staff.length);
      } catch (error) {
        const message =
          (error as { message?: string }).message ?? "Failed to load staff";

        showError(message);

        if (!append) {
          setStats(createEmptyStaffStats());
          setStaff([]);
          setTotal(0);
          setOffset(0);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadStaff(activeStatus);
  }, [activeStatus, loadStaff]);

  const hasMore = staff.length < total;

  return (
    <div className="space-y-7 p-8">
      <StaffPageHeader onInviteClick={() => setInviteOpen(true)} />
      <StaffStatsRow stats={stats} loading={loading && !loadingMore} />
      <StaffDirectory
        filters={filters}
        activeFilter={activeStatus}
        onFilterChange={setActiveStatus}
        staff={staff}
        loading={loading && !loadingMore}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={() => loadStaff(activeStatus, offset, true)}
      />
      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        lockedRole="staff"
      />
    </div>
  );
}
