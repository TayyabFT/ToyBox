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
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import type { MemberGrowthChartData } from "./types";

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

type MemberGrowthChartProps = {
  data: MemberGrowthChartData;
  status?: "loading" | "error";
};

export function MemberGrowthChart({ data, status }: MemberGrowthChartProps) {
  const {
    header,
    months,
    cumulative,
    newPerMonth,
    totalDisplay,
    subtitle,
    cumulativeLegend,
    newLegend,
  } = data;
  const isLoading = status === "loading";
  const isError = status === "error";
  const lastIndex = months.length - 1;

  const maxCumulative = useMemo(() => {
    const max = cumulative.length ? Math.max(...cumulative) : 0;
    return Math.max(Math.ceil((max || 1) * 1.2), 10);
  }, [cumulative]);

  const chartData = useMemo(
    () => ({
      labels: months,
      datasets: [
        {
          label: cumulativeLegend,
          data: cumulative,
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
          label: newLegend,
          data: newPerMonth,
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
    [months, cumulative, newPerMonth, cumulativeLegend, newLegend, lastIndex],
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
          max: maxCumulative,
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
    [lastIndex, maxCumulative],
  );

  return (
    <section className="rounded-2xl border border-accent/12 bg-card p-6">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <p className="font-roboto text-[10px] tracking-[0.16em] text-secondary uppercase">
            {header}
          </p>
          {isLoading ? (
            <ShimmerBlock className="h-[32px] w-32" />
          ) : (
            <p className="font-copperplate text-[32px] leading-none tracking-[0.04em] text-foreground">
              {totalDisplay}
            </p>
          )}
          {isLoading ? (
            <ShimmerBlock className="h-[14px] w-40" />
          ) : (
            <p className="font-roboto text-[11px] tracking-[0.06em] text-teal">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex shrink-0  items-end gap-2.5 pt-1">
          <div className="flex items-center gap-2">
            <span className="h-px w-5 bg-primary" />
            <span className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
              {cumulativeLegend}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-px w-5 border-t border-dashed border-muted/60" />
            <span className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
              {newLegend}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 h-[200px] w-full">
        {isLoading ? (
          <ShimmerBlock className="h-full w-full rounded-xl" />
        ) : isError ? (
          <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-accent/15">
            <p className="font-roboto text-xs text-secondary">
              Unable to load chart data.
            </p>
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </section>
  );
}
