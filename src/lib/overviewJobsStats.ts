type OverviewJobsData = {
  pendingConfirm?: number;
  signOffQueue?: number;
  completedToday?: number;
  shiftProgress?: number;
};

export type OverviewJobsStatItem = {
  label: string;
  value: string;
  subtext: string;
  icon: "urgent" | "transport" | "in-progress" | "completed";
};

function formatCount(value?: number): string {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "0";
  }

  return String(value);
}

export function mapOverviewJobsStats(
  data: unknown,
  fallbackStats: OverviewJobsStatItem[],
): OverviewJobsStatItem[] {
  const record =
    data && typeof data === "object" ? (data as OverviewJobsData) : {};

  return [
    {
      label: fallbackStats[0].label,
      value: formatCount(record.pendingConfirm),
      subtext: fallbackStats[0].subtext,
      icon: "urgent",
    },
    {
      label: fallbackStats[1].label,
      value: formatCount(record.signOffQueue),
      subtext: fallbackStats[1].subtext,
      icon: "transport",
    },
    {
      label: fallbackStats[2].label,
      value: formatCount(record.completedToday),
      subtext: fallbackStats[2].subtext,
      icon: "completed",
    },
    {
      label: fallbackStats[3].label,
      value: `${formatCount(record.shiftProgress)}%`,
      subtext: fallbackStats[3].subtext,
      icon: "in-progress",
    },
  ];
}

export function createEmptyOverviewJobsStats(
  fallbackStats: OverviewJobsStatItem[],
): OverviewJobsStatItem[] {
  return mapOverviewJobsStats({}, fallbackStats);
}
