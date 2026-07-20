import { JobActionButton } from "./JobActionButton";
import { JobProgressBar } from "./JobProgressBar";
import { JobStatusBadge } from "./JobStatusBadge";
import type { MaintenanceJob } from "./types";

type MaintenanceJobCardProps = {
  job: MaintenanceJob;
  staffMode?: boolean;
};

export function MaintenanceJobCard({ job, staffMode = false }: MaintenanceJobCardProps) {
  const isInProgress = job.status === "in-progress";

  return (
    <article className="space-y-4 rounded-xl border border-[#D4A8471A] bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-roboto text-[12px] font-medium tracking-[0.02em] text-foreground">
          {job.title}
        </h4>
        <JobStatusBadge label={job.statusLabel} tone={job.status} />
      </div>

      <p className="font-copperplate text-[9px] tracking-[0.1em] text-secondary uppercase">
        {job.jobId} · {job.vehicle}
        {job.member !== "—" ? ` · ${job.member}` : ""}
        {isInProgress ? ` · ${job.centre}` : ""}
      </p>

      {isInProgress ? (
        <div className="space-y-1.5">
          <p className="font-roboto text-[9px] tracking-[0.08em] text-secondary uppercase">
            Started {job.startedAt} · Est. done {job.estimatedDone}
          </p>
          <p className="font-roboto text-[10px] tracking-[0.03em] text-foreground">
            Cost {job.estimatedCost}
          </p>
          {job.progress !== undefined && (
            <div className="space-y-1 pt-1">
              <JobProgressBar
                value={job.progress}
                tone="gold"
                note={`${job.workshop} · ${job.progressNote}`}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <p className="font-roboto text-[9px] tracking-[0.08em] text-secondary uppercase">
            Service type: {job.serviceType}
          </p>
          <p className="font-roboto text-[9px] tracking-[0.08em] text-secondary uppercase">
            Centre: {job.centre}
          </p>
          {job.scheduledAt ? (
            <p className="font-roboto text-[9px] tracking-[0.08em] text-secondary uppercase">
              Scheduled {job.scheduledAt}
            </p>
          ) : null}
          <p className="font-roboto text-[10px] tracking-[0.03em] text-foreground">
            Est. cost: {job.estimatedCost}
          </p>
          {job.notes ? (
            <p className="font-roboto text-[9px] tracking-[0.04em] text-secondary">
              Notes: {job.notes}
            </p>
          ) : null}
        </div>
      )}

      {/* {!staffMode ? (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {isInProgress ? (
            <JobActionButton label="View Job Card" />
          ) : (
            <>
              <JobActionButton label="Action Required" variant="danger-outline" />
              <JobActionButton label="Book Centre" />
              <JobActionButton label="Notify Member" variant="gold" />
            </>
          )}
        </div>
      ) : null} */}
    </article>
  );
}
