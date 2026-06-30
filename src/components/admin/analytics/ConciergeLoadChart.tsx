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
import { conciergeLoadSeries, PURPLE } from "./analyticsChartTheme";

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

export function ConciergeLoadChart() {
  const data = useMemo(
    () => ({
      labels: conciergeLoadSeries.map((_, index) => String(index)),
      datasets: [
        {
          data: conciergeLoadSeries,
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
    [],
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
      value="487/MO"
      trend="4m 12s"
      footerLeft="Steve handles"
      footerRight="38%"
    >
      <div className="h-[88px] w-full">
        <Line data={data} options={options} />
      </div>
    </AnalyticsInsightCard>
  );
}
