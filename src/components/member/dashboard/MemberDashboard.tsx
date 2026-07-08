"use client";

import { memberDashboardMock } from "@/components/member/dashboard/mockData";
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

export function MemberDashboard() {
  const data = memberDashboardMock;

  const today = new Date();
  const sublabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 p-8">

      {/* 1 ── Greeting */}
      <MemberGreeting memberName={data.memberName} sublabel={sublabel} />

      {/* 2 ── Hero Row: Membership Card (left) + Club Banner slider (right) */}
      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-2">
        <MembershipCard
          memberName={data.memberName}
          memberNumber={data.memberNumber}
          membershipTier={data.membershipTier}
          memberSince={data.memberSince}
        />
        <ClubBanner />
      </div>

      {/* 3 ── KPI Stats — 4 equal cards */}
      <MemberStatsRow kpis={data.kpis} />

      {/* 4 ── Quick Actions — 4 action tiles */}
      <MemberQuickActions />

      {/* 5 ── Two-column: Your Collection (left) + Your Diary (right) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <MemberCollectionSection vehicles={data.vehicles} />
        <MemberDiarySection events={data.diary} />
      </div>

      {/* 6 ── The Club — 3 venue cards full width */}
      <MemberClubSection venues={data.clubVenues} />

      {/* 7 ── Bottom two-column: From The Club (left) + Recent Activity (right) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <MemberNewsSection items={data.news} />
        <MemberActivitySection items={data.recentActivity} />
      </div>

    </div>
  );
}
