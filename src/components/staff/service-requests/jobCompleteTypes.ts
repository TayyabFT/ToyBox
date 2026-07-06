import type { StaffActiveJobRaw } from "@/types/api";

export type JobCompleteEvent = {
  at: number;
  completedJobId: string;
  nextJobId: string | null;
  completedJob: StaffActiveJobRaw | null;
};

export type JobCompleteResult = Omit<JobCompleteEvent, "at">;
