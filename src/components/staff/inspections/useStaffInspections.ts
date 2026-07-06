"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { staffInspectionsApi } from "@/api/staffInspections.api";
import {
  buildInspectionDraftPayload,
  cycleChecklistItemState,
  getAdjacentStepId,
  mapActiveInspection,
  mapInspectionQueue,
  mapInspectionStats,
  setActiveStep,
} from "@/lib/staffInspections";
import type {
  StaffInspectionCreateRequest,
  StaffInspectionDetailRaw,
} from "@/types/api";
import {
  hasAddInspectionErrors,
  mapApiValidationErrors,
  type CreateInspectionResult,
} from "@/lib/addInspectionValidation";
import { isApiError } from "@/lib/apiError";
import { showError, showToast } from "@/lib/toast";
import type {
  ActiveInspection,
  InspectionQueueItem,
  InspectionStats,
  InspectionStepId,
} from "./types";

const EMPTY_STATS: InspectionStats = {
  dueToday: { value: "0", subtext: "Inspections Pending" },
  inProgress: { value: "0", subtext: "Active Now" },
  completed: { value: "0", subtext: "This Shift" },
  flagged: { value: "0", subtext: "Needs Review" },
};

export function useStaffInspections() {
  const [stats, setStats] = useState<InspectionStats>(EMPTY_STATS);
  const [queue, setQueue] = useState<InspectionQueueItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [inspection, setInspection] = useState<ActiveInspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const pendingCount = useMemo(
    () =>
      queue.filter(
        (item) => item.status === "pending" || item.status === "overdue",
      ).length,
    [queue],
  );

  const loadList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await staffInspectionsApi.getList();

      setStats(mapInspectionStats(response.data?.dashboardSummary));
      const items = mapInspectionQueue(response.data?.inspections);
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
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    if (!id) {
      setInspection(null);
      return;
    }

    setDetailLoading(true);

    try {
      const response = await staffInspectionsApi.getDetail(id);
      setInspection(mapActiveInspection(response.data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load inspection detail";

      showError(message);
      setInspection(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    void loadDetail(selectedId);
  }, [loadDetail, selectedId]);

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

  const applyDetailResponse = useCallback((data: StaffInspectionDetailRaw | null | undefined) => {
    const mapped = mapActiveInspection(data);

    if (mapped) {
      setInspection(mapped);
    }
  }, []);

  const saveDraft = useCallback(async () => {
    if (!inspection?.id) return false;

    const response = await runAction(() =>
      staffInspectionsApi.saveDraft(
        inspection.id!,
        buildInspectionDraftPayload(inspection),
      ),
    );

    if (!response) return false;

    applyDetailResponse(response.data);
    showToast.success({
      title: "Draft Saved",
      message: "Inspection draft updated",
    });
    return true;
  }, [applyDetailResponse, inspection]);

  const submitReport = useCallback(async () => {
    if (!inspection?.id) return false;

    setActionLoading(true);

    try {
      await staffInspectionsApi.saveDraft(
        inspection.id,
        buildInspectionDraftPayload(inspection),
      );

      const response = await staffInspectionsApi.submit(inspection.id);

      showToast.success({
        title: "Report Submitted",
        message: "Inspection report submitted successfully",
      });

      await loadList();

      if (response.data) {
        applyDetailResponse(response.data);
      } else {
        await loadDetail(inspection.id);
      }

      return true;
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to submit report";
      showError(message);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [applyDetailResponse, inspection, loadDetail, loadList]);

  const uploadPhoto = useCallback(
    async (file: File) => {
      if (!inspection?.id) return false;

      const response = await runAction(() =>
        staffInspectionsApi.uploadPhoto(inspection.id!, file, inspection.notes),
      );

      if (!response) return false;

      applyDetailResponse(response.data);
      showToast.success({
        title: "Photo Uploaded",
        message: "Photo evidence added",
      });
      return true;
    },
    [applyDetailResponse, inspection],
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
        const createdId =
          response.data?.id !== undefined && response.data?.id !== null
            ? String(response.data.id)
            : "";

        showToast.success({
          title: "Inspection Added",
          message: response.message || "Inspection scheduled successfully",
        });

        await loadList();

        if (createdId) {
          setSelectedId(createdId);
        }

        return { ok: true };
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
    reload: loadList,
  };
}
