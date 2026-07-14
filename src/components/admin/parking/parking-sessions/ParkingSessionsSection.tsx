"use client";

import { useCallback, useEffect, useState } from "react";
import { adminParkingApi } from "@/api/adminParking.api";
import {
  mapParkingSessionDetail,
  mapParkingSessionsList,
} from "@/lib/staffParkingSessions";
import { showError } from "@/lib/toast";
import { ParkingSessionDetailPanel } from "./ParkingSessionDetailPanel";
import { ParkingSessionListPanel } from "./ParkingSessionListPanel";
import type { ParkingSessionDetail, ParkingSessionListItem } from "./types";

type ParkingSessionsSectionProps = {
  refreshToken?: number;
  /** Keep panels shimmering until the whole page is ready to reveal. */
  holdReveal?: boolean;
  onBootstrapComplete?: () => void;
};

export function ParkingSessionsSection({
  refreshToken = 0,
  holdReveal = false,
  onBootstrapComplete,
}: ParkingSessionsSectionProps) {
  const [sessions, setSessions] = useState<ParkingSessionListItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState<ParkingSessionDetail | null>(null);
  const [bootstrapLoading, setBootstrapLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    setBootstrapLoading(true);
    setDetail(null);

    try {
      const response = await adminParkingApi.getSessions();
      const items = mapParkingSessionsList(response.data);
      const nextSelectedId = items[0]?.id || "";

      setSessions(items);
      setSelectedId(nextSelectedId);

      if (nextSelectedId) {
        const detailResponse = await adminParkingApi.getSession(nextSelectedId);
        setDetail(mapParkingSessionDetail(detailResponse.data));
      } else {
        setDetail(null);
      }
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load parking requests";

      showError(message);
      setSessions([]);
      setSelectedId("");
      setDetail(null);
    } finally {
      setBootstrapLoading(false);
      onBootstrapComplete?.();
    }
  }, [onBootstrapComplete]);

  const loadDetail = useCallback(async (id: string) => {
    if (!id) {
      setDetail(null);
      return;
    }

    setDetailLoading(true);

    try {
      const response = await adminParkingApi.getSession(id);
      setDetail(mapParkingSessionDetail(response.data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load parking session details";

      showError(message);
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions, refreshToken]);

  async function handleSelect(id: string) {
    if (id === selectedId || bootstrapLoading) {
      return;
    }

    setSelectedId(id);
    await loadDetail(id);
  }

  const panelsLoading = bootstrapLoading || holdReveal;
  const detailPanelLoading = panelsLoading || detailLoading;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <div className="xl:col-span-2">
        <ParkingSessionListPanel
          sessions={sessions}
          selectedId={selectedId}
          loading={panelsLoading}
          onSelect={handleSelect}
        />
      </div>
      <div className="xl:col-span-3">
        <ParkingSessionDetailPanel
          detail={detail}
          loading={detailPanelLoading && Boolean(selectedId || panelsLoading)}
        />
      </div>
    </div>
  );
}
