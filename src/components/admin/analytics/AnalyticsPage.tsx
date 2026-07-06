"use client";

import { useEffect, useState } from "react";
import { adminAnalyticsApi } from "@/api/adminAnalytics.api";
import {
  createEmptyConciergeLoadChart,
  createEmptyEventAttendanceChart,
  createEmptyMemberGrowthChart,
  createEmptyVehicleUtilChart,
  mapConciergeLoadChart,
  mapEventAttendanceChart,
  mapMemberGrowthChart,
  mapVehicleUtilChart,
} from "@/lib/analyticsDashboard";
import {
  createPlaceholderAnalyticsStats,
  mapAnalyticsStats,
} from "@/lib/analyticsStats";
import { showError } from "@/lib/toast";
import { AnalyticsInsightsRow } from "./AnalyticsInsightsRow";
import { AnalyticsStatsRow } from "./AnalyticsStatsRow";
import { MemberGrowthChart } from "./MemberGrowthChart";
import type {
  AnalyticsStatItem,
  ConciergeLoadChartData,
  EventAttendanceChartData,
  MemberGrowthChartData,
  VehicleUtilChartData,
} from "./types";

export function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStatItem[]>(
    createPlaceholderAnalyticsStats,
  );
  const [loadingStats, setLoadingStats] = useState(true);

  const [memberGrowth, setMemberGrowth] = useState<MemberGrowthChartData>(
    createEmptyMemberGrowthChart,
  );
  const [eventAttendance, setEventAttendance] =
    useState<EventAttendanceChartData>(createEmptyEventAttendanceChart);
  const [conciergeLoad, setConciergeLoad] = useState<ConciergeLoadChartData>(
    createEmptyConciergeLoadChart,
  );
  const [vehicleUtil, setVehicleUtil] = useState<VehicleUtilChartData>(
    createEmptyVehicleUtilChart,
  );
  const [dashboardStatus, setDashboardStatus] = useState<
    "loading" | "error" | "ready"
  >("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const response = await adminAnalyticsApi.getStats();

        if (!cancelled) {
          setStats(mapAnalyticsStats(response.data.kpis));
        }
      } catch (error) {
        if (!cancelled) {
          setStats(createPlaceholderAnalyticsStats());
          showError(
            error instanceof Error
              ? error.message
              : "Failed to load analytics stats.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingStats(false);
        }
      }
    }

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const response = await adminAnalyticsApi.getDashboard();

        if (cancelled) return;

        const { data } = response;
        setMemberGrowth(mapMemberGrowthChart(data.memberGrowth));
        setEventAttendance(mapEventAttendanceChart(data.memberAttendance));
        setConciergeLoad(mapConciergeLoadChart(data.conciergeLoad));
        setVehicleUtil(mapVehicleUtilChart(data.vehicleUtil));
        setDashboardStatus("ready");
      } catch (error) {
        if (!cancelled) {
          setDashboardStatus("error");
          showError(
            error instanceof Error
              ? error.message
              : "Failed to load analytics charts.",
          );
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const chartStatus =
    dashboardStatus === "ready" ? undefined : dashboardStatus;

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

      <AnalyticsStatsRow stats={stats} loading={loadingStats} />

      <MemberGrowthChart data={memberGrowth} status={chartStatus} />

      <AnalyticsInsightsRow
        eventAttendance={eventAttendance}
        conciergeLoad={conciergeLoad}
        vehicleUtil={vehicleUtil}
        status={chartStatus}
      />
    </div>
  );
}
