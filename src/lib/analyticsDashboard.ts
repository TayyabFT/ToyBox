import type {
  ConciergeLoadChartData,
  EventAttendanceChartData,
  MemberGrowthChartData,
  VehicleUtilChartData,
} from "@/components/admin/analytics/types";
import type {
  AdminAnalyticsConciergeLoadRaw,
  AdminAnalyticsMemberAttendanceRaw,
  AdminAnalyticsMemberGrowthRaw,
  AdminAnalyticsVehicleUtilRaw,
} from "@/types/api";

const MONTH_LABELS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function formatMonthLabel(dateStr: string | undefined): string {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  const month = MONTH_LABELS[date.getUTCMonth()] ?? "";
  const year = String(date.getUTCFullYear()).slice(-2);
  return `${month} ${year}`;
}

const MIN_INTENSITY = 0.08;

export function createEmptyMemberGrowthChart(): MemberGrowthChartData {
  return {
    header: "Member Growth — 12 Month Trend",
    months: [],
    cumulative: [],
    newPerMonth: [],
    totalDisplay: "—",
    subtitle: "",
    cumulativeLegend: "Cumulative",
    newLegend: "New / Month",
  };
}

export function mapMemberGrowthChart(
  raw: AdminAnalyticsMemberGrowthRaw | undefined,
): MemberGrowthChartData {
  const cumulativePoints = raw?.series?.cumulative ?? [];
  const newPoints = raw?.series?.new ?? [];
  const pointCount = Math.max(cumulativePoints.length, newPoints.length);

  const months: string[] = [];
  const cumulative: number[] = [];
  const newPerMonth: number[] = [];

  for (let i = 0; i < pointCount; i += 1) {
    const anchor = cumulativePoints[i] ?? newPoints[i];
    months.push(formatMonthLabel(anchor?.x));
    cumulative.push(cumulativePoints[i]?.y ?? 0);
    newPerMonth.push(newPoints[i]?.y ?? 0);
  }

  return {
    header: raw?.header?.trim() || "Member Growth — 12 Month Trend",
    months,
    cumulative,
    newPerMonth,
    totalDisplay:
      raw?.displayValue?.trim() ||
      (raw?.totalMembers != null ? `${raw.totalMembers} Members` : "—"),
    subtitle: raw?.subtitle?.trim() || "",
    cumulativeLegend: raw?.legends?.cumulative?.trim() || "Cumulative",
    newLegend: raw?.legends?.new?.trim() || "New / Month",
  };
}

export function createEmptyEventAttendanceChart(): EventAttendanceChartData {
  return {
    value: "—",
    trend: "",
    footerLeft: "",
    footerRight: "",
    series: [],
    brightIndexes: [],
  };
}

export function mapEventAttendanceChart(
  raw: AdminAnalyticsMemberAttendanceRaw | undefined,
): EventAttendanceChartData {
  const series = (raw?.series ?? []).map((point) => point.y ?? 0);
  const maxValue = series.length ? Math.max(...series) : 0;
  const brightIndexes = series.reduce<number[]>((acc, value, index) => {
    if (maxValue > 0 && value === maxValue) acc.push(index);
    return acc;
  }, []);

  return {
    value: raw?.displayValue?.trim() || "—",
    trend: raw?.deltaLabel?.trim() || "",
    footerLeft: raw?.bottomLeftLabel?.trim() || "",
    footerRight: raw?.bottomRightLabel?.trim() || "",
    series,
    brightIndexes,
  };
}

export function createEmptyConciergeLoadChart(): ConciergeLoadChartData {
  return {
    value: "—",
    trend: "",
    footerLeft: "",
    footerRight: "",
    series: [],
  };
}

export function mapConciergeLoadChart(
  raw: AdminAnalyticsConciergeLoadRaw | undefined,
): ConciergeLoadChartData {
  const series = (raw?.series ?? []).map((point) => point.y ?? 0);

  return {
    value: raw?.displayValue?.trim() || "—",
    trend: raw?.deltaLabel?.trim() || "",
    footerLeft: raw?.bottomLeftLabel?.trim() || "",
    footerRight: raw?.bottomRightLabel?.trim() || "",
    series,
  };
}

export function createEmptyVehicleUtilChart(): VehicleUtilChartData {
  return {
    value: "—",
    trend: "",
    footerLeft: "",
    footerCenter: undefined,
    footerRight: "",
    intensity: [],
  };
}

export function mapVehicleUtilChart(
  raw: AdminAnalyticsVehicleUtilRaw | undefined,
): VehicleUtilChartData {
  const values = (raw?.series ?? []).map((point) => point.y ?? 0);
  const maxValue = values.length ? Math.max(...values) : 0;
  const intensity = values.map((value) =>
    maxValue > 0 ? Math.max(value / maxValue, MIN_INTENSITY) : MIN_INTENSITY,
  );

  return {
    value: raw?.displayValue?.trim() || "—",
    trend: raw?.deltaLabel?.trim() || "",
    footerLeft: raw?.bottomLeftLabel?.trim() || "",
    footerCenter: raw?.bottomCenterLabel?.trim() || undefined,
    footerRight: raw?.bottomRightLabel?.trim() || "",
    intensity,
  };
}
