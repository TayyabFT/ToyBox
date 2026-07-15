"use client";

import { useCallback, useEffect, useState } from "react";
import { authApi } from "@/api/auth.api";
import { membersApi } from "@/api/members.api";
import { staffOperationalUpdatesApi } from "@/api/staffOperationalUpdates.api";
import { vehiclesApi } from "@/api/vehicles.api";
import { mapMembersDirectory } from "@/lib/members";
import {
  buildOperationalUpdatePayload,
  extractCreatedOperationalUpdateId,
  extractOperationalUpdateId,
  extractSummaryShell,
  isPinnableOperationalUpdateId,
  getProfileDisplayName,
  getProfileInitial,
  mapOpUpdateFilterToQuery,
  mapOperationalUpdateDetail,
  mapPinnedNotices,
  mapShiftFeedItems,
  mapShiftLogEntries,
  validateOperationalUpdateForm,
} from "@/lib/staffOperationalUpdates";
import { mapOfferVehicleOptions } from "@/lib/vehicles";
import { isApiError } from "@/lib/apiError";
import { showError, showToast } from "@/lib/toast";
import type {
  LinkedOption,
  ManagementBroadcast,
  OpUpdateFilter,
  OpUpdateHeader,
  OpUpdateTab,
  PinnedNotice,
  PostCategory,
  ShiftFeedItem,
  ShiftLogEntry,
} from "./types";

const EMPTY_HEADER: OpUpdateHeader = {
  dateLabel: "—",
  shiftLabel: "Staff Shift",
};

const DEFAULT_TABS: OpUpdateTab[] = [
  { id: "all", label: "All Updates" },
  { id: "announcements", label: "Announcements" },
  { id: "my-posts", label: "My Posts" },
  { id: "flagged", label: "Flagged" },
];

export function useStaffOperationalUpdates() {
  const [header, setHeader] = useState<OpUpdateHeader>(EMPTY_HEADER);
  const [tabs, setTabs] = useState<OpUpdateTab[]>(DEFAULT_TABS);
  const [broadcast, setBroadcast] = useState<ManagementBroadcast | null>(null);
  const [feedItems, setFeedItems] = useState<ShiftFeedItem[]>([]);
  const [pinnedNotices, setPinnedNotices] = useState<PinnedNotice[]>([]);
  const [shiftLogEntries, setShiftLogEntries] = useState<ShiftLogEntry[]>([]);
  const [shiftLogStaffName, setShiftLogStaffName] = useState("Staff");
  const [shiftLogFooter, setShiftLogFooter] = useState("");
  const [authorInitial, setAuthorInitial] = useState("S");
  const [vehicleOptions, setVehicleOptions] = useState<LinkedOption[]>([]);
  const [memberOptions, setMemberOptions] = useState<LinkedOption[]>([]);

  const [activeFilter, setActiveFilter] = useState<OpUpdateFilter>("all");
  const [postText, setPostText] = useState("");
  const [activeCategory, setActiveCategory] = useState<PostCategory>("general");
  const [isFlagged, setIsFlagged] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [linkedJobReference, setLinkedJobReference] = useState("");

  const [loading, setLoading] = useState(true);
  const [feedLoading, setFeedLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [pinningId, setPinningId] = useState("");

  const loadPinned = useCallback(async () => {
    try {
      const response = await staffOperationalUpdatesApi.getPinned();
      setPinnedNotices(mapPinnedNotices(response.data));
    } catch {
      setPinnedNotices([]);
    }
  }, []);

  const loadShiftLog = useCallback(async () => {
    try {
      const response = await staffOperationalUpdatesApi.getMyShiftLog();
      const mapped = mapShiftLogEntries(response.data);

      setShiftLogStaffName(mapped.staffName);
      setShiftLogEntries(mapped.entries);
      setShiftLogFooter(mapped.footerNote);
    } catch {
      setShiftLogEntries([]);
      setShiftLogFooter("");
    }
  }, []);

  const loadFeed = useCallback(async (filter: OpUpdateFilter) => {
    setFeedLoading(true);

    try {
      const response = await staffOperationalUpdatesApi.getFeed({
        filter: mapOpUpdateFilterToQuery(filter),
        limit: 50,
        offset: 0,
      });

      setFeedItems(mapShiftFeedItems(response.data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to load update feed";

      showError(message);
      setFeedItems([]);
    } finally {
      setFeedLoading(false);
    }
  }, []);

  const loadSummary = useCallback(async () => {
    try {
      const response = await staffOperationalUpdatesApi.getSummary();
      const shell = extractSummaryShell(response.data);

      setHeader(shell.header);
      setTabs(shell.tabs);
      setBroadcast(shell.broadcast);
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load operational updates";

      showError(message);
      setHeader(EMPTY_HEADER);
      setTabs(DEFAULT_TABS);
      setBroadcast(null);
    }
  }, []);

  const loadOptions = useCallback(async () => {
    setOptionsLoading(true);

    try {
      const [profileResponse, vehiclesResponse, membersResponse] =
        await Promise.all([
          authApi.getProfile(),
          vehiclesApi.getInventory({ limit: 100, offset: 0 }),
          membersApi.getMembers({ limit: 100, offset: 0 }),
        ]);

      const profile = profileResponse.data;
      setAuthorInitial(getProfileInitial(profile?.name, profile?.email));
      setShiftLogStaffName(
        getProfileDisplayName(profile?.name, profile?.email),
      );

      const vehicles = mapOfferVehicleOptions(vehiclesResponse.data);
      setVehicleOptions(
        vehicles.map((item) => ({ id: item.id, label: item.name })),
      );

      const members = mapMembersDirectory(membersResponse.data).members;
      setMemberOptions(
        members.map((item) => ({ id: item.id, label: item.name })),
      );
    } catch {
      setVehicleOptions([]);
      setMemberOptions([]);
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadSummary(),
      loadFeed(activeFilter),
      loadPinned(),
      loadShiftLog(),
    ]);
  }, [activeFilter, loadFeed, loadPinned, loadShiftLog, loadSummary]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setLoading(true);

      await Promise.all([
        loadSummary(),
        loadPinned(),
        loadShiftLog(),
        loadOptions(),
      ]);

      if (!cancelled) {
        setLoading(false);
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [loadFeed, loadOptions, loadPinned, loadShiftLog, loadSummary]);

  useEffect(() => {
    if (loading) {
      return;
    }

    void loadFeed(activeFilter);
  }, [activeFilter, loadFeed, loading]);

  const createUpdate = useCallback(async () => {
    const trimmed = postText.trim();

    if (!trimmed) {
      return false;
    }

    const validationMessage = validateOperationalUpdateForm({
      body: trimmed,
      category: activeCategory,
      isFlagged,
      vehicleId: selectedVehicleId,
      memberId: selectedMemberId,
      linkedJobReference,
    });

    if (validationMessage) {
      showError(validationMessage);
      return false;
    }

    setPosting(true);

    try {
      const payload = buildOperationalUpdatePayload({
        body: trimmed,
        category: activeCategory,
        isFlagged,
        vehicleId: selectedVehicleId,
        memberId: selectedMemberId,
        linkedJobReference,
        title: trimmed.length > 60 ? `${trimmed.slice(0, 57)}...` : trimmed,
      });

      const response = await staffOperationalUpdatesApi.create(payload);
      const createdId = extractCreatedOperationalUpdateId(response.data);

      showToast.success({
        title: "Update Posted",
        message: response.message || "Operational update posted successfully",
      });

      setPostText("");
      setIsFlagged(false);
      setActiveCategory("general");
      setSelectedVehicleId("");
      setSelectedMemberId("");
      setLinkedJobReference("");

      if (createdId) {
        try {
          const detailResponse =
            await staffOperationalUpdatesApi.getDetail(createdId);
          const mapped = mapOperationalUpdateDetail(detailResponse.data);

          if (mapped) {
            setFeedItems((current) => [
              mapped,
              ...current.filter((item) => item.id !== mapped.id),
            ]);
          }
        } catch {
          // Fall back to full refresh below.
        }
      }

      await Promise.all([
        loadFeed(activeFilter),
        loadShiftLog(),
        loadSummary(),
        loadPinned(),
      ]);

      return true;
    } catch (error) {
      const apiMessage = isApiError(error)
        ? error.errors?.map((item) => item.message).filter(Boolean).join(" ")
        : "";
      const message =
        apiMessage ||
        (error as { message?: string }).message ||
        "Failed to post update";

      showError(message);
      return false;
    } finally {
      setPosting(false);
    }
  }, [
    activeCategory,
    activeFilter,
    isFlagged,
    linkedJobReference,
    loadFeed,
    loadPinned,
    loadShiftLog,
    loadSummary,
    postText,
    selectedMemberId,
    selectedVehicleId,
  ]);

  const togglePin = useCallback(
    async (id: string, isPinned: boolean) => {
      if (!isPinnableOperationalUpdateId(id)) {
        showError("This item can't be pinned.");
        return;
      }

      setPinningId(id);

      try {
        const response = await staffOperationalUpdatesApi.setPinned(
          extractOperationalUpdateId(id),
          {
            isPinned: !isPinned,
          },
        );

        showToast.success({
          title: !isPinned ? "Update Pinned" : "Update Unpinned",
          message: response.message || "Pinned status updated",
        });

        const mapped = mapOperationalUpdateDetail(response.data);

        if (mapped) {
          setFeedItems((current) =>
            current.map((item) => (item.id === id ? { ...item, ...mapped } : item)),
          );
        }

        await Promise.all([loadPinned(), loadSummary(), loadFeed(activeFilter)]);
      } catch (error) {
        const apiMessage = isApiError(error)
          ? error.errors?.map((item) => item.message).filter(Boolean).join(" ")
          : "";
        const message =
          apiMessage ||
          (error as { message?: string }).message ||
          "Failed to update pin status";

        showError(message);
      } finally {
        setPinningId("");
      }
    },
    [activeFilter, loadFeed, loadPinned, loadSummary],
  );

  return {
    header,
    tabs,
    broadcast,
    feedItems,
    pinnedNotices,
    shiftLogEntries,
    shiftLogStaffName,
    shiftLogFooter,
    authorInitial,
    vehicleOptions,
    memberOptions,
    activeFilter,
    postText,
    activeCategory,
    isFlagged,
    selectedVehicleId,
    selectedMemberId,
    linkedJobReference,
    loading,
    feedLoading,
    posting,
    optionsLoading,
    pinningId,
    setActiveFilter,
    setPostText,
    setActiveCategory,
    setIsFlagged,
    setSelectedVehicleId,
    setSelectedMemberId,
    setLinkedJobReference,
    createUpdate,
    togglePin,
    refreshAll,
  };
}
