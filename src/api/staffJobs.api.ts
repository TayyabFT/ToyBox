import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  StaffActiveJobResponse,
  StaffActiveJobRaw,
  StaffJobActiveNoteRequest,
  StaffJobActiveNoteResponse,
  StaffJobCompleteResponse,
  StaffJobMutationResponse,
  StaffJobNotesResponse,
  StaffJobProgressResponse,
  StaffJobQueueResponse,
  StaffJobCompletedResponse,
  StaffJobScheduleRequest,
  StaffJobStartRequest,
} from "@/types/api";

export const staffJobsApi = {
  getActive: () =>
    apiClient<StaffActiveJobResponse>(API_ENDPOINTS.staffJobs.active),

  getQueue: () =>
    apiClient<StaffJobQueueResponse>(API_ENDPOINTS.staffJobs.queue),

  getCompleted: () =>
    apiClient<StaffJobCompletedResponse>(API_ENDPOINTS.staffJobs.completed),

  getProgress: (jobId: string) =>
    apiClient<StaffJobProgressResponse>(API_ENDPOINTS.staffJobs.progress(jobId)),

  getNotes: (referenceId: string) =>
    apiClient<StaffJobNotesResponse>(
      API_ENDPOINTS.staffJobs.notesByReference(referenceId),
    ),

  schedule: (jobId: string, body: StaffJobScheduleRequest) =>
    apiClient<StaffJobMutationResponse>(
      API_ENDPOINTS.staffJobs.schedule(jobId),
      {
        method: "POST",
        body,
      },
    ),

  start: (jobId: string, body: StaffJobStartRequest) =>
    apiClient<StaffJobMutationResponse>(API_ENDPOINTS.staffJobs.start(jobId), {
      method: "POST",
      body,
    }),

  completeSubtask: (jobId: string, key: string) =>
    apiClient<StaffJobMutationResponse>(
      API_ENDPOINTS.staffJobs.subtask(jobId, key),
      {
        method: "PATCH",
      },
    ),

  complete: (jobId: string) =>
    apiClient<StaffJobCompleteResponse>(API_ENDPOINTS.staffJobs.complete(jobId), {
      method: "POST",
    }),

  addNote: (body: StaffJobActiveNoteRequest) =>
    apiClient<StaffJobActiveNoteResponse>(API_ENDPOINTS.staffJobs.activeNotes, {
      method: "POST",
      body,
    }),

  addPhoto: (image: File, caption?: string) => {
    const formData = new FormData();
    formData.append("image", image);

    if (caption?.trim()) {
      formData.append("caption", caption.trim());
    }

    return apiClient<StaffJobActiveNoteResponse>(
      API_ENDPOINTS.staffJobs.activePhotos,
      {
        method: "POST",
        formData,
      },
    );
  },
};

export type { StaffActiveJobRaw };
