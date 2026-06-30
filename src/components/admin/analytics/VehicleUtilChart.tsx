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
import { vehicleUtilIntensity } from "./analyticsChartTheme";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function VehicleUtilChart() {
  const data = useMemo(
    () => ({
      labels: vehicleUtilIntensity.map((_, index) => String(index)),
      datasets: [
        {
          data: vehicleUtilIntensity.map(() => 1),
          backgroundColor: (context: ScriptableContext<"bar">) => {
            const intensity = vehicleUtilIntensity[context.dataIndex] ?? 0.2;
            return `rgba(201, 168, 76, ${intensity})`;
          },
          borderRadius: 3,
          borderSkipped: false,
          barPercentage: 0.98,
          categoryPercentage: 1,
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
      value="68%"
      trend="+8%"
      footerLeft="00h"
      footerCenter="peak 19h"
      footerRight="23h"
    >
      <div className="h-[88px] w-full">
        <Bar data={data} options={options} />
      </div>
    </AnalyticsInsightCard>
  );
}
