"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityCheck } from "@/components/common/Svgs";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { AssigneeBadge, JobActionButton } from "@/components/shared/service-requests/JobActionButton";
import { JobProgressBar } from "@/components/shared/service-requests/JobProgressBar";
import { JobStatusBadge } from "@/components/shared/service-requests/JobStatusBadge";
import {
  buildScheduleSlots,
  formatScheduleRange,
  normalizeStartSubtasks,
} from "@/lib/staffJobs";
import { useStaffActiveJob } from "./useStaffActiveJob";
import type { JobCompleteEvent } from "./jobCompleteTypes";

type DraftSubtask = {
  id: string;
  label: string;
};

function createDraftSubtask(): DraftSubtask {
  return {
    id: `subtask-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label: "",
  };
}

function PanelShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-[#D4A8471A] bg-surface p-5">
      {children}
    </section>
  );
}

export function StaffActiveJobDetailPanel({
  onWorkflowChange,
  onJobCompleted,
}: {
  onWorkflowChange?: () => void;
  onJobCompleted?: (event: JobCompleteEvent) => void;
}) {
  const {
    job,
    loading,
    actionLoading,
    scheduleJob,
    startJob,
    toggleSubtask,
    completeJob,
    addNote,
    addPhoto,
  } = useStaffActiveJob();

  const [selectedSlot, setSelectedSlot] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [draftSubtasks, setDraftSubtasks] = useState<DraftSubtask[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraftSubtasks([]);
    setSelectedSlot("");
    setNoteDraft("");
    setPhotoCaption("");
  }, [job?.queueJobId]);

  const startSubtasks = useMemo(
    () => normalizeStartSubtasks(draftSubtasks),
    [draftSubtasks],
  );

  const canSubmitStart = startSubtasks.length > 0 && !actionLoading;

  const scheduleSlots = useMemo(
    () => (job ? buildScheduleSlots(job.slotDurationHours) : []),
    [job],
  );

  const scheduledLabel = formatScheduleRange(
    job?.scheduledStart,
    job?.scheduledEnd,
  );

  if (loading) {
    return (
      <PanelShell>
        <div
          className="-mx-5 mb-4 space-y-2 border-b border-[#D4A8470F] px-5 pb-4"
          aria-busy="true"
          aria-live="polite"
        >
          <ShimmerBlock className="h-3 w-32" />
          <ShimmerBlock className="h-2.5 w-24" />
        </div>

        <div className="flex flex-1 flex-col space-y-5">
          <div className="flex items-center justify-between gap-3">
            <ShimmerBlock className="h-2.5 w-28" />
            <ShimmerBlock className="h-5 w-20 rounded-full" />
          </div>

          <div className="space-y-2">
            <ShimmerBlock className="h-5 w-40" />
            <ShimmerBlock className="h-2.5 w-32" />
            <ShimmerBlock className="h-5 w-24 rounded-full" />
          </div>

          <ShimmerBlock className="h-2 w-full rounded-full" />

          <div className="space-y-3 rounded-xl border border-[#D4A8471A] bg-card p-4">
            <ShimmerBlock className="h-2.5 w-20" />
            <ShimmerBlock className="h-3 w-40" />
          </div>

          <div className="space-y-2.5">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <ShimmerBlock className="size-4 shrink-0 rounded" />
                <ShimmerBlock className="h-3 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </PanelShell>
    );
  }

  if (!job) {
    return (
      <PanelShell>
        <div className="-mx-5 mb-4 space-y-1 border-b border-[#D4A8470F] px-5 pb-4">
          <h3 className="font-copperplate text-sm font-normal tracking-[0.06em] text-primary uppercase">
            Active Job Detail
          </h3>
          <p className="font-roboto text-[9px] tracking-[0.1em] text-secondary uppercase">
            No active assignment
          </p>
        </div>
        <p className="font-roboto py-8 text-center text-sm text-secondary">
          You do not have an active job right now.
        </p>
      </PanelShell>
    );
  }

  async function handleSchedule() {
    const slot = scheduleSlots.find((item) => item.label === selectedSlot);

    if (!slot) {
      return;
    }

    const saved = await scheduleJob(slot.startTime, slot.endTime);

    if (saved) {
      onWorkflowChange?.();
    }
  }

  async function handleAddNote() {
    const saved = await addNote(noteDraft);

    if (saved) {
      setNoteDraft("");
    }
  }

  async function handlePhotoSelected(file?: File | null) {
    if (!file) {
      return;
    }

    await addPhoto(file, photoCaption);
    setPhotoCaption("");

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  }

  async function handleStartJob() {
    if (!canSubmitStart) {
      return;
    }

    const saved = await startJob(startSubtasks);

    if (saved) {
      onWorkflowChange?.();
    }
  }

  function handleAddDraftSubtask() {
    setDraftSubtasks((current) => [...current, createDraftSubtask()]);
  }

  function handleDraftSubtaskChange(id: string, label: string) {
    setDraftSubtasks((current) =>
      current.map((item) => (item.id === id ? { ...item, label } : item)),
    );
  }

  function handleRemoveDraftSubtask(id: string) {
    setDraftSubtasks((current) => current.filter((item) => item.id !== id));
  }

  async function handleCompleteJob() {
    const result = await completeJob();

    if (result) {
      onJobCompleted?.({ ...result, at: Date.now() });
      onWorkflowChange?.();
    }
  }

  return (
    <PanelShell>
      <div className="-mx-5 mb-4 space-y-1 border-b border-[#D4A8470F] px-5 pb-4">
        <h3 className="font-copperplate text-sm font-normal tracking-[0.06em] text-primary uppercase">
          Active Job Detail
        </h3>
        <p className="font-roboto text-[9px] tracking-[0.1em] text-secondary uppercase">
          {job.jobId} · {job.referenceType}
        </p>
      </div>

      <div className="flex flex-1 flex-col space-y-5">
        <div className="flex items-start justify-between gap-3">
          <p className="font-roboto text-[10px] tracking-[0.12em] text-secondary uppercase">
            {job.categoryLabel}
          </p>
          <JobStatusBadge label={job.statusLabel} tone={job.statusTone} />
        </div>

        <div className="space-y-2">
          <h4 className="font-copperplate text-lg leading-tight text-foreground uppercase">
            {job.vehicle}
          </h4>
          <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
            {job.subtitle}
          </p>
          <AssigneeBadge label={job.assignee} />
        </div>

        {scheduledLabel ? (
          <p className="font-roboto rounded-xl border border-primary/20 bg-primary/8 px-4 py-3 text-[10px] tracking-[0.06em] text-primary uppercase">
            Scheduled · {scheduledLabel}
          </p>
        ) : null}

        {job.queueStatus === "in_progress" ? (
          <div className="space-y-2">
            <JobProgressBar
              value={job.progressPercent}
              tone="gold"
              note={
                job.progressNote ??
                (typeof job.remainingMinutes === "number"
                  ? `${job.remainingMinutes} min remaining`
                  : `${job.progressPercent}% elapsed`)
              }
            />
          </div>
        ) : null}

        {job.pickup || job.dropoff ? (
          <div className="space-y-3 rounded-xl border border-[#D4A8471A] bg-card p-4">
            {job.pickup ? (
              <div className="space-y-1">
                <p className="font-roboto text-[9px] tracking-[0.12em] text-primary uppercase">
                  {job.pickup.label}
                </p>
                <p className="font-roboto text-[10px] tracking-[0.03em] text-foreground">
                  {job.pickup.detail}
                </p>
              </div>
            ) : null}

            {job.pickup && job.dropoff ? (
              <div className="flex justify-center py-1">
                <span className="font-roboto text-[10px] text-secondary">↓</span>
              </div>
            ) : null}

            {job.dropoff ? (
              <div className="space-y-1">
                <p className="font-roboto text-[9px] tracking-[0.12em] text-primary uppercase">
                  {job.dropoff.label}
                </p>
                <p className="font-roboto text-[10px] tracking-[0.03em] text-foreground">
                  {job.dropoff.detail}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {job.canSchedule ? (
          <div className="space-y-3 rounded-xl border border-accent/12 bg-card p-4">
            <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
              Schedule Slot · {job.slotDurationHours}h
            </h5>
            <select
              value={selectedSlot}
              onChange={(event) => setSelectedSlot(event.target.value)}
              className="font-roboto w-full rounded-lg border border-accent/15 bg-input-muted px-3 py-2 text-[11px] text-foreground outline-none transition-colors focus:border-accent/35"
            >
              <option value="">Select a slot</option>
              {scheduleSlots.map((slot) => (
                <option key={slot.label} value={slot.label}>
                  {slot.label}
                </option>
              ))}
            </select>
            <JobActionButton
              label="Schedule Job"
              variant="gold"
              disabled={!selectedSlot || actionLoading}
              onClick={() => void handleSchedule()}
            />
          </div>
        ) : null}

        {job.canStart ? (
          <div className="space-y-3 rounded-xl border border-accent/12 bg-card p-4">
            <div className="space-y-1">
              <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
                Start Job
              </h5>
              <p className="font-roboto text-[10px] tracking-[0.03em] text-secondary">
                Estimated duration: {job.estimatedMinutes} min
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
                  Subtasks
                </p>
                <button
                  type="button"
                  onClick={handleAddDraftSubtask}
                  className="font-roboto text-[10px] tracking-[0.08em] text-primary uppercase transition-colors hover:text-primary/80"
                >
                  + Add Subtask
                </button>
              </div>

              {draftSubtasks.length === 0 ? (
                <p className="font-roboto rounded-lg border border-dashed border-accent/20 px-3 py-4 text-center text-[11px] text-secondary">
                  Add at least one subtask before starting the job.
                </p>
              ) : (
                <div className="space-y-2">
                  {draftSubtasks.map((subtask, index) => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <input
                        value={subtask.label}
                        onChange={(event) =>
                          handleDraftSubtaskChange(subtask.id, event.target.value)
                        }
                        placeholder={`Subtask ${index + 1}`}
                        className="font-roboto min-w-0 flex-1 rounded-lg border border-accent/15 bg-input-muted px-3 py-2 text-[11px] text-foreground outline-none transition-colors focus:border-accent/35"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDraftSubtask(subtask.id)}
                        className="font-roboto shrink-0 rounded-lg border border-accent/15 px-3 py-2 text-[10px] tracking-[0.06em] text-secondary uppercase transition-colors hover:border-danger/40 hover:text-danger"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <JobActionButton
              label="Start Job"
              variant="gold"
              disabled={!canSubmitStart}
              onClick={() => void handleStartJob()}
            />
          </div>
        ) : null}

        {job.queueStatus === "in_progress" && job.steps.length > 0 ? (
          <div className="space-y-3">
            <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
              Job Steps
            </h5>
            <div className="space-y-2.5">
              {job.steps.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  disabled={!job.canToggleSubtasks || step.completed || actionLoading}
                  onClick={() => void toggleSubtask(step.key, step.completed)}
                  className="flex w-full items-start gap-3 text-left disabled:cursor-default"
                >
                  <span
                    className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border ${
                      step.completed
                        ? "border-teal/40 bg-teal/10"
                        : "border-secondary/30 bg-transparent"
                    }`}
                  >
                    {step.completed && (
                      <ActivityCheck color="var(--teal)" className="size-2.5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-roboto text-[11px] tracking-[0.03em] ${
                        step.completed
                          ? "text-secondary line-through"
                          : "text-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                  {step.time ? (
                    <span className="font-roboto shrink-0 text-[9px] tracking-[0.06em] text-teal uppercase">
                      {step.time}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {job.timeline.length > 0 ? (
          <div className="space-y-2">
            <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
              Timeline
            </h5>
            <div className="space-y-2">
              {job.timeline.map((item) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between gap-3 rounded-xl border border-accent/12 bg-card px-3 py-2"
                >
                  <p className="font-roboto text-[11px] text-foreground">{item.label}</p>
                  <span className="font-roboto shrink-0 text-[9px] tracking-[0.06em] text-secondary uppercase">
                    {item.completedAt || item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {job.specialInstructions ? (
          <div className="space-y-2">
            <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
              Special Instructions
            </h5>
            <div className="rounded-xl border border-[#D4A8471A] bg-card p-4">
              <p className="font-roboto text-[11px] leading-relaxed tracking-[0.02em] text-secondary italic">
                &ldquo;{job.specialInstructions}&rdquo;
              </p>
            </div>
          </div>
        ) : null}

        {job.notes.length > 0 ? (
          <div className="space-y-2">
            <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
              Job Notes
            </h5>
            <div className="space-y-2">
              {job.notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-xl border border-accent/12 bg-card p-3"
                >
                  <p className="font-roboto text-[11px] text-foreground">
                    {note.text}
                  </p>
                  {note.createdAt ? (
                    <p className="font-roboto mt-1 text-[9px] text-secondary uppercase">
                      {note.createdAt}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {job.photos.length > 0 ? (
          <div className="space-y-2">
            <h5 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
              Job Photos
            </h5>
            <div className="grid grid-cols-2 gap-2">
              {job.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="overflow-hidden rounded-xl border border-accent/12 bg-card"
                >
                  {photo.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.url}
                      alt={photo.caption || "Job photo"}
                      className="h-24 w-full object-cover"
                    />
                  ) : null}
                  {photo.caption ? (
                    <p className="font-roboto px-3 py-2 text-[10px] text-secondary">
                      {photo.caption}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {job.canAddNote ? (
          <div className="space-y-2">
            <textarea
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              rows={3}
              placeholder="Add a job note..."
              className="font-roboto w-full resize-none rounded-xl border border-accent/15 bg-input-muted px-4 py-3 text-[12px] text-foreground outline-none transition-colors focus:border-accent/35"
            />
          </div>
        ) : null}

        {job.canAddPhoto ? (
          <div className="space-y-2">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                void handlePhotoSelected(event.target.files?.[0])
              }
            />
            <input
              value={photoCaption}
              onChange={(event) => setPhotoCaption(event.target.value)}
              placeholder="Photo caption (optional)"
              className="font-roboto w-full rounded-xl border border-accent/15 bg-input-muted px-4 py-2 text-[11px] text-foreground outline-none transition-colors focus:border-accent/35"
            />
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {job.canAddPhoto ? (
            <JobActionButton
              label="Add Photo"
              disabled={actionLoading}
              onClick={() => photoInputRef.current?.click()}
            />
          ) : null}
          {job.canAddNote ? (
            <JobActionButton
              label="Add Note"
              disabled={actionLoading || !noteDraft.trim()}
              onClick={() => void handleAddNote()}
            />
          ) : null}
          {job.canComplete ? (
            <JobActionButton
              label="Mark Complete"
              variant="gold"
              disabled={actionLoading}
              onClick={() => void handleCompleteJob()}
            />
          ) : null}
        </div>
      </div>
    </PanelShell>
  );
}
