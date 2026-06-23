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

const PAGE_SIZE = 50;

export function MembersPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [stats, setStats] = useState<MemberStatsDisplay>(memberStats);
  const [filters, setFilters] =
    useState<MemberFilterOption[]>(DEFAULT_MEMBER_FILTERS);
  const [activeTier, setActiveTier] = useState<MemberTierFilter>("all");
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMembers = useCallback(
    async (tier: MemberTierFilter, nextOffset = 0, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await membersApi.getMembers({
          tier,
          limit: PAGE_SIZE,
          offset: nextOffset,
        });

        const result = mapMembersDirectory(response.data);

        setStats(result.summary);
        setFilters(result.filters);
        setMembers((current) =>
          append ? [...current, ...result.members] : result.members,
        );
        setTotal(result.total);
        setOffset(nextOffset + result.members.length);
      } catch (error) {
        const message =
          (error as { message?: string }).message ??
          "Failed to load members";

        showError(message);

        if (!append) {
          setStats(createEmptyMemberStats());
          setMembers([]);
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
    loadMembers(activeTier);
  }, [activeTier, loadMembers]);

  const hasMore = members.length < total;

  return (
    <div className="space-y-7 p-8">
      <MembersPageHeader onInviteClick={() => setInviteOpen(true)} />
      <MembersStatsRow stats={stats} loading={loading && !loadingMore} />
      <MembersDirectory
        filters={filters}
        activeTier={activeTier}
        onTierChange={setActiveTier}
        members={members}
        loading={loading && !loadingMore}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={() => loadMembers(activeTier, offset, true)}
      />
      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        lockedRole="member"
      />
    </div>
  );
}
