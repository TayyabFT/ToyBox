"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { staffJobsApi } from "@/api/staffJobs.api";
import {
  mapStaffActiveJob,
  mapStaffJobNotes,
  mapStaffJobPhotos,
  unwrapActiveJobPayload,
  unwrapCompletePayload,
  type StaffActiveJobView,
} from "@/lib/staffJobs";
import { showError, showToast } from "@/lib/toast";

const PROGRESS_POLL_MS = 30_000;

export function useStaffActiveJob() {
  const [job, setJob] = useState<StaffActiveJobView | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const applyActivePayload = useCallback((data: unknown) => {
    const mapped = mapStaffActiveJob(unwrapActiveJobPayload(data));

    if (mapped) {
      setJob(mapped);
      return mapped;
    }

    setJob(null);
    return null;
  }, []);

  const loadNotes = useCallback(async (referenceId: string) => {
    try {
      const response = await staffJobsApi.getNotes(referenceId);
      const notes = mapStaffJobNotes(response.data);
      const photos = mapStaffJobPhotos(response.data);

      setJob((current) => (current ? { ...current, notes, photos } : current));
    } catch {
      // Notes are optional until the request has activity.
    }
  }, []);

  const loadActiveJob = useCallback(async () => {
    setLoading(true);

    try {
      const response = await staffJobsApi.getActive();
      const mapped = applyActivePayload(response.data);

      if (mapped?.referenceId) {
        await loadNotes(mapped.referenceId);
      }
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to load active job";

      showError(message);
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [applyActivePayload, loadNotes]);

  const refreshProgress = useCallback(async () => {
    if (!job?.queueJobId || job.queueStatus !== "in_progress") {
      return;
    }

    try {
      const response = await staffJobsApi.getProgress(job.queueJobId);
      const progress = response.data?.progress;
      const percent = Number(progress?.percent ?? 0);

      setJob((current) =>
        current
          ? {
              ...current,
              progressPercent: Math.min(100, Math.max(0, percent || 0)),
              progressNote:
                progress?.note?.trim() ||
                progress?.label?.trim() ||
                (typeof progress?.remainingMinutes === "number"
                  ? `${progress.remainingMinutes} min remaining`
                  : current.progressNote),
              elapsedMinutes: progress?.elapsedMinutes,
              remainingMinutes: progress?.remainingMinutes,
            }
          : current,
      );
    } catch {
      // Progress polling should be silent.
    }
  }, [job?.queueJobId, job?.queueStatus]);

  useEffect(() => {
    loadActiveJob();
  }, [loadActiveJob]);

  useEffect(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    if (job?.queueStatus !== "in_progress") {
      return;
    }

    void refreshProgress();

    pollRef.current = setInterval(() => {
      void refreshProgress();
    }, PROGRESS_POLL_MS);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, [job?.queueJobId, job?.queueStatus, refreshProgress]);

  async function runAction<T>(action: () => Promise<T>): Promise<T | null> {
    setActionLoading(true);

    try {
      return await action();
    } catch (error) {
      const message = (error as { message?: string }).message ?? "Action failed";
      showError(message);
      return null;
    } finally {
      setActionLoading(false);
    }
  }

  const scheduleJob = useCallback(
    async (startTime: string, endTime: string) => {
      if (!job?.queueJobId) return false;

      const response = await runAction(() =>
        staffJobsApi.schedule(job.queueJobId, { startTime, endTime }),
      );

      if (!response) return false;

      applyActivePayload(response.data);
      showToast.success({
        title: "Job Scheduled",
        message: "The active job has been scheduled",
      });
      return true;
    },
    [applyActivePayload, job?.queueJobId],
  );

  const startJob = useCallback(
    async (subtasks: Array<{ key: string; label: string }>) => {
      if (!job?.queueJobId || subtasks.length === 0) return false;

      const response = await runAction(() =>
        staffJobsApi.start(job.queueJobId, {
          estimatedMinutes: job.estimatedMinutes,
          subtasks,
        }),
      );

      if (!response) return false;

      const mapped = applyActivePayload(response.data);

      if (mapped?.referenceId) {
        await loadNotes(mapped.referenceId);
      }

      await refreshProgress();

      showToast.success({
        title: "Job Started",
        message: "You can now complete subtasks and add notes",
      });
      return true;
    },
    [applyActivePayload, job, loadNotes, refreshProgress],
  );

  const toggleSubtask = useCallback(
    async (key: string, completed: boolean) => {
      if (!job?.queueJobId || !job.canToggleSubtasks || completed) {
        return false;
      }

      const response = await runAction(() =>
        staffJobsApi.completeSubtask(job.queueJobId, key),
      );

      if (!response) return false;

      applyActivePayload(response.data);
      await refreshProgress();
      return true;
    },
    [applyActivePayload, job, refreshProgress],
  );

  const completeJob = useCallback(async () => {
    if (!job?.queueJobId) return false;

    const response = await runAction(() =>
      staffJobsApi.complete(job.queueJobId),
    );

    if (!response) return false;

    const nextJob = unwrapCompletePayload(response.data);

    if (nextJob) {
      const mapped = applyActivePayload({ job: nextJob });

      if (mapped?.referenceId) {
        await loadNotes(mapped.referenceId);
      }
    } else {
      setJob(null);
    }

    showToast.success({
      title: "Job Completed",
      message: nextJob
        ? "Job completed — next assignment loaded"
        : "Active job marked complete",
    });
    return true;
  }, [applyActivePayload, job?.queueJobId, loadNotes]);

  const addNote = useCallback(
    async (note: string) => {
      const trimmed = note.trim();

      if (!trimmed || !job?.canAddNote) {
        return false;
      }

      const response = await runAction(() =>
        staffJobsApi.addNote({ note: trimmed }),
      );

      if (!response) return false;

      if (job.referenceId) {
        await loadNotes(job.referenceId);
      }

      showToast.success({
        title: "Note Added",
        message: "Job note saved",
      });
      return true;
    },
    [job, loadNotes],
  );

  const addPhoto = useCallback(
    async (image: File, caption?: string) => {
      if (!job?.canAddPhoto) {
        return false;
      }

      const response = await runAction(() =>
        staffJobsApi.addPhoto(image, caption),
      );

      if (!response) return false;

      if (job.referenceId) {
        await loadNotes(job.referenceId);
      }

      showToast.success({
        title: "Photo Uploaded",
        message: "Job photo added",
      });
      return true;
    },
    [job, loadNotes],
  );

  return {
    job,
    loading,
    actionLoading,
    reload: loadActiveJob,
    scheduleJob,
    startJob,
    toggleSubtask,
    completeJob,
    addNote,
    addPhoto,
  };
}
