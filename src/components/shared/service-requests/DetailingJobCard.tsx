import { JobActionButton } from "./JobActionButton";
import { JobProgressBar } from "./JobProgressBar";
import { JobStatusBadge } from "./JobStatusBadge";
import type { DetailingJob } from "./types";

type DetailingJobCardProps = {
  job: DetailingJob;
};

export function DetailingJobCard({ job }: DetailingJobCardProps) {
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
        {job.location ? ` · ${job.location}` : ""}
      </p>

      {isInProgress ? (
        <div className="space-y-1.5">
          <p className="font-roboto text-[9px] tracking-[0.08em] text-secondary uppercase">
            Type: {job.type}
            {job.addOn ? ` · Add-on: ${job.addOn}` : ""}
          </p>
          <p className="font-roboto text-[10px] tracking-[0.03em] text-foreground">
            Estimate: {job.estimate}
          </p>
          {job.notes ? (
            <p className="font-roboto text-[9px] tracking-[0.04em] text-secondary">
              Notes: {job.notes}
            </p>
          ) : null}
          {job.progress !== undefined && (
            <div className="pt-1">
              <JobProgressBar
                value={job.progress}
                tone="teal"
                note={job.progressNote}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <p className="font-roboto text-[9px] tracking-[0.08em] text-secondary uppercase">
            Type: {job.type}
            {job.addOn ? ` · Add-on: ${job.addOn}` : ""}
          </p>
          {job.scheduled && (
            <p className="font-roboto text-[9px] tracking-[0.08em] text-secondary uppercase">
              Scheduled {job.scheduled}
            </p>
          )}
          <p className="font-roboto text-[10px] tracking-[0.03em] text-foreground">
            Estimate: {job.estimate}
          </p>
          {job.notes ? (
            <p className="font-roboto text-[9px] tracking-[0.04em] text-secondary">
              Notes: {job.notes}
            </p>
          ) : null}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {isInProgress ? (
          <JobActionButton label="Update Status" />
        ) : (
          <>
            <JobActionButton label="Unassigned" variant="gray" />
            <JobActionButton label="Assign Tech" />
            <JobActionButton label="Accept Job" variant="gold" />
          </>
        )}
      </div>
    </article>
  );
}
