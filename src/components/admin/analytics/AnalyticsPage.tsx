"use client";

import { AnalyticsInsightsRow } from "./AnalyticsInsightsRow";
import { AnalyticsStatsRow } from "./AnalyticsStatsRow";
import { MemberGrowthChart } from "./MemberGrowthChart";
import { analyticsStats } from "./mockData";

export function AnalyticsPage() {
  return (
    <div className="space-y-7 p-8">
      <div>
        <p className="font-roboto text-[11px] tracking-[0.18em] text-primary uppercase">
          — Performance Insights
        </p>
        <h2 className="mt-2 font-copperplate text-4xl font-semibold uppercase">
          Analytics
        </h2>
      </div>

      <AnalyticsStatsRow stats={analyticsStats} />

      <MemberGrowthChart />

      <AnalyticsInsightsRow />
    </div>
  );
}
