"use client";

import { useCallback, useEffect, useState } from "react";
import { MemberGreeting } from "@/components/member/dashboard/MemberGreeting";
import { MembershipCard } from "@/components/member/dashboard/MembershipCard";
import { ClubBanner } from "@/components/member/dashboard/ClubBanner";
import { MemberStatsRow } from "@/components/member/dashboard/MemberStatsRow";
import { MemberQuickActions } from "@/components/member/dashboard/MemberQuickActions";
import { MemberCollectionSection } from "@/components/member/dashboard/MemberCollectionSection";
import { MemberDiarySection } from "@/components/member/dashboard/MemberDiarySection";
import { MemberClubSection } from "@/components/member/dashboard/MemberClubSection";
import { MemberNewsSection } from "@/components/member/dashboard/MemberNewsSection";
import { MemberActivitySection } from "@/components/member/dashboard/MemberActivitySection";
import { MemberDashboardSkeleton } from "@/components/member/dashboard/MemberDashboardSkeleton";
import { VehicleSourcingModal } from "@/components/member/garage/vehicle-sourcing/VehicleSourcingModal";
import { showError } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMemberDashboard } from "@/store/slices/memberDashboardSlice";

export function MemberDashboard() {
  const dispatch = useAppDispatch();
  const { data, quickActions, loading, loaded, error } = useAppSelector(
    (state) => state.memberDashboard,
  );
  const [sourcingOpen, setSourcingOpen] = useState(false);

  const loadDashboard = useCallback(async (force?: boolean) => {
    const result = await dispatch(fetchMemberDashboard(force));

    if (fetchMemberDashboard.rejected.match(result)) {
      showError((result.payload as string) ?? "Failed to load dashboard");
    }
  }, [dispatch]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const today = new Date();
  const sublabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Initial load — show full skeleton until the first response resolves.
  if (loading && !loaded) {
    return <MemberDashboardSkeleton />;
  }

  // First load failed with no cached data — show a full-page retry message.
  if (error && !loaded) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-8 text-center">
        <div className="space-y-2">
          <h2 className="font-copperplate text-[18px] tracking-[0.06em] text-foreground uppercase">
            Dashboard Unavailable
          </h2>
          <p className="font-roboto max-w-sm text-sm text-secondary/80">
            {error}. Please check your connection and try again.
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadDashboard(true)}
          className="font-roboto rounded-lg border border-accent/30 bg-accent/5 px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase transition-colors hover:border-accent/50 hover:bg-accent/10"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
      {error && (
        <div className="flex items-center justify-between font-roboto rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => loadDashboard(true)}
            className="rounded bg-red-500/20 px-2.5 py-1 text-xs font-semibold hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <MemberGreeting memberName={data.memberName} sublabel={sublabel} />

      {/* Hero row: membership card + club banner — stacks on mobile */}
      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[1.5fr_1fr] mb-6 md:mb-10">
        <MembershipCard
          memberName={data.memberName}
          memberNumber={data.memberNumber}
          membershipTier={data.membershipTier}
          memberSince={data.memberSince}
        />
        <ClubBanner venues={data.clubVenues} />
      </div>

      <MemberStatsRow kpis={data.kpis} />

      <MemberQuickActions actions={quickActions} onSourcingClick={() => setSourcingOpen(true)} />

      {/* Collection + Diary — stacks on mobile, side-by-side on xl */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr] mb-6 md:mb-10">
        <MemberCollectionSection vehicles={data.vehicles} />
        <MemberDiarySection events={data.diary} />
      </div>

      <MemberClubSection
        venues={data.clubVenues}
        statusLine={data.clubStatusLine}
      />

      {/* News + Activity — stacks on mobile, side-by-side on xl */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mt-8 md:mt-14">
        <MemberNewsSection items={data.news} />
        <MemberActivitySection items={data.recentActivity} />
      </div>

      <VehicleSourcingModal
        open={sourcingOpen}
        onClose={() => setSourcingOpen(false)}
      />
    </div>
  );
}
