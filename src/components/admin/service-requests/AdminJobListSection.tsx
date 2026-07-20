import { ServiceJobListSkeleton } from "@/components/shared/service-requests/ServiceJobListSkeleton";
import { ServiceSectionHeader } from "@/components/shared/service-requests/ServiceSectionHeader";
import { StaffJobListCard } from "@/components/staff/service-requests/StaffJobListCard";
import type { StaffJobListItem } from "@/lib/staffJobs";

type AdminJobListSectionProps = {
  title: string;
  highlightLabel: string;
  jobs: StaffJobListItem[];
  loading: boolean;
  emptyText: string;
  onSelect: (jobId: string) => void;
  scrollable?: boolean;
};

export function AdminJobListSection({
  title,
  highlightLabel,
  jobs,
  loading,
  emptyText,
  onSelect,
  scrollable = false,
}: AdminJobListSectionProps) {
  return (
    <section
      className="rounded-2xl border border-[#D4A8471A] bg-surface p-5"
      aria-busy={loading}
    >
      <ServiceSectionHeader
        meta={{ title, requestCount: jobs.length, highlightLabel }}
      />

      {loading && jobs.length === 0 ? (
        <ServiceJobListSkeleton count={2} />
      ) : null}

      {!loading && jobs.length === 0 ? (
        <p className="font-roboto py-6 text-center text-sm text-secondary">
          {emptyText}
        </p>
      ) : null}

      {!loading && jobs.length > 0 ? (
        <div
          className={
            scrollable
              ? "Custom__Scrollbar max-h-[420px] space-y-3 overflow-y-auto pr-1"
              : "space-y-3"
          }
        >
          {jobs.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => onSelect(job.id)}
              className="block w-full cursor-pointer text-left"
            >
              <StaffJobListCard job={job} />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
