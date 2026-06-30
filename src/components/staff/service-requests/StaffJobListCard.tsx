import { JobProgressBar } from "@/components/shared/service-requests/JobProgressBar";
import { JobStatusBadge } from "@/components/shared/service-requests/JobStatusBadge";
import type { StaffJobListItem } from "@/lib/staffJobs";

type StaffJobListCardProps = {
  job: StaffJobListItem;
};

export function StaffJobListCard({ job }: StaffJobListCardProps) {
  return (
    <article className="space-y-3 rounded-xl border border-[#D4A8471A] bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h4 className="font-roboto text-[12px] font-medium tracking-[0.02em] text-foreground">
            {job.referenceType}
          </h4>
          <p className="font-copperplate text-[9px] tracking-[0.1em] text-secondary uppercase">
            {job.referenceNumber}
          </p>
        </div>
        <JobStatusBadge label={job.statusLabel} tone={job.statusTone} />
      </div>

      {job.metaLine ? (
        <p className="font-roboto text-[10px] tracking-[0.03em] text-secondary">
          {job.metaLine}
        </p>
      ) : null}

      {typeof job.progressPercent === "number" && job.progressPercent > 0 ? (
        <JobProgressBar
          value={job.progressPercent}
          tone="gold"
          note={`${job.progressPercent}%`}
        />
      ) : null}
    </article>
  );
}
