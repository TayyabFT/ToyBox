"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  type ChartOptions,
  type ScriptableContext,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  memberGrowthCumulative,
  memberGrowthMonths,
  memberGrowthNewPerMonth,
  memberGrowthSummary,
} from "./memberGrowthChartData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

const GOLD = "#C9A84C";
const MUTED = "#7D7460";
const TEAL = "#7DBFA0";
const PURPLE = "#9E8AD4";
const GRID = "rgba(212, 168, 71, 0.08)";

function buildCumulativeGradient(context: ScriptableContext<"line">) {
  const chart = context.chart;
  const { ctx, chartArea } = chart;

  if (!chartArea) {
    return "rgba(201, 168, 76, 0.12)";
  }

  const gradient = ctx.createLinearGradient(
    0,
    chartArea.top,
    0,
    chartArea.bottom,
  );
  gradient.addColorStop(0, "rgba(201, 168, 76, 0.32)");
  gradient.addColorStop(0.55, "rgba(201, 168, 76, 0.10)");
  gradient.addColorStop(1, "rgba(201, 168, 76, 0)");
  return gradient;
}

export function MemberGrowthChart() {
  const lastIndex = memberGrowthMonths.length - 1;

  const data = useMemo(
    () => ({
      labels: [...memberGrowthMonths],
      datasets: [
        {
          label: "Cumulative",
          data: memberGrowthCumulative,
          borderColor: GOLD,
          backgroundColor: buildCumulativeGradient,
          borderWidth: 2,
          fill: true,
          tension: 0.38,
          pointRadius: (context: ScriptableContext<"line">) =>
            context.dataIndex === lastIndex ? 5 : 0,
          pointHoverRadius: (context: ScriptableContext<"line">) =>
            context.dataIndex === lastIndex ? 5 : 0,
          pointBackgroundColor: GOLD,
          pointBorderColor: GOLD,
          pointBorderWidth: 0,
        },
        {
          label: "New / Month",
          data: memberGrowthNewPerMonth,
          borderColor: "rgba(125, 116, 96, 0.55)",
          borderWidth: 1.5,
          borderDash: [5, 5],
          fill: false,
          tension: 0.38,
          pointRadius: 4,
          pointHoverRadius: 4,
          pointBackgroundColor: PURPLE,
          pointBorderColor: PURPLE,
          pointBorderWidth: 0,
        },
      ],
    }),
    [lastIndex],
  );

  const options = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: "#11100C",
          borderColor: "rgba(212, 168, 71, 0.25)",
          borderWidth: 1,
          titleColor: MUTED,
          bodyColor: "#F2EAD5",
          padding: 10,
          displayColors: true,
          boxPadding: 4,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: (context) =>
              context.index === lastIndex ? GOLD : MUTED,
            font: {
              family: "var(--font-roboto), sans-serif",
              size: 10,
              weight: 500,
            },
            padding: 8,
            maxRotation: 0,
            autoSkip: false,
          },
        },
        y: {
          display: true,
          position: "left",
          min: 0,
          max: 160,
          ticks: { display: false },
          grid: {
            color: GRID,
            drawTicks: false,
          },
          border: { display: false },
        },
      },
      layout: {
        padding: { top: 8, right: 4, left: 0, bottom: 0 },
      },
    }),
    [lastIndex],
  );

  return (
    <section className="rounded-2xl border border-accent/12 bg-card p-6">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <p className="font-roboto text-[10px] tracking-[0.16em] text-secondary uppercase">
            Member Growth — 12 Month Trend
          </p>
          <p className="font-copperplate text-[32px] leading-none tracking-[0.04em] text-foreground">
            {memberGrowthSummary.totalMembers} Members
          </p>
          <p className="font-roboto text-[11px] tracking-[0.06em] text-teal">
            {memberGrowthSummary.trailingGrowth} ·{" "}
            {memberGrowthSummary.trailingLabel}
          </p>
        </div>

        <div className="flex shrink-0  items-end gap-2.5 pt-1">
          <div className="flex items-center gap-2">
            <span className="h-px w-5 bg-primary" />
            <span className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
              Cumulative
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-px w-5 border-t border-dashed border-muted/60" />
            <span className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
              New / Month
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 h-[200px] w-full">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}
