import type {
  ServiceCategory,
  ServiceRequestFilter,
} from "@/components/shared/service-requests/types";

type FilterableJob = {
  category: ServiceCategory;
  isUrgent?: boolean;
  isOverdue?: boolean;
  status: string;
};

export function matchesServiceRequestFilter(
  job: FilterableJob,
  filter: ServiceRequestFilter,
): boolean {
  if (filter === "all") return true;

  if (filter === "urgent") {
    return (
      job.isUrgent === true ||
      job.isOverdue === true ||
      job.status === "urgent" ||
      job.status === "overdue"
    );
  }

  return job.category === filter;
}

export function filterTransportJobs<T extends FilterableJob>(
  jobs: T[],
  filter: ServiceRequestFilter,
): T[] {
  return jobs.filter((job) => matchesServiceRequestFilter(job, filter));
}

export function filterMaintenanceJobs<T extends FilterableJob>(
  jobs: T[],
  filter: ServiceRequestFilter,
): T[] {
  return jobs.filter((job) => matchesServiceRequestFilter(job, filter));
}

export function filterDetailingJobs<T extends FilterableJob>(
  jobs: T[],
  filter: ServiceRequestFilter,
): T[] {
  return jobs.filter((job) => matchesServiceRequestFilter(job, filter));
}
