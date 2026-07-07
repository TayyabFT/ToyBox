"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { staffInspectionsApi } from "@/api/staffInspections.api";
import {
  buildInspectionDraftPayload,
  buildFallbackInspectionFromQueue,
  cycleChecklistItemState,
  extractCreatedInspectionId,
  extractInspectionDashboardSummary,
  extractInspectionPhotos,
  extractInspectionQueue,
  findCreatedInspectionInQueue,
  formatInspectionApiErrorMessage,
  getAdjacentStepId,
  hasMeaningfulInspectionDetailData,
  hasMeaningfulInspectionSummary,
  mapActiveInspection,
  mapInspectionQueue,
  mapInspectionStats,
  mergeInspectionAfterDraft,
  mergeInspectionPhotos,
  resolveFlaggedItemKey,
  resolveInspectionApiId,
  isInspectionEditable,
  isInspectionSubmittable,
  setActiveStep,
} from "@/lib/staffInspections";
import type { InspectionSummaryKey } from "./types";
import type {
  StaffInspectionCreateRequest,
} from "@/types/api";
import { isApiError } from "@/lib/apiError";
import {
  hasAddInspectionErrors,
  mapApiValidationErrors,
  type CreateInspectionResult,
} from "@/lib/addInspectionValidation";
import { showError, showToast } from "@/lib/toast";
import type {
  ActiveInspection,
  InspectionQueueItem,
  InspectionStats,
  InspectionStepId,
} from "./types";

const EMPTY_STATS: InspectionStats = {
  dueToday: { value: "0", subtext: "Inspections Pending", summaryKey: "dueToday" },
  inProgress: { value: "0", subtext: "Active Now", summaryKey: "inProgress" },
  completed: { value: "0", subtext: "This Shift", summaryKey: "completedThisShift" },
  flagged: { value: "0", subtext: "Needs Review", summaryKey: "flaggedIssues" },
};

export function useStaffInspections() {
  const [stats, setStats] = useState<InspectionStats>(EMPTY_STATS);
  const [queue, setQueue] = useState<InspectionQueueItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [inspection, setInspection] = useState<ActiveInspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeSummaryKey, setActiveSummaryKey] =
    useState<InspectionSummaryKey | null>(null);

  // Read the queue through a ref inside loadDetail so its identity stays
  // stable; otherwise the detail effect re-runs when the queue arrives and
  // fetches the detail twice on first load.
  const queueRef = useRef<InspectionQueueItem[]>(queue);
  queueRef.current = queue;

  const pendingCount = useMemo(
    () =>
      queue.filter(
        (item) => item.status === "pending" || item.status === "overdue",
      ).length,
    [queue],
  );

  const canEditInspection = useMemo(() => {
    const inspectionId = resolveInspectionApiId(inspection?.id, selectedId);
    const queueItem =
      queue.find((item) => item.id === inspectionId) ??
      queue.find((item) => item.id === selectedId) ??
      null;

    return isInspectionEditable(queueItem, inspection?.statusKey);
  }, [queue, selectedId, inspection?.id, inspection?.statusKey]);

  const loadSummary = useCallback(async () => {
    try {
      const response = await staffInspectionsApi.getSummary();

      if (hasMeaningfulInspectionSummary(response.data)) {
        setStats(
          mapInspectionStats(extractInspectionDashboardSummary(response.data)),
        );
      }
    } catch {
      // Summary is a KPI-only refresh; the list endpoint already provides
      // dashboardSummary, so a failure here should not disrupt the page.
    }
  }, []);

  const loadList = useCallback(
    async (summaryKey?: InspectionSummaryKey | null) => {
    setLoading(true);

    try {
      const response = await staffInspectionsApi.getList({
        summaryKey: summaryKey ?? undefined,
        limit: 50,
        offset: 0,
      });

      const listSummary = extractInspectionDashboardSummary(response.data);

      if (hasMeaningfulInspectionSummary(response.data)) {
        setStats(mapInspectionStats(listSummary));
      } else {
        void loadSummary();
      }
      const items = mapInspectionQueue(extractInspectionQueue(response.data));
      setQueue(items);

      setSelectedId((current) => {
        if (current && items.some((item) => item.id === current)) {
          return current;
        }

        return items[0]?.id ?? "";
      });
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to load inspections";

      showError(message);
      setStats(EMPTY_STATS);
      setQueue([]);
      setSelectedId("");
    } finally {
      setLoading(false);
    }
    },
    [loadSummary],
  );

  const loadDetail = useCallback(
    async (id: string) => {
      if (!id) {
        setInspection(null);
        return;
      }

      setDetailLoading(true);
      setInspection(null);

      try {
        const response = await staffInspectionsApi.getDetail(id);
        const queueItem =
          queueRef.current.find((item) => item.id === id) ?? null;

        setInspection((previous) => {
          const mapped =
            mapActiveInspection(response.data, {
              fallbackId: id,
              queueItem,
            }) ?? buildFallbackInspectionFromQueue(queueItem, id);

          if (!mapped) {
            return previous;
          }

          return {
            ...mapped,
            photos:
              mapped.photos.length > 0
                ? mapped.photos
                : previous?.photos ?? [],
          };
        });
      } catch (error) {
        const message =
          (error as { message?: string }).message ??
          "Failed to load inspection detail";

        showError(message);

        const queueItem =
          queueRef.current.find((item) => item.id === id) ?? null;
        setInspection(buildFallbackInspectionFromQueue(queueItem, id));
      } finally {
        setDetailLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadList(activeSummaryKey);
  }, [activeSummaryKey, loadList]);

  useEffect(() => {
    void loadDetail(selectedId);
  }, [loadDetail, selectedId]);

  const saveDraft = useCallback(async () => {
    if (!inspection?.id) return false;

    const inspectionId = resolveInspectionApiId(inspection.id, selectedId);
    const queueItem =
      queue.find((item) => item.id === inspectionId) ??
      queue.find((item) => item.id === selectedId) ??
      null;

    if (!isInspectionEditable(queueItem, inspection.statusKey)) {
      showError("Completed inspections cannot be edited.");
      return false;
    }

    const payload = buildInspectionDraftPayload(inspection);

    setActionLoading(true);

    try {
      const response = await staffInspectionsApi.saveDraft(inspectionId, payload);

      setInspection((current) =>
        current
          ? mergeInspectionAfterDraft(current, response.data, {
              fallbackId: inspectionId,
              queueItem,
            })
          : current,
      );

      if (!hasMeaningfulInspectionDetailData(response.data)) {
        await loadDetail(inspectionId);
      }

      showToast.success({
        title: "Draft Saved",
        message: response.message || "Inspection draft updated",
      });

      return true;
    } catch (error) {
      const message = formatInspectionApiErrorMessage(
        error,
        "Failed to save draft",
      );

      showError(message);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [inspection, loadDetail, queue, selectedId]);

  const submitReport = useCallback(async () => {
    if (!inspection?.id) return false;

    const inspectionId = resolveInspectionApiId(inspection.id, selectedId);
    const queueItem =
      queue.find((item) => item.id === inspectionId) ??
      queue.find((item) => item.id === selectedId) ??
      null;

    if (!isInspectionSubmittable(queueItem, inspection.statusKey)) {
      showError("This inspection has already been submitted.");
      return false;
    }

    const draftPayload = buildInspectionDraftPayload(inspection);

    setActionLoading(true);

    try {
      const draftResponse = await staffInspectionsApi.saveDraft(
        inspectionId,
        draftPayload,
      );

      setInspection((current) =>
        current
          ? mergeInspectionAfterDraft(current, draftResponse.data, {
              fallbackId: inspectionId,
              queueItem,
            })
          : current,
      );

      const response = await staffInspectionsApi.submit(inspectionId);

      showToast.success({
        title: "Report Submitted",
        message: response.message || "Inspection report submitted successfully",
      });

      await loadList(activeSummaryKey);

      setInspection((current) =>
        current
          ? mergeInspectionAfterDraft(current, response.data, {
              fallbackId: inspectionId,
              queueItem,
            })
          : current,
      );

      if (!hasMeaningfulInspectionDetailData(response.data)) {
        await loadDetail(inspectionId);
      }

      return true;
    } catch (error) {
      const message = formatInspectionApiErrorMessage(
        error,
        "Failed to submit report",
      );
      showError(message);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [activeSummaryKey, inspection, loadDetail, loadList, queue, selectedId]);

  const uploadPhoto = useCallback(
    async (file: File, itemKey?: string) => {
      if (!inspection?.id) return false;

      const inspectionId = resolveInspectionApiId(inspection.id, selectedId);
      const resolvedItemKey = itemKey ?? resolveFlaggedItemKey(inspection);

      setActionLoading(true);

      try {
        const response = await staffInspectionsApi.uploadPhoto(inspectionId, {
          photo: file,
          itemKey: resolvedItemKey,
        });

        const queueItem = queue.find((item) => item.id === inspectionId) ?? null;
        const responsePhotos = extractInspectionPhotos(response.data);

        setInspection((current) => {
          if (!current) {
            return current;
          }

          const merged = mergeInspectionAfterDraft(current, response.data, {
            fallbackId: inspectionId,
            queueItem,
          });
          const existingPhotos = current.photos.filter(
            (photo) => !photo.id.startsWith("local-"),
          );

          return {
            ...merged,
            photos: mergeInspectionPhotos(
              responsePhotos.length > 0 ? responsePhotos : merged.photos,
              responsePhotos.length > 0 ? existingPhotos : [],
            ),
          };
        });

        if (!hasMeaningfulInspectionDetailData(response.data)) {
          const detailResponse = await staffInspectionsApi.getDetail(inspectionId);
          const detailQueueItem =
            queue.find((item) => item.id === inspectionId) ?? null;
          const mapped = mapActiveInspection(detailResponse.data, {
            fallbackId: inspectionId,
            queueItem: detailQueueItem,
          });

          if (mapped) {
            setInspection((current) =>
              current
                ? {
                    ...mapped,
                    photos: mergeInspectionPhotos(
                      mapped.photos,
                      current.photos.filter(
                        (photo) => !photo.id.startsWith("local-"),
                      ),
                    ),
                  }
                : mapped,
            );
          }
        }

        showToast.success({
          title: "Photo Uploaded",
          message: response.message || "Photo evidence added",
        });
        return true;
      } catch (error) {
        const message = formatInspectionApiErrorMessage(
          error,
          "Failed to upload photo",
        );

        showError(message);
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [inspection, loadDetail, queue, selectedId],
  );

  const updateInspection = useCallback(
    (updater: (current: ActiveInspection) => ActiveInspection) => {
      setInspection((current) => (current ? updater(current) : current));
    },
    [],
  );

  const toggleChecklistItem = useCallback((itemId: string) => {
    updateInspection((current) => ({
      ...current,
      checklist: current.checklist.map((item) =>
        item.id === itemId
          ? { ...item, state: cycleChecklistItemState(item.state) }
          : item,
      ),
    }));
  }, [updateInspection]);

  const changeStep = useCallback(
    (direction: "back" | "next") => {
      updateInspection((current) => {
        const nextStepId = getAdjacentStepId(current.activeStepId, direction);

        if (!nextStepId) {
          return current;
        }

        return setActiveStep(current, nextStepId);
      });
    },
    [updateInspection],
  );

  const setStep = useCallback(
    (stepId: InspectionStepId) => {
      updateInspection((current) => setActiveStep(current, stepId));
    },
    [updateInspection],
  );

  const updateOdometer = useCallback(
    (value: string) => {
      updateInspection((current) => ({
        ...current,
        odometer: value,
        mileage: value ? `${value} km` : "—",
      }));
    },
    [updateInspection],
  );

  const updateFuelLevel = useCallback(
    (value: string) => {
      updateInspection((current) => ({
        ...current,
        fuelLevel: value,
      }));
    },
    [updateInspection],
  );

  const updateNotes = useCallback(
    (value: string) => {
      updateInspection((current) => ({
        ...current,
        notes: value,
        flaggedIssue: current.flaggedIssue
          ? { ...current.flaggedIssue, notes: value }
          : current.flaggedIssue,
      }));
    },
    [updateInspection],
  );

  const createInspection = useCallback(
    async (body: StaffInspectionCreateRequest): Promise<CreateInspectionResult> => {
      setActionLoading(true);

      try {
        const response = await staffInspectionsApi.create(body);
        const createdId = extractCreatedInspectionId(response.data);

        showToast.success({
          title: "Inspection Added",
          message: response.message || "Inspection scheduled successfully",
        });

        setActiveSummaryKey(null);

        const listResponse = await staffInspectionsApi.getList({
          limit: 50,
          offset: 0,
        });

        if (hasMeaningfulInspectionSummary(listResponse.data)) {
          setStats(
            mapInspectionStats(
              extractInspectionDashboardSummary(listResponse.data),
            ),
          );
        } else {
          void loadSummary();
        }
        const items = mapInspectionQueue(extractInspectionQueue(listResponse.data));
        setQueue(items);

        const selectedInspectionId = findCreatedInspectionInQueue(
          items,
          body,
          createdId,
        );

        if (selectedInspectionId) {
          setSelectedId(selectedInspectionId);
        }

        setLoading(false);

        return { ok: true, createdId: selectedInspectionId || createdId || undefined };
      } catch (error) {
        const fieldErrors = isApiError(error)
          ? mapApiValidationErrors(error.errors)
          : undefined;
        const message =
          (error as { message?: string }).message ??
          "Failed to add inspection";

        if (!fieldErrors || !hasAddInspectionErrors(fieldErrors)) {
          showError(message);
        }

        return { ok: false, message, fieldErrors };
      } finally {
        setActionLoading(false);
      }
    },
    [loadSummary],
  );

  const filterBySummaryKey = useCallback(
    (summaryKey: InspectionSummaryKey) => {
      setActiveSummaryKey((current) => {
        const next = current === summaryKey ? null : summaryKey;
        void loadList(next);
        return next;
      });
    },
    [loadList],
  );

  return {
    stats,
    queue,
    selectedId,
    setSelectedId,
    inspection,
    loading,
    detailLoading,
    actionLoading,
    pendingCount,
    activeSummaryKey,
    canEditInspection,
    saveDraft,
    submitReport,
    uploadPhoto,
    toggleChecklistItem,
    changeStep,
    setStep,
    updateOdometer,
    updateFuelLevel,
    updateNotes,
    createInspection,
    filterBySummaryKey,
  };
}
