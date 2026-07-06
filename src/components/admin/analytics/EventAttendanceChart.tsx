"use client";

import { useMemo } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  type ChartOptions,
  type ScriptableContext,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { AnalyticsInsightCard } from "./AnalyticsInsightCard";
import { GOLD_BRIGHT, GOLD_MUTED } from "./analyticsChartTheme";
import type { EventAttendanceChartData } from "./types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type EventAttendanceChartProps = {
  data: EventAttendanceChartData;
  status?: "loading" | "error";
};

export function EventAttendanceChart({ data, status }: EventAttendanceChartProps) {
  const { value, trend, footerLeft, footerRight, series, brightIndexes } = data;
  const brightSet = useMemo(() => new Set(brightIndexes), [brightIndexes]);

  const chartData = useMemo(
    () => ({
      labels: series.map((_, index) => String(index)),
      datasets: [
        {
          data: series,
          backgroundColor: (context: ScriptableContext<"bar">) =>
            brightSet.has(context.dataIndex) ? GOLD_BRIGHT : GOLD_MUTED,
          borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
          borderSkipped: false,
          barPercentage: 0.72,
          categoryPercentage: 0.92,
        },
      ],
    }),
    [series, brightSet],
  );

  const options = useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          display: false,
          grid: { display: false },
        },
        y: {
          display: false,
          min: 0,
          grid: { display: false },
        },
      },
      layout: {
        padding: { top: 4, bottom: 0, left: 0, right: 0 },
      },
    }),
    [],
  );

  return (
    <AnalyticsInsightCard
      title="Event Attendance"
      value={value}
      trend={trend}
      footerLeft={footerLeft}
      footerRight={footerRight}
      status={status}
    >
      <div className="h-[88px] w-full">
        <Bar data={chartData} options={options} />
      </div>
    </AnalyticsInsightCard>
  );
}
