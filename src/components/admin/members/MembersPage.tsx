"use client";

import { useCallback, useEffect, useState } from "react";
import { InviteModal } from "@/components/admin/InviteModal";
import { membersApi } from "@/api/members.api";
import {
  createEmptyMemberStats,
  DEFAULT_MEMBER_FILTERS,
  mapMembersDirectory,
} from "@/lib/members";
import { showError } from "@/lib/toast";
import type { MemberFilterOption, MemberTierFilter } from "@/types/api";
import { MembersDirectory } from "./MembersDirectory";
import { MembersPageHeader } from "./MembersPageHeader";
import { MembersStatsRow } from "./MembersStatsRow";
import { memberStats } from "./mockData";
import type { MemberProfile, MemberStatsDisplay } from "./types";

const PAGE_SIZE = 10;

export function MembersPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [stats, setStats] = useState<MemberStatsDisplay>(memberStats);
  const [filters, setFilters] =
    useState<MemberFilterOption[]>(DEFAULT_MEMBER_FILTERS);
  const [activeTier, setActiveTier] = useState<MemberTierFilter>("all");
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadMembers = useCallback(
    async (tier: MemberTierFilter, pageNumber: number) => {
      setLoading(true);

      try {
        const response = await membersApi.getMembers({
          tier,
          limit: PAGE_SIZE,
          offset: (pageNumber - 1) * PAGE_SIZE,
        });

        const result = mapMembersDirectory(response.data);

        setStats(result.summary);
        setFilters(result.filters);
        setMembers(result.members);
        setTotal(result.total);
      } catch (error) {
        const message =
          (error as { message?: string }).message ??
          "Failed to load members";

        showError(message);

        setStats(createEmptyMemberStats());
        setMembers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadMembers(activeTier, page);
  }, [activeTier, page, loadMembers]);

  function handleTierChange(tier: MemberTierFilter) {
    setActiveTier(tier);
    setPage(1);
  }

  return (
    <div className="space-y-7 p-8">
      <MembersPageHeader onInviteClick={() => setInviteOpen(true)} />
      <MembersStatsRow stats={stats} loading={loading} />
      <MembersDirectory
        filters={filters}
        activeTier={activeTier}
        onTierChange={handleTierChange}
        members={members}
        loading={loading}
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />
      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        lockedRole="member"
      />
    </div>
  );
}
