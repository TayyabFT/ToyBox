import { DownloadArrow } from "@/components/common/Svgs";
import { ServiceHistory } from "@/components/staff/vehicles/ServiceHistory";
import { FlaggedIssuesSection } from "./FlaggedIssuesSection";
import { HealthReportOverdueBanner } from "./HealthReportOverdueBanner";
import { HealthReportOverview } from "./HealthReportOverview";
import { SystemBreakdownSection } from "./SystemBreakdownSection";
import type { HealthReport } from "./types";

type HealthReportDetailPanelProps = {
  report: HealthReport;
};

export function HealthReportDetailPanel({ report }: HealthReportDetailPanelProps) {
  const criticalCount = report.systemMetrics.filter(
    (metric) => metric.tone === "pink",
  ).length;

  const cardClass = "overflow-hidden rounded-2xl border border-accent/10 bg-card";

  return (
    <div className="space-y-4">
      <HealthReportOverdueBanner report={report} />

      <section className={cardClass}>
        <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-copperplate text-[15px] tracking-[0.04em] text-foreground uppercase">
            Health Report · {report.reference}
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="font-roboto flex cursor-pointer items-center gap-2 rounded-lg border border-accent/20 bg-surface px-4 py-2 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:bg-accent/8"
            >
              <DownloadArrow />
              Download PDF
            </button>
            <button
              type="button"
              className="font-roboto cursor-pointer rounded-lg bg-gradient-to-r from-gold-bright to-primary px-5 py-2 text-[10px] font-semibold tracking-[0.1em] text-dark uppercase transition-opacity hover:opacity-90"
            >
              Book Service
            </button>
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <HealthReportOverview report={report} />
      </section>

      <section className={cardClass}>
        <SystemBreakdownSection
          metrics={report.systemMetrics}
          criticalCount={criticalCount}
        />
      </section>

      {report.flaggedIssues.length > 0 && (
        <section className={cardClass}>
          <FlaggedIssuesSection issues={report.flaggedIssues} />
        </section>
      )}

      <section className={cardClass}>
        <div className="px-5 py-5">
          <ServiceHistory entries={report.serviceHistory} />
        </div>
      </section>
    </div>
  );
}
