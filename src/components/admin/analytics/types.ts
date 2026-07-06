import type { ReactNode } from "react";

export type AnalyticsStatItem = {
  label: string;
  value: string;
  subtext: string;
  trend?: string;
  icon: ReactNode;
};

export type MemberGrowthChartData = {
  header: string;
  months: string[];
  cumulative: number[];
  newPerMonth: number[];
  totalDisplay: string;
  subtitle: string;
  cumulativeLegend: string;
  newLegend: string;
};

export type EventAttendanceChartData = {
  value: string;
  trend: string;
  footerLeft: string;
  footerRight: string;
  series: number[];
  brightIndexes: number[];
};

export type ConciergeLoadChartData = {
  value: string;
  trend: string;
  footerLeft: string;
  footerRight: string;
  series: number[];
};

export type VehicleUtilChartData = {
  value: string;
  trend: string;
  footerLeft: string;
  footerCenter?: string;
  footerRight: string;
  intensity: number[];
};
