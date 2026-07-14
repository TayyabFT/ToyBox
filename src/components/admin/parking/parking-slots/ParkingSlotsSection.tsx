"use client";

import { useCallback, useEffect, useState } from "react";
import {
  VehicleFleetCar,
  VehicleFleetInService,
  VehicleFleetOverdue,
  VehicleFleetReady,
} from "@/components/common/Svgs";
import { adminParkingApi } from "@/api/adminParking.api";
import { StatCard } from "@/components/staff/overview/StatCard";
import {
  createEmptyParkingSlotsSummary,
  mapParkingSlotDetail,
  mapParkingSlotsList,
  mapParkingSlotsSummary,
} from "@/lib/staffParkingSlots";
import { showError, showSuccess } from "@/lib/toast";
import { EditParkingSlotModal } from "./EditParkingSlotModal";
import { ParkingSlotDetailPanel } from "./ParkingSlotDetailPanel";
import { ParkingSlotListPanel } from "./ParkingSlotListPanel";
import type {
  ParkingSlotDetail,
  ParkingSlotListItem,
  ParkingSlotsSummaryDisplay,
} from "./types";

type ParkingSlotsSectionProps = {
  refreshToken?: number;
  showSummary?: boolean;
  /** Keep panels shimmering until the whole page is ready to reveal. */
  holdReveal?: boolean;
  onBootstrapComplete?: () => void;
};

export function ParkingSlotsSection({
  refreshToken = 0,
  showSummary = true,
  holdReveal = false,
  onBootstrapComplete,
}: ParkingSlotsSectionProps) {
  const [slots, setSlots] = useState<ParkingSlotListItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState<ParkingSlotDetail | null>(null);
  const [summary, setSummary] = useState<ParkingSlotsSummaryDisplay>(
    createEmptyParkingSlotsSummary(),
  );
  const [bootstrapLoading, setBootstrapLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadSlots = useCallback(async () => {
    setBootstrapLoading(true);
    setDetail(null);

    try {
      const [listResponse, summaryResponse] = await Promise.all([
        adminParkingApi.getSlots(),
        showSummary ? adminParkingApi.getSummary() : Promise.resolve(null),
      ]);

      const items = mapParkingSlotsList(listResponse.data);
      const nextSelectedId = items[0]?.id || "";

      setSlots(items);
      if (summaryResponse) {
        setSummary(mapParkingSlotsSummary(summaryResponse.data));
      }
      setSelectedId(nextSelectedId);

      if (nextSelectedId) {
        const detailResponse = await adminParkingApi.getSlot(nextSelectedId);
        setDetail(mapParkingSlotDetail(detailResponse.data));
      } else {
        setDetail(null);
      }
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load parking slots";

      showError(message);
      setSlots([]);
      setSummary(createEmptyParkingSlotsSummary());
      setSelectedId("");
      setDetail(null);
    } finally {
      setBootstrapLoading(false);
      onBootstrapComplete?.();
    }
  }, [onBootstrapComplete, showSummary]);

  const loadDetail = useCallback(async (id: string) => {
    if (!id) {
      setDetail(null);
      return;
    }

    setDetailLoading(true);

    try {
      const response = await adminParkingApi.getSlot(id);
      setDetail(mapParkingSlotDetail(response.data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load parking slot details";

      showError(message);
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSlots();
  }, [loadSlots, refreshToken]);

  async function handleSelect(id: string) {
    if (id === selectedId || bootstrapLoading) {
      return;
    }

    setSelectedId(id);
    await loadDetail(id);
  }

  const handleDeleteSlot = useCallback(async () => {
    if (!selectedId) {
      return;
    }

    setDeleting(true);

    try {
      await adminParkingApi.deleteSlot(selectedId);
      showSuccess("Parking slot deleted successfully");
      setDetail(null);
      setSelectedId("");
      await loadSlots();
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to delete parking slot";

      showError(message);
    } finally {
      setDeleting(false);
    }
  }, [loadSlots, selectedId]);

  const panelsLoading = bootstrapLoading || holdReveal;
  const detailPanelLoading = panelsLoading || detailLoading;

  return (
    <div className="space-y-6">
      {showSummary ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
          <StatCard
            label={summary.total.label}
            value={summary.total.value}
            subtext={summary.total.subtext || "ALL PARKING SLOTS"}
            icon={<VehicleFleetCar />}
            iconSize="lg"
            iconFit="native"
            valueLoading={panelsLoading}
          />
          <StatCard
            label={summary.available.label}
            value={summary.available.value}
            subtext={summary.available.subtext || "OPEN SLOTS"}
            icon={<VehicleFleetReady />}
            iconSize="lg"
            valueLoading={panelsLoading}
          />
          <StatCard
            label={summary.occupied.label}
            value={summary.occupied.value}
            subtext={summary.occupied.subtext || "IN USE"}
            icon={<VehicleFleetInService />}
            iconSize="lg"
            valueLoading={panelsLoading}
          />
          <StatCard
            label={summary.maintenance.label}
            value={summary.maintenance.value}
            subtext={summary.maintenance.subtext || "UNDER MAINTENANCE"}
            icon={<VehicleFleetOverdue />}
            iconSize="lg"
            valueLoading={panelsLoading}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <ParkingSlotListPanel
            slots={slots}
            selectedId={selectedId}
            loading={panelsLoading}
            onSelect={handleSelect}
          />
        </div>
        <div className="xl:col-span-3">
          <ParkingSlotDetailPanel
            detail={detail}
            loading={detailPanelLoading && Boolean(selectedId || panelsLoading)}
            deleting={deleting}
            onEdit={() => setEditOpen(true)}
            onDelete={handleDeleteSlot}
          />
        </div>
      </div>

      <EditParkingSlotModal
        open={editOpen}
        slot={detail}
        onClose={() => setEditOpen(false)}
        onSuccess={async () => {
          await loadSlots();
          if (selectedId) {
            await loadDetail(selectedId);
          }
        }}
      />
    </div>
  );
}
