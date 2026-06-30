import type { ReactNode } from "react";
import { TrendUp } from "@/components/common/Svgs";

type AnalyticsInsightCardProps = {
  title: string;
  value: string;
  trend: string;
  children: ReactNode;
  footerLeft: string;
  footerRight: string;
  footerCenter?: string;
};

export function AnalyticsInsightCard({
  title,
  value,
  trend,
  children,
  footerLeft,
  footerRight,
  footerCenter,
}: AnalyticsInsightCardProps) {
  return (
    <section className="flex min-h-[220px] flex-col rounded-2xl border border-accent/12 bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-roboto text-[10px] tracking-[0.16em] text-secondary uppercase">
          {title}
        </p>
        <span className="font-roboto flex shrink-0 items-center gap-0.5 text-[11px] font-medium tracking-[0.04em] text-teal">
          <TrendUp color="currentColor" className="rotate-180" />
          {trend}
        </span>
      </div>

      <p className="mt-3 font-copperplate text-[34px] leading-none tracking-[0.02em] text-foreground">
        {value}
      </p>

      <div className="mt-4 min-h-[88px] flex-1">{children}</div>

      <div className="relative mt-4 flex items-center justify-between">
        <span className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
          {footerLeft}
        </span>
        {footerCenter ? (
          <span className="font-roboto absolute left-1/2 -translate-x-1/2 text-[10px] tracking-[0.1em] text-secondary uppercase">
            {footerCenter}
          </span>
        ) : null}
        <span className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
          {footerRight}
        </span>
      </div>
    </section>
  );
}
