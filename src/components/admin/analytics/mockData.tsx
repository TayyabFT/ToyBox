import {
  AnalyticsChartBars,
  MemberCheckStat,
  MemberStarStat,
  MemberTargetStat,
  NavAnalytics,
} from "@/components/common/Svgs";
import type { AnalyticsStatItem } from "./types";

export const analyticsStats: AnalyticsStatItem[] = [
  {
    label: "Growth · 90d",
    value: "+18",
    subtext: "New Members",
    trend: "+22%",
    icon: <AnalyticsChartBars className="size-4" />,
  },
  {
    label: "Retention",
    value: "98%",
    subtext: "Ytd",
    trend: "+1%",
    icon: <MemberCheckStat color="var(--primary)" className="size-4" />,
  },
  {
    label: "Nps",
    value: "94",
    subtext: "89 Resp",
    trend: "+2",
    icon: <MemberStarStat color="var(--primary)" className="size-4" />,
  },
  {
    label: "Engagement",
    value: "87%",
    subtext: "Monthly Active",
    icon: <MemberTargetStat className="size-4" />,
  },
];
