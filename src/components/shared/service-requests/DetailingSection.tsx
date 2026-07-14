import Link from "next/link";
import { DetailingJobCard } from "./DetailingJobCard";
import { ServiceJobListSkeleton } from "./ServiceJobListSkeleton";
import { ServiceSectionHeader } from "./ServiceSectionHeader";
import type { DetailingJob, SectionMeta } from "./types";

type DetailingSectionProps = {
  meta: SectionMeta;
  jobs: DetailingJob[];
  seeAllHref?: string;
  loading?: boolean;
  staffMode?: boolean;
};

export function DetailingSection({
  meta,
  jobs,
  seeAllHref,
  loading = false,
  staffMode = false,
}: DetailingSectionProps) {
  const showSeeAll = Boolean(seeAllHref && meta.requestCount > jobs.length);

  return (
    <section
      className="rounded-2xl border border-[#D4A8471A] bg-surface p-5"
      aria-busy={loading}
    >
      <ServiceSectionHeader
        meta={meta}
        actions={
          showSeeAll ? (
            <Link
              href={seeAllHref!}
              className="font-roboto rounded-full border border-primary/30 px-4 py-2 text-[9px] font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:border-primary/60 hover:bg-primary/[0.06]"
            >
              See All
            </Link>
          ) : null
        }
      />

      {loading && jobs.length === 0 ? (
        <ServiceJobListSkeleton count={2} />
      ) : null}

      {!loading && jobs.length === 0 ? (
        <p className="font-roboto py-6 text-center text-sm text-secondary">
          No detailing bookings yet.
        </p>
      ) : null}

      {!loading && jobs.length > 0 ? (
        <div className="space-y-3">
          {jobs.map((job) => (
            <DetailingJobCard key={job.id} job={job} staffMode={staffMode} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
