import { VehicleListCarIcon } from "@/components/common/Svgs";
import { VehicleStatusBadge } from "@/components/staff/vehicles/VehicleStatusBadge";
import { HealthScoreRing } from "./HealthScoreRing";
import type { HealthReport } from "./types";

type HealthReportOverviewProps = {
  report: HealthReport;
};

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="font-roboto text-[9px] tracking-[0.12em] text-section-label uppercase">
        {label}
      </p>
      <p className="font-roboto text-[13px] font-medium tracking-[0.02em] text-foreground">
        {value}
      </p>
    </div>
  );
}

export function HealthReportOverview({ report }: HealthReportOverviewProps) {
  const conditionTone =
    report.healthPercent < 50
      ? "text-pink"
      : report.healthPercent < 70
        ? "text-primary"
        : "text-teal";

  return (
    <section className="px-5 py-5">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-badge-warm/20 bg-badge-warm/8">
            <VehicleListCarIcon
              color="var(--primary)"
              className="h-[18px] w-[34px]"
            />
          </span>

          <div className="min-w-0 space-y-2">
            <h3 className="font-copperplate text-[18px] tracking-[0.04em] text-foreground">
              {report.vehicle}
            </h3>
            <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
              {report.yearColorBay}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <VehicleStatusBadge status={report.healthStatus} />
              {report.isOverdue && <VehicleStatusBadge status="overdue" />}
            </div>
          </div>
        </div>

        <HealthScoreRing value={report.healthPercent} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <InfoCell label="Mileage" value={report.mileage} />
        <InfoCell label="Last Service" value={report.lastService} />
        <InfoCell label="Member" value={report.member} />
        <InfoCell label="Service Due" value={report.serviceDue} />
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <span className={`size-2 rounded-full bg-current ${conditionTone}`} />
        <p
          className={`font-roboto text-[10px] font-semibold tracking-[0.08em] uppercase ${conditionTone}`}
        >
          {report.overallCondition}
        </p>
      </div>
    </section>
  );
}
