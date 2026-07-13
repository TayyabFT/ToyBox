"use client";

import { useCallback, useEffect, useState } from "react";
import { staffParkingApi } from "@/api/staffParking.api";
import {
  mapParkingSessionDetail,
  mapParkingSessionsList,
} from "@/lib/staffParkingSessions";
import { showError } from "@/lib/toast";
import { ParkingSessionActionModal } from "./ParkingSessionActionModal";
import { ParkingSessionDetailPanel } from "./ParkingSessionDetailPanel";
import { ParkingSessionListPanel } from "./ParkingSessionListPanel";
import type {
  ParkingSessionAction,
  ParkingSessionDetail,
  ParkingSessionListItem,
} from "./types";

type ParkingSessionsSectionProps = {
  refreshToken?: number;
};

export function ParkingSessionsSection({
  refreshToken = 0,
}: ParkingSessionsSectionProps) {
  const [sessions, setSessions] = useState<ParkingSessionListItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState<ParkingSessionDetail | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<ParkingSessionAction | null>(
    null,
  );

  const loadSessions = useCallback(async () => {
    setListLoading(true);

    try {
      const response = await staffParkingApi.getSessions();
      const items = mapParkingSessionsList(response.data);

      setSessions(items);
      setSelectedId((current) => current || items[0]?.id || "");
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load parking requests";

      showError(message);
      setSessions([]);
      setSelectedId("");
      setDetail(null);
    } finally {
      setListLoading(false);
    }
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    if (!id) {
      setDetail(null);
      return;
    }

    setDetailLoading(true);

    try {
      const response = await staffParkingApi.getSession(id);
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

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }

    void loadDetail(selectedId);
  }, [loadDetail, selectedId]);

  const handleOpenAction = useCallback((action: ParkingSessionAction) => {
    setPendingAction(action);
    setActionOpen(true);
  }, []);

  const handleActionSuccess = useCallback(async () => {
    setActionLoading(true);

    try {
      await loadSessions();
      if (selectedId) {
        await loadDetail(selectedId);
      }
    } finally {
      setActionLoading(false);
    }
  }, [loadDetail, loadSessions, selectedId]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <ParkingSessionListPanel
            sessions={sessions}
            selectedId={selectedId}
            loading={listLoading}
            onSelect={setSelectedId}
          />
        </div>
        <div className="xl:col-span-3">
          <ParkingSessionDetailPanel
            detail={detail}
            loading={detailLoading && Boolean(selectedId)}
            actionLoading={actionLoading}
            onAction={handleOpenAction}
          />
        </div>
      </div>

      <ParkingSessionActionModal
        open={actionOpen}
        action={pendingAction}
        session={detail}
        onClose={() => {
          setActionOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleActionSuccess}
      />
    </>
  );
}
