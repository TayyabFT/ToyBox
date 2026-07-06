"use client";

import {
  BoxIcon,
  Car,
  ClockIcon,
  Workshop,
} from "@/components/common/Svgs";
import { StatCard } from "@/components/staff/overview/StatCard";
import type { VehiclesStatsDisplay } from "./types";

type VehiclesStatsRowProps = {
  stats: VehiclesStatsDisplay;
  loading?: boolean;
  activeSummaryKey?: string;
  onSummaryClick?: (summaryKey?: string) => void;
};

export function VehiclesStatsRow({
  stats,
  loading = false,
  activeSummaryKey,
  onSummaryClick,
}: VehiclesStatsRowProps) {
  const cards = [
    {
      key: "total",
      stat: stats.totalVehicles,
      icon: <Car />,
      clickable: false,
    },
    {
      key: "in_storage",
      stat: stats.inStorage,
      icon: <Workshop />,
      clickable: true,
    },
    {
      key: "in_service",
      stat: stats.inService,
      icon: <ClockIcon />,
      clickable: true,
    },
    {
      key: "bay_utilization",
      stat: stats.bayUtilization,
      icon: <BoxIcon />,
      clickable: false,
    },
  ] as const;

  return (
    <div
      className={`grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4 ${
        loading ? "opacity-70" : ""
      }`}
      aria-busy={loading}
    >
      {cards.map(({ key, stat, icon, clickable }) => {
        const isActive =
          !!stat.summaryKey && activeSummaryKey === stat.summaryKey;
        const wrapperClass = [
          clickable && onSummaryClick ? "cursor-pointer" : "",
          isActive ? "rounded-2xl ring-1 ring-primary/50" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={key}
            className={wrapperClass || undefined}
            onClick={
              clickable && onSummaryClick
                ? () => onSummaryClick(stat.summaryKey)
                : undefined
            }
            onKeyDown={
              clickable && onSummaryClick
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      onSummaryClick(stat.summaryKey);
                    }
                  }
                : undefined
            }
            role={clickable && onSummaryClick ? "button" : undefined}
            tabIndex={clickable && onSummaryClick ? 0 : undefined}
          >
            <StatCard
              label={stat.label}
              value={stat.value}
              subtext={stat.subtext}
              trend={stat.trend}
              icon={icon}
              valueLoading={loading}
            />
          </div>
        );
      })}
    </div>
  );
}
