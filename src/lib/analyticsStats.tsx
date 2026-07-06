import {
  AnalyticsChartBars,
  MemberCheckStat,
  MemberStarStat,
  MemberTargetStat,
} from "@/components/common/Svgs";
import type { AnalyticsStatItem } from "@/components/admin/analytics/types";
import type { AdminAnalyticsKpiRaw, AdminAnalyticsKpis } from "@/types/api";

function mapKpi(
  kpi: AdminAnalyticsKpiRaw | undefined,
  fallbackLabel: string,
  icon: AnalyticsStatItem["icon"],
): AnalyticsStatItem {
  return {
    label: kpi?.label?.trim() || fallbackLabel,
    value: kpi?.displayValue?.trim() || (kpi?.value != null ? String(kpi.value) : "—"),
    subtext: kpi?.subtitle?.trim() || "",
    trend: kpi?.deltaLabel?.trim() || undefined,
    icon,
  };
}

export function createPlaceholderAnalyticsStats(): AnalyticsStatItem[] {
  return [
    {
      label: "Growth · 30d",
      value: "—",
      subtext: "New Members",
      icon: <AnalyticsChartBars className="size-4" />,
    },
    {
      label: "Retention",
      value: "—",
      subtext: "Ytd",
      icon: <MemberCheckStat color="var(--primary)" className="size-4" />,
    },
    {
      label: "Nps",
      value: "—",
      subtext: "Resp",
      icon: <MemberStarStat color="var(--primary)" className="size-4" />,
    },
    {
      label: "Engagement",
      value: "—",
      subtext: "Monthly Active",
      icon: <MemberTargetStat className="size-4" />,
    },
  ];
}

export function mapAnalyticsStats(
  kpis: AdminAnalyticsKpis | undefined,
): AnalyticsStatItem[] {
  return [
    mapKpi(kpis?.growth, "Growth", <AnalyticsChartBars className="size-4" />),
    mapKpi(
      kpis?.retention,
      "Retention",
      <MemberCheckStat color="var(--primary)" className="size-4" />,
    ),
    mapKpi(
      kpis?.nps,
      "NPS",
      <MemberStarStat color="var(--primary)" className="size-4" />,
    ),
    mapKpi(
      kpis?.engagement,
      "Engagement",
      <MemberTargetStat className="size-4" />,
    ),
  ];
}
