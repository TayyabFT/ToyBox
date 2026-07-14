"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Building,
  Car,
  CircleCheck,
  ClockSmall,
} from "@/components/common/Svgs";
import { StatCard } from "@/components/staff/overview/StatCard";
import { showError } from "@/lib/toast";
import { serviceRequestStats as emptyStats } from "./mockData";
import type { ServiceRequestStat } from "./types";

function createEmptyStats(): ServiceRequestStat[] {
  return emptyStats.map((stat) => ({
    ...stat,
    value: stat.value.includes("%") ? "0%" : "0",
  }));
}

function statIcon(icon: ServiceRequestStat["icon"]) {
  switch (icon) {
    case "urgent":
      return <Building active stroke="var(--primary)" />;
    case "transport":
      return <Car />;
    case "in-progress":
      return <ClockSmall color="var(--primary)" />;
    case "completed":
      return <CircleCheck active />;
  }
}

type ServiceRequestsStatsRowProps = {
  loadStats: () => Promise<ServiceRequestStat[]>;
};

export function ServiceRequestsStatsRow({
  loadStats,
}: ServiceRequestsStatsRowProps) {
  const [stats, setStats] = useState<ServiceRequestStat[]>(createEmptyStats);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);

    try {
      setStats(await loadStats());
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load service request stats";

      showError(message);
      setStats(createEmptyStats());
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
      aria-busy={loading}
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          subtext={stat.subtext}
          icon={statIcon(stat.icon)}
          valueLoading={loading}
        />
      ))}
    </div>
  );
}
