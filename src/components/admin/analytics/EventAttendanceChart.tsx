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
import {
  eventAttendanceBars,
  eventAttendanceBrightBars,
  GOLD_BRIGHT,
  GOLD_MUTED,
} from "./analyticsChartTheme";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function EventAttendanceChart() {
  const data = useMemo(
    () => ({
      labels: eventAttendanceBars.map((_, index) => String(index)),
      datasets: [
        {
          data: eventAttendanceBars,
          backgroundColor: (context: ScriptableContext<"bar">) =>
            eventAttendanceBrightBars.has(context.dataIndex)
              ? GOLD_BRIGHT
              : GOLD_MUTED,
          borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
          borderSkipped: false,
          barPercentage: 0.72,
          categoryPercentage: 0.92,
        },
      ],
    }),
    [],
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
          max: 100,
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
      value="87%"
      trend="+4%"
      footerLeft="12m"
      footerRight="Concours - 100%"
    >
      <div className="h-[88px] w-full">
        <Bar data={data} options={options} />
      </div>
    </AnalyticsInsightCard>
  );
}
