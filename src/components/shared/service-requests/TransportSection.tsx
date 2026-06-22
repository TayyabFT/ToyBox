import Link from "next/link";
import { ServiceSectionHeader } from "./ServiceSectionHeader";
import { TransportJobCard } from "./TransportJobCard";
import type { SectionMeta, TransportJob } from "./types";

type TransportSectionProps = {
  meta: SectionMeta;
  jobs: TransportJob[];
  seeAllHref?: string;
  loading?: boolean;
};

export function TransportSection({
  meta,
  jobs,
  seeAllHref,
  loading = false,
}: TransportSectionProps) {
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
          ) : null
        }
      />

      {loading && jobs.length === 0 ? (
        <p className="font-roboto py-6 text-center text-sm text-secondary">
          Loading transport requests...
        </p>
      ) : null}

      {!loading && jobs.length === 0 ? (
        <p className="font-roboto py-6 text-center text-sm text-secondary">
          No transport requests yet.
        </p>
      ) : null}

      <div className="space-y-3">
        {jobs.map((job) => (
          <TransportJobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
