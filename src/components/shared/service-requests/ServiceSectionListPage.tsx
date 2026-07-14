import Link from "next/link";
import { ServiceJobListSkeleton } from "./ServiceJobListSkeleton";
import { ServiceSectionHeader } from "./ServiceSectionHeader";
import type { SectionMeta } from "./types";
import type { ReactNode } from "react";

type ServiceSectionListPageProps = {
  backHref: string;
  meta: SectionMeta;
  loading: boolean;
  jobCount: number;
  loadingText?: string;
  emptyText: string;
  children: ReactNode;
};

export function ServiceSectionListPage({
  backHref,
  meta,
  loading,
  jobCount,
  emptyText,
  children,
}: ServiceSectionListPageProps) {
  return (
    <div className="space-y-7 p-8">
      <Link
        href={backHref}
        className="font-roboto inline-flex text-[10px] font-semibold tracking-[0.12em] text-secondary uppercase transition-colors hover:text-primary"
      >
        ← Back to service requests
      </Link>

      <section
        className="rounded-2xl border border-[#D4A8471A] bg-surface p-5"
        aria-busy={loading}
      >
        <ServiceSectionHeader meta={meta} />

        {loading && jobCount === 0 ? <ServiceJobListSkeleton count={4} /> : null}

        {!loading && jobCount === 0 ? (
          <p className="font-roboto py-8 text-center text-sm text-secondary">
            {emptyText}
          </p>
        ) : null}

        {!loading && jobCount > 0 ? (
          <div className="space-y-3">{children}</div>
        ) : null}
      </section>
    </div>
  );
}
