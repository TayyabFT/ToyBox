import { AlertTriangle } from "@/components/common/Svgs";
import type { HealthReport } from "./types";

type HealthReportOverdueBannerProps = {
  report: HealthReport;
};

export function HealthReportOverdueBanner({ report }: HealthReportOverdueBannerProps) {
  if (!report.isOverdue || !report.overdueDays) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-pink/25 bg-pink/[0.04]">
      <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-pink/30 bg-pink/10 [&_svg]:size-4">
          <AlertTriangle color="var(--pink)" />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="font-roboto text-[11px] font-semibold tracking-[0.08em] text-pink uppercase">
            Service Overdue — {report.overdueDays} Days
          </p>
          <p className="font-roboto text-[11px] tracking-[0.02em] text-secondary">
            {report.overdueSummary}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="font-roboto shrink-0 cursor-pointer rounded-lg border border-primary/35 bg-transparent px-4 py-2 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:bg-primary/10"
      >
        Book Service
      </button>
      </div>
    </section>
  );
}
