import { AssigneeBadge, JobActionButton } from "./JobActionButton";
import { JobStatusBadge } from "./JobStatusBadge";
import type { TransportJob } from "./types";

type TransportJobCardProps = {
  job: TransportJob;
  staffMode?: boolean;
};

export function TransportJobCard({ job, staffMode = false }: TransportJobCardProps) {
  const isAssigned = Boolean(job.assignee);

  return (
    <article className="space-y-4 rounded-xl border border-[#D4A8471A] bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-roboto text-[12px] font-medium tracking-[0.02em] text-foreground">
          {job.title}
        </h4>
        <JobStatusBadge label={job.statusLabel} tone={job.status} />
      </div>

      <div className="space-y-1">
        <p className="font-copperplate text-[9px] tracking-[0.1em] text-secondary uppercase">
          {job.jobId} · {job.vehicle} · {job.member}
          {job.tier ? ` · ${job.tier}` : ""}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <span className="font-roboto shrink-0 text-[9px] tracking-[0.1em] text-secondary uppercase">
            From
          </span>
          <span className="font-roboto text-[10px] tracking-[0.03em] text-foreground">
            {job.from}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-roboto shrink-0 text-[9px] tracking-[0.1em] text-secondary uppercase">
            To
          </span>
          <span className="font-roboto text-[10px] tracking-[0.03em] text-foreground">
            {job.to}
          </span>
        </div>
      </div>

      <p className="font-roboto text-[9px] tracking-[0.1em] text-secondary uppercase">
        Scheduled {job.scheduled}
      </p>

      {job.notes ? (
        <p className="font-roboto text-[9px] tracking-[0.04em] text-secondary">
          Notes: {job.notes}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {staffMode ? (
          isAssigned ? <AssigneeBadge label={job.assignee!} /> : null
        ) : isAssigned ? (
          <>
            <AssigneeBadge label={job.assignee!} />
            <JobActionButton label="View Details" />
          </>
        ) : (
          <>
            <JobActionButton label="Unassigned" variant="gray" />
            <JobActionButton label="View Details" />
            <JobActionButton label="Accept Job" variant="gold" />
          </>
        )}
      </div>
    </article>
  );
}
