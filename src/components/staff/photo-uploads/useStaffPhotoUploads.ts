"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { staffPhotoUploadsApi } from "@/api/staffPhotoUploads.api";
import {
  applySummaryToState,
  buildCaptureUploadMeta,
  captureModeToMeta,
  extractListUploads,
  extractPhotoUploadId,
  extractTodayListData,
  mapPhotoUploadFilterToQuery,
  mapRecentUploads,
  mapSelectedPhoto,
  mapTodayCaptures,
  mapTodaySummary,
  serviceTabToDraftMeta,
} from "@/lib/staffPhotoUploads";
import { showError, showToast } from "@/lib/toast";
import type {
  CameraContext,
  PendingSummary,
  PhotoUploadFilter,
  PhotoUploadHeader,
  PhotoUploadTab,
  RecentUpload,
  SelectedPhoto,
  SelectedPhotoDraft,
  ServiceTypeTab,
  CaptureMode,
  TodayCapture,
  LocalPendingCapture,
} from "./types";

const LOCAL_CAPTURE_PREFIX = "local-";

const EMPTY_HEADER: PhotoUploadHeader = {
  dateLabel: "—",
  shiftLabel: "Staff Shift",
};

const EMPTY_PENDING: PendingSummary = {
  totalPhotos: 0,
  pendingCount: 0,
  totalSizeMb: "—",
};

const EMPTY_CAMERA: CameraContext = {
  caption: "No active job linked",
};

export function useStaffPhotoUploads() {
  const [activeFilter, setActiveFilter] = useState<PhotoUploadFilter>("all");
  const [activeServiceTab, setActiveServiceTab] =
    useState<ServiceTypeTab>("pre-service");
  const [activeCaptureMode, setActiveCaptureMode] =
    useState<CaptureMode>("photo");
  const [header, setHeader] = useState<PhotoUploadHeader>(EMPTY_HEADER);
  const [tabs, setTabs] = useState<PhotoUploadTab[] | null>(null);
  const [cameraContext, setCameraContext] = useState<CameraContext>(EMPTY_CAMERA);
  const [todayCaptures, setTodayCaptures] = useState<TodayCapture[]>([]);
  const [todaySummary, setTodaySummary] = useState<PendingSummary>(EMPTY_PENDING);
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<SelectedPhoto | null>(null);
  const [selectedCaptureId, setSelectedCaptureId] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<SelectedPhotoDraft | null>(null);
  const [localPendingCaptures, setLocalPendingCaptures] = useState<
    LocalPendingCapture[]
  >([]);
  const [activeLocalCaptureId, setActiveLocalCaptureId] = useState<string | null>(
    null,
  );
  const [viewfinderZoom, setViewfinderZoom] = useState(1);

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const captureInputRef = useRef<HTMLInputElement>(null);
  const localPreviewUrlsRef = useRef<Set<string>>(new Set());

  const captureModeMeta = captureModeToMeta(activeCaptureMode);

  const revokeLocalPreview = useCallback((previewUrl: string) => {
    URL.revokeObjectURL(previewUrl);
    localPreviewUrlsRef.current.delete(previewUrl);
  }, []);

  const registerLocalPreview = useCallback((previewUrl: string) => {
    localPreviewUrlsRef.current.add(previewUrl);
  }, []);

  useEffect(() => {
    const urls = localPreviewUrlsRef.current;

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const displayTodayCaptures = useCallback((): TodayCapture[] => {
    const localTiles: TodayCapture[] = localPendingCaptures.map((capture) => ({
      id: capture.id,
      label: capture.label,
      time: "Pending upload",
      status: "pending",
      thumbnailUrl: capture.previewUrl,
    }));

    return [...todayCaptures, ...localTiles];
  }, [localPendingCaptures, todayCaptures]);

  const displayTodaySummary = useCallback((): PendingSummary => {
    const localCount = localPendingCaptures.length;
    const localSizeMb = localPendingCaptures.reduce(
      (total, capture) => total + capture.file.size,
      0,
    );

    const serverPending = todaySummary.pendingCount;
    const serverTotal = todaySummary.totalPhotos;
    const serverSizeText = todaySummary.totalSizeMb;

    let totalSizeMb = serverSizeText;

    if (localCount > 0) {
      const localMb = localSizeMb / (1024 * 1024);
      const serverMb =
        typeof serverSizeText === "string" &&
        serverSizeText.endsWith("MB") &&
        serverSizeText !== "—"
          ? Number.parseFloat(serverSizeText)
          : 0;

      totalSizeMb =
        Number.isFinite(serverMb) && serverMb > 0
          ? `${(serverMb + localMb).toFixed(1)} MB`
          : `${localMb.toFixed(1)} MB`;
    }

    return {
      totalPhotos: serverTotal + localCount,
      pendingCount: serverPending + localCount,
      totalSizeMb,
    };
  }, [localPendingCaptures, todaySummary]);

  const viewfinderPreviewUrl = (() => {
    const id = activeLocalCaptureId ?? selectedCaptureId;

    if (!id) {
      return null;
    }

    const local = localPendingCaptures.find((capture) => capture.id === id);

    if (local) {
      return local.previewUrl;
    }

    const server = todayCaptures.find((capture) => capture.id === id);

    return server?.thumbnailUrl ?? null;
  })();

  const applyDraftFromPhoto = useCallback((photo: SelectedPhoto) => {
    setDraft({
      sectionLabel: photo.title,
      categoryTags: photo.categoryTags.map((tag) =>
        tag.toLowerCase().replace(/\s+/g, "_"),
      ),
      caption: photo.caption,
      linkedJobReference: photo.reference === "—" ? "" : photo.reference,
      isIssueFlagged: Boolean(photo.isIssueFlagged),
    });
  }, []);

  const loadSummary = useCallback(async () => {
    setLoading(true);

    try {
      const response = await staffPhotoUploadsApi.getSummary();
      const mapped = applySummaryToState(response.data);

      setHeader(mapped.header);
      setTabs(mapped.tabs);
      setCameraContext(mapped.cameraContext);
      setTodayCaptures(mapped.todayCaptures);
      setTodaySummary(mapped.todaySummary);
      setRecentUploads(mapped.recentUploads);

      if (mapped.selectedPhoto) {
        setSelectedPhoto(mapped.selectedPhoto);
        setSelectedCaptureId(mapped.selectedPhoto.id);
        applyDraftFromPhoto(mapped.selectedPhoto);
      } else {
        setSelectedPhoto(null);
        setSelectedCaptureId("");
        setDraft(null);
      }

      try {
        const listResponse = await staffPhotoUploadsApi.getList({});
        const listRecent = mapRecentUploads(extractListUploads(listResponse.data));

        if (listRecent.length > 0) {
          setRecentUploads(listRecent);
        }
      } catch {
        // Keep summary recent uploads when list enrichment fails.
      }
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load photo uploads";

      showError(message);
      setHeader(EMPTY_HEADER);
      setTabs(null);
      setCameraContext(EMPTY_CAMERA);
      setTodayCaptures([]);
      setTodaySummary(EMPTY_PENDING);
      setRecentUploads([]);
      setSelectedPhoto(null);
      setSelectedCaptureId("");
      setDraft(null);
    } finally {
      setLoading(false);
    }
  }, [applyDraftFromPhoto]);

  const loadRecentUploads = useCallback(
    async (filter: PhotoUploadFilter, options?: { keepExistingOnEmpty?: boolean }) => {
      try {
        const response = await staffPhotoUploadsApi.getList({
          filter: mapPhotoUploadFilterToQuery(filter),
        });

        const items = extractListUploads(response.data);
        const mapped = mapRecentUploads(items);

        setRecentUploads((current) => {
          if (
            options?.keepExistingOnEmpty &&
            mapped.length === 0 &&
            current.length > 0
          ) {
            return current;
          }

          return mapped;
        });
      } catch (error) {
        const message =
          (error as { message?: string }).message ??
          "Failed to load recent uploads";

        showError(message);
      }
    },
    [],
  );

  const loadToday = useCallback(async () => {
    try {
      const response = await staffPhotoUploadsApi.getToday();
      const { captures, summary } = extractTodayListData(response.data);
      const mappedCaptures = mapTodayCaptures(captures);

      setTodayCaptures(mappedCaptures);
      setTodaySummary(mapTodaySummary(summary, mappedCaptures));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load today's captures";

      showError(message);
    }
  }, []);

  const loadDetail = useCallback(
    async (id: string) => {
      if (!id) {
        setSelectedPhoto(null);
        setDraft(null);
        return;
      }

      setDetailLoading(true);

      try {
        const response = await staffPhotoUploadsApi.getDetail(id);
        const mapped = mapSelectedPhoto(response.data);

        if (mapped) {
          setSelectedPhoto(mapped);
          setSelectedCaptureId(mapped.id);
          applyDraftFromPhoto(mapped);
        } else {
          setSelectedPhoto(null);
          setDraft(null);
        }
      } catch (error) {
        const message =
          (error as { message?: string }).message ??
          "Failed to load photo detail";

        showError(message);
        setSelectedPhoto(null);
        setDraft(null);
      } finally {
        setDetailLoading(false);
      }
    },
    [applyDraftFromPhoto],
  );

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  const changeFilter = useCallback(
    (filter: PhotoUploadFilter) => {
      setActiveFilter(filter);

      if (filter === "all") {
        void loadRecentUploads("all", { keepExistingOnEmpty: true });
        return;
      }

      void loadRecentUploads(filter);
    },
    [loadRecentUploads],
  );

  const selectCapture = useCallback(
    (id: string) => {
      setSelectedCaptureId(id);
      setIsEditing(false);

      if (id.startsWith(LOCAL_CAPTURE_PREFIX)) {
        setActiveLocalCaptureId(id);
        setViewfinderZoom(1);
        return;
      }

      setActiveLocalCaptureId(null);
      void loadDetail(id);
    },
    [loadDetail],
  );

  const clearCaptureSelection = useCallback((id: string) => {
    if (selectedCaptureId !== id) {
      return;
    }

    setSelectedCaptureId("");
    setActiveLocalCaptureId(null);
    setViewfinderZoom(1);
    setSelectedPhoto(null);
    setDraft(null);
    setIsEditing(false);
  }, [selectedCaptureId]);

  const selectRecentUpload = useCallback(
    (id: string) => {
      setSelectedCaptureId(id);
      setIsEditing(false);
      void loadDetail(id);
    },
    [loadDetail],
  );

  const refreshAll = useCallback(async () => {
    await Promise.all([loadSummary(), loadToday()]);

    if (activeFilter !== "all") {
      await loadRecentUploads(activeFilter);
    }
  }, [activeFilter, loadRecentUploads, loadSummary, loadToday]);

  const deleteCapture = useCallback(
    async (id: string) => {
      if (id.startsWith(LOCAL_CAPTURE_PREFIX)) {
        setLocalPendingCaptures((current) => {
          const target = current.find((capture) => capture.id === id);

          if (target) {
            revokeLocalPreview(target.previewUrl);
          }

          return current.filter((capture) => capture.id !== id);
        });
        clearCaptureSelection(id);
        return true;
      }

      const response = await runAction(() => staffPhotoUploadsApi.delete(id));

      if (!response) {
        return false;
      }

      showToast.success({
        title: "Capture Deleted",
        message: response.message || "Capture removed",
      });

      clearCaptureSelection(id);
      await refreshAll();
      return true;
    },
    [clearCaptureSelection, refreshAll, revokeLocalPreview],
  );

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

  const uploadFile = useCallback(
    async (
      file: File,
      overrides?: Partial<SelectedPhotoDraft>,
      options?: { skipRefresh?: boolean },
    ) => {
      const payload = {
        photo: file,
        sectionLabel:
          overrides?.sectionLabel ||
          draft?.sectionLabel ||
          cameraContext.sectionLabel ||
          file.name,
        linkedJobReference:
          overrides?.linkedJobReference ||
          draft?.linkedJobReference ||
          cameraContext.linkedJobReference,
        categoryTags:
          overrides?.categoryTags ||
          draft?.categoryTags ||
          [],
        caption: overrides?.caption || draft?.caption,
        isIssueFlagged:
          overrides?.isIssueFlagged ?? draft?.isIssueFlagged ?? false,
      };

      const response = await runAction(() =>
        staffPhotoUploadsApi.uploadFile(payload),
      );

      if (!response) {
        return false;
      }

      if (!options?.skipRefresh) {
        showToast.success({
          title: "Photo Uploaded",
          message: response.message || "Photo uploaded successfully",
        });

        const createdId = extractPhotoUploadId(response.data) ?? "";

        await refreshAll();

        if (createdId) {
          await loadDetail(createdId);
        }
      }

      return true;
    },
    [cameraContext, draft, loadDetail, refreshAll],
  );

  const clearLocalPendingCaptures = useCallback(() => {
    setLocalPendingCaptures((current) => {
      current.forEach((capture) => revokeLocalPreview(capture.previewUrl));
      return [];
    });
    setActiveLocalCaptureId(null);
    setViewfinderZoom(1);
  }, [revokeLocalPreview]);

  const stageCapture = useCallback(
    (file: File) => {
      const captureMeta = buildCaptureUploadMeta(activeServiceTab, activeCaptureMode);
      const id = `${LOCAL_CAPTURE_PREFIX}${crypto.randomUUID()}`;
      const previewUrl = URL.createObjectURL(file);

      registerLocalPreview(previewUrl);

      const pending: LocalPendingCapture = {
        id,
        file,
        previewUrl,
        label: captureMeta.sectionLabel,
        sectionLabel: captureMeta.sectionLabel,
        categoryTags: captureMeta.categoryTags,
        linkedJobReference: cameraContext.linkedJobReference,
      };

      setLocalPendingCaptures((current) => [...current, pending]);
      setActiveLocalCaptureId(id);
      setSelectedCaptureId(id);
      setViewfinderZoom(activeCaptureMode === "zoom" ? 1.5 : 1);
      setIsEditing(false);
    },
    [
      activeCaptureMode,
      activeServiceTab,
      cameraContext.linkedJobReference,
      registerLocalPreview,
    ],
  );

  const uploadPendingCaptures = useCallback(async () => {
    if (localPendingCaptures.length === 0) {
      return false;
    }

    for (const capture of localPendingCaptures) {
      const uploaded = await uploadFile(
        capture.file,
        {
          sectionLabel: capture.sectionLabel,
          categoryTags: capture.categoryTags,
          linkedJobReference: capture.linkedJobReference,
        },
        { skipRefresh: true },
      );

      if (!uploaded) {
        return false;
      }
    }

    clearLocalPendingCaptures();

    showToast.success({
      title: "Photos Uploaded",
      message: "Pending captures uploaded successfully",
    });

    await refreshAll();
    return true;
  }, [clearLocalPendingCaptures, localPendingCaptures, refreshAll, uploadFile]);

  const createDraft = useCallback(
    async (body?: Partial<SelectedPhotoDraft>) => {
      const serviceMeta = serviceTabToDraftMeta(activeServiceTab);
      const payload = {
        sectionLabel:
          body?.sectionLabel ||
          draft?.sectionLabel ||
          cameraContext.sectionLabel ||
          serviceMeta.sectionLabel,
        categoryTags:
          body?.categoryTags ||
          draft?.categoryTags ||
          serviceMeta.categoryTags,
        caption: body?.caption || draft?.caption,
        linkedJobReference:
          body?.linkedJobReference ||
          draft?.linkedJobReference ||
          cameraContext.linkedJobReference,
      };

      const response = await runAction(() =>
        staffPhotoUploadsApi.createDraft(payload),
      );

      if (!response) {
        return null;
      }

      showToast.success({
        title: "Capture Draft Saved",
        message: response.message || "Photo metadata saved",
      });

      const createdId = extractPhotoUploadId(response.data);

      await refreshAll();

      if (createdId) {
        await loadDetail(createdId);
      }

      return createdId;
    },
    [activeServiceTab, cameraContext, draft, loadDetail, refreshAll],
  );

  const handleAddPhoto = useCallback(() => {
    captureInputRef.current?.click();
  }, []);

  const saveSelectedPhoto = useCallback(async () => {
    if (!selectedPhoto?.id || !draft) {
      return false;
    }

    const response = await runAction(() =>
      staffPhotoUploadsApi.update(selectedPhoto.id, {
        sectionLabel: draft.sectionLabel.trim(),
        categoryTags: draft.categoryTags,
        caption: draft.caption.trim() || undefined,
        linkedJobReference: draft.linkedJobReference.trim() || undefined,
        isIssueFlagged: draft.isIssueFlagged,
      }),
    );

    if (!response) {
      return false;
    }

    showToast.success({
      title: "Photo Updated",
      message: response.message || "Photo details saved",
    });

    setIsEditing(false);
    await refreshAll();
    await loadDetail(selectedPhoto.id);
    return true;
  }, [draft, loadDetail, refreshAll, selectedPhoto?.id]);

  const syncSelectedPhoto = useCallback(async () => {
    if (!selectedPhoto?.id) {
      return false;
    }

    const response = await runAction(() =>
      staffPhotoUploadsApi.syncOne(selectedPhoto.id),
    );

    if (!response) {
      return false;
    }

    showToast.success({
      title: "Photo Synced",
      message: response.message || "Photo synced successfully",
    });

    await refreshAll();
    await loadDetail(selectedPhoto.id);
    return true;
  }, [loadDetail, refreshAll, selectedPhoto?.id]);

  const syncAllPending = useCallback(async () => {
    const response = await runAction(() => staffPhotoUploadsApi.syncAll());

    if (!response) {
      return false;
    }

    showToast.success({
      title: "Uploads Synced",
      message: response.message || "Pending photos synced",
    });

    await refreshAll();

    if (selectedPhoto?.id) {
      await loadDetail(selectedPhoto.id);
    }

    return true;
  }, [loadDetail, refreshAll, selectedPhoto?.id]);

  const handleUploadNow = useCallback(async () => {
    if (localPendingCaptures.length > 0) {
      return uploadPendingCaptures();
    }

    return syncAllPending();
  }, [localPendingCaptures.length, syncAllPending, uploadPendingCaptures]);

  const handleUploadAll = useCallback(async () => {
    if (localPendingCaptures.length > 0) {
      const uploaded = await uploadPendingCaptures();

      if (!uploaded) {
        return false;
      }
    }

    return syncAllPending();
  }, [localPendingCaptures.length, syncAllPending, uploadPendingCaptures]);

  const handleShutter = useCallback(() => {
    captureInputRef.current?.click();
  }, []);

  const handleCaptureFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("video/")) {
        void uploadFile(file, buildCaptureUploadMeta(activeServiceTab, activeCaptureMode));
        return;
      }

      stageCapture(file);
    },
    [activeCaptureMode, activeServiceTab, stageCapture, uploadFile],
  );

  const handleCaptureFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) {
        return;
      }

      for (const file of Array.from(files)) {
        handleCaptureFile(file);
      }
    },
    [handleCaptureFile],
  );

  const zoomViewfinderIn = useCallback(() => {
    setViewfinderZoom((current) => Math.min(3, Number((current + 0.25).toFixed(2))));
  }, []);

  const zoomViewfinderOut = useCallback(() => {
    setViewfinderZoom((current) => Math.max(1, Number((current - 0.25).toFixed(2))));
  }, []);

  const handleDeviceUpload = useCallback(
    async (file: File) => {
      await uploadFile(file);
    },
    [uploadFile],
  );

  const updateDraft = useCallback(
    (updates: Partial<SelectedPhotoDraft>) => {
      setDraft((current) =>
        current
          ? { ...current, ...updates }
          : {
              sectionLabel: "",
              categoryTags: [],
              caption: "",
              linkedJobReference: "",
              isIssueFlagged: false,
              ...updates,
            },
      );
    },
    [],
  );

  const startEditing = useCallback(() => {
    if (selectedPhoto) {
      applyDraftFromPhoto(selectedPhoto);
    }

    setIsEditing(true);
  }, [applyDraftFromPhoto, selectedPhoto]);

  const cancelEditing = useCallback(() => {
    if (selectedPhoto) {
      applyDraftFromPhoto(selectedPhoto);
    }

    setIsEditing(false);
  }, [applyDraftFromPhoto, selectedPhoto]);

  return {
    activeFilter,
    activeServiceTab,
    activeCaptureMode,
    captureInputAccept: captureModeMeta.accept,
    captureInputMultiple: captureModeMeta.multiple,
    showRecBadge: captureModeMeta.showRec,
    viewfinderPreviewUrl,
    viewfinderZoom,
    header,
    tabs,
    cameraContext,
    todayCaptures: displayTodayCaptures(),
    todaySummary: displayTodaySummary(),
    recentUploads,
    selectedPhoto,
    selectedCaptureId,
    loading,
    detailLoading,
    actionLoading,
    isEditing,
    draft,
    uploadInputRef,
    captureInputRef,
    changeFilter,
    setActiveServiceTab,
    setActiveCaptureMode,
    selectCapture,
    selectRecentUpload,
    deleteCapture,
    handleShutter,
    handleCaptureFiles,
    handleDeviceUpload,
    handleAddPhoto,
    saveSelectedPhoto,
    syncSelectedPhoto,
    handleUploadNow,
    handleUploadAll,
    zoomViewfinderIn,
    zoomViewfinderOut,
    startEditing,
    cancelEditing,
    updateDraft,
    refreshAll,
  };
}
