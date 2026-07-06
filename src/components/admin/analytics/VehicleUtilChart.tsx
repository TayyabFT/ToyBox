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
import type { VehicleUtilChartData } from "./types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type VehicleUtilChartProps = {
  data: VehicleUtilChartData;
  status?: "loading" | "error";
};

export function VehicleUtilChart({ data, status }: VehicleUtilChartProps) {
  const { value, trend, footerLeft, footerCenter, footerRight, intensity } = data;

  const chartData = useMemo(
    () => ({
      labels: intensity.map((_, index) => String(index)),
      datasets: [
        {
          data: intensity.map(() => 1),
          backgroundColor: (context: ScriptableContext<"bar">) => {
            const alpha = intensity[context.dataIndex] ?? 0.2;
            return `rgba(201, 168, 76, ${alpha})`;
          },
          borderRadius: 3,
          borderSkipped: false,
          barPercentage: 0.98,
          categoryPercentage: 1,
        },
      ],
    }),
    [intensity],
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
          max: 1.05,
          grid: { display: false },
        },
      },
      layout: {
        padding: { top: 8, bottom: 0, left: 0, right: 0 },
      },
    }),
    [],
  );

  return (
    <AnalyticsInsightCard
      title="Vehicle Util"
      value={value}
      trend={trend}
      footerLeft={footerLeft}
      footerCenter={footerCenter}
      footerRight={footerRight}
      status={status}
    >
      <div className="h-[88px] w-full">
        <Bar data={chartData} options={options} />
      </div>
    </AnalyticsInsightCard>
  );
}
