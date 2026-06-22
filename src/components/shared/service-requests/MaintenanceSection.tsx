import Link from "next/link";
import { JobActionButton } from "./JobActionButton";
import { MaintenanceJobCard } from "./MaintenanceJobCard";
import { ServiceSectionHeader } from "./ServiceSectionHeader";
import type { MaintenanceJob, SectionMeta } from "./types";

type MaintenanceSectionProps = {
  meta: SectionMeta;
  jobs: MaintenanceJob[];
  seeAllHref?: string;
  loading?: boolean;
};

export function MaintenanceSection({
  meta,
  jobs,
  seeAllHref,
  loading = false,
}: MaintenanceSectionProps) {
  const showSeeAll = Boolean(seeAllHref && meta.requestCount > jobs.length);

  return (
    <section
      className={`rounded-2xl border border-[#D4A8471A] bg-surface p-5 ${
        loading ? "opacity-70" : ""
      }`}
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
          ) : (
            <>
              <JobActionButton label="Create Invoice" />
              <JobActionButton label="Assign Next ▾" />
            </>
          )
        }
      />

      {loading && jobs.length === 0 ? (
        <p className="font-roboto py-6 text-center text-sm text-secondary">
          Loading maintenance requests...
        </p>
      ) : null}

      {!loading && jobs.length === 0 ? (
        <p className="font-roboto py-6 text-center text-sm text-secondary">
          No maintenance requests yet.
        </p>
      ) : null}

      <div className="space-y-3">
        {jobs.map((job) => (
          <MaintenanceJobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
