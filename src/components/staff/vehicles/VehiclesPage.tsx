"use client";

import { useCallback, useEffect, useState } from "react";
import {
  VehicleFleetCar,
  VehicleFleetInService,
  VehicleFleetOverdue,
  VehicleFleetReady,
} from "@/components/common/Svgs";
import { staffVehiclesApi } from "@/api/staffVehicles.api";
import { showError } from "@/lib/toast";
import { createEmptyVehicleStats } from "@/lib/vehicles";
import {
  mapStaffAssignedVehicleDetail,
  mapStaffAssignedVehicles,
  mapStaffVehicleSummary,
} from "@/lib/staffVehicles";
import { StatCard } from "@/components/staff/overview/StatCard";
import { VehiclesGreeting } from "./VehiclesGreeting";
import { VehicleListPanel } from "./VehicleListPanel";
import { VehicleDetailPanel } from "./VehicleDetailPanel";
import { AddVehicleModal } from "./add-vehicle";
import type { VehicleDetail, VehicleListItem, VehicleStatsDisplay } from "./types";

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleListItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [stats, setStats] = useState<VehicleStatsDisplay>(
    createEmptyVehicleStats(),
  );
  const [detail, setDetail] = useState<VehicleDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [summaryResponse, assignedResponse] = await Promise.all([
        staffVehiclesApi.getSummary(),
        staffVehiclesApi.getAssigned(),
      ]);

      const items = mapStaffAssignedVehicles(assignedResponse.data);

      setStats(mapStaffVehicleSummary(summaryResponse.data));
      setVehicles(items);
      setSelectedId((current) => {
        if (current && items.some((item) => item.id === current)) {
          return current;
        }

        return items[0]?.id ?? "";
      });
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load assigned vehicles";

      showError(message);
      setVehicles([]);
      setStats(createEmptyVehicleStats());
      setSelectedId("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }

    let active = true;
    setDetailLoading(true);

    staffVehiclesApi
      .getAssignedDetail(selectedId)
      .then((response) => {
        if (!active) return;

        setDetail(mapStaffAssignedVehicleDetail(response.data));
      })
      .catch((error: unknown) => {
        if (!active) return;

        const message =
          (error as { message?: string }).message ??
          "Failed to load vehicle details";

        showError(message);
        setDetail(null);
      })
      .finally(() => {
        if (active) {
          setDetailLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedId]);

  return (
    <div className="space-y-8 p-8">
      <VehiclesGreeting onAddVehicle={() => setAddVehicleOpen(true)} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          label={stats.total.label}
          value={stats.total.value}
          subtext={stats.total.subtext}
          icon={<VehicleFleetCar />}
          iconSize="lg"
          iconFit="native"
          valueLoading={loading}
        />
        <StatCard
          label={stats.ready.label}
          value={stats.ready.value}
          subtext={stats.ready.subtext}
          icon={<VehicleFleetReady />}
          iconSize="lg"
          valueLoading={loading}
        />
        <StatCard
          label={stats.inService.label}
          value={stats.inService.value}
          subtext={stats.inService.subtext}
          icon={<VehicleFleetInService />}
          iconSize="lg"
          valueLoading={loading}
        />
        <StatCard
          label={stats.overdue.label}
          value={stats.overdue.value}
          subtext={stats.overdue.subtext}
          icon={<VehicleFleetOverdue />}
          iconSize="lg"
          valueLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <VehicleListPanel
            vehicles={vehicles}
            selectedId={selectedId}
            loading={loading}
            onSelect={setSelectedId}
            emptyMessage="No assigned vehicles"
          />
        </div>
        <div className="xl:col-span-3">
          <VehicleDetailPanel
            detail={detail}
            loading={loading || detailLoading}
          />
        </div>
      </div>

      <AddVehicleModal
        open={addVehicleOpen}
        onClose={() => setAddVehicleOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
