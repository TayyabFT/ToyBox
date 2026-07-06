"use client";

import { useMemo } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
  type ScriptableContext,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { AnalyticsInsightCard } from "./AnalyticsInsightCard";
import { PURPLE } from "./analyticsChartTheme";
import type { ConciergeLoadChartData } from "./types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

function buildPurpleGradient(context: ScriptableContext<"line">) {
  const chart = context.chart;
  const { ctx, chartArea } = chart;

  if (!chartArea) {
    return "rgba(158, 138, 212, 0.15)";
  }

  const gradient = ctx.createLinearGradient(
    0,
    chartArea.top,
    0,
    chartArea.bottom,
  );
  gradient.addColorStop(0, "rgba(158, 138, 212, 0.38)");
  gradient.addColorStop(1, "rgba(158, 138, 212, 0)");
  return gradient;
}

type ConciergeLoadChartProps = {
  data: ConciergeLoadChartData;
  status?: "loading" | "error";
};

export function ConciergeLoadChart({ data, status }: ConciergeLoadChartProps) {
  const { value, trend, footerLeft, footerRight, series } = data;

  const chartData = useMemo(
    () => ({
      labels: series.map((_, index) => String(index)),
      datasets: [
        {
          data: series,
          borderColor: PURPLE,
          backgroundColor: buildPurpleGradient,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    }),
    [series],
  );

  const options = useMemo<ChartOptions<"line">>(
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
      title="Concierge Load"
      value={value}
      trend={trend}
      footerLeft={footerLeft}
      footerRight={footerRight}
      status={status}
    >
      <div className="h-[88px] w-full">
        <Line data={chartData} options={options} />
      </div>
    </AnalyticsInsightCard>
  );
}
