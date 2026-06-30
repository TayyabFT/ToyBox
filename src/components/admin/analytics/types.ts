import type { ReactNode } from "react";

export type AnalyticsStatItem = {
  label: string;
  value: string;
  subtext: string;
  trend?: string;
  icon: ReactNode;
};
