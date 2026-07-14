import type { ReactNode } from "react";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { TrendUp } from "@/components/common/Svgs";

type AnalyticsInsightCardStatus = "loading" | "error";

type AnalyticsInsightCardProps = {
  title: string;
  value: string;
  trend: string;
  children: ReactNode;
  footerLeft: string;
  footerRight: string;
  footerCenter?: string;
  status?: AnalyticsInsightCardStatus;
};

export function AnalyticsInsightCard({
  title,
  value,
  trend,
  children,
  footerLeft,
  footerRight,
  footerCenter,
  status,
}: AnalyticsInsightCardProps) {
  const isLoading = status === "loading";
  const isError = status === "error";

  return (
    <section className="flex min-h-[220px] flex-col rounded-2xl border border-accent/12 bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-roboto text-[10px] tracking-[0.16em] text-secondary uppercase">
          {title}
        </p>
        {isLoading ? (
          <ShimmerBlock className="h-[14px] w-10" />
        ) : !isError && trend ? (
          <span className="font-roboto flex shrink-0 items-center gap-0.5 text-[11px] font-medium tracking-[0.04em] text-teal">
            <TrendUp color="currentColor" className="rotate-180" />
            {trend}
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <ShimmerBlock className="mt-3 h-[34px] w-24" />
      ) : (
        <p className="mt-3 font-copperplate text-[34px] leading-none tracking-[0.02em] text-foreground">
          {value}
        </p>
      )}

      <div className="mt-4 min-h-[88px] flex-1">
        {isLoading ? (
          <ShimmerBlock className="h-full w-full" />
        ) : isError ? (
          <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-accent/15">
            <p className="font-roboto text-[11px] text-secondary">
              Unable to load.
            </p>
          </div>
        ) : (
          children
        )}
      </div>

      <div className="relative mt-4 flex items-center justify-between">
        {isLoading ? (
          <ShimmerBlock className="h-[10px] w-14" />
        ) : (
          <span className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
            {footerLeft}
          </span>
        )}
        {footerCenter && !isLoading && !isError ? (
          <span className="font-roboto absolute left-1/2 -translate-x-1/2 text-[10px] tracking-[0.1em] text-secondary uppercase">
            {footerCenter}
          </span>
        ) : null}
        {isLoading ? (
          <ShimmerBlock className="h-[10px] w-14" />
        ) : (
          <span className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
            {footerRight}
          </span>
        )}
      </div>
    </section>
  );
}
