"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  VehicleFleetCar,
  VehicleFleetInService,
  VehicleFleetOverdue,
  VehicleFleetReady,
} from "@/components/common/Svgs";
import { vehiclesApi } from "@/api/vehicles.api";
import { showError } from "@/lib/toast";
import {
  createEmptyVehicleStats,
  indexInventoryVehicles,
  mapInventoryResponse,
  mapInventorySummary,
  mapVehicleDetail,
} from "@/lib/vehicles";
import { StatCard } from "@/components/staff/overview/StatCard";
import type { InventoryVehicleRaw } from "@/types/api";
import { VehiclesGreeting } from "./VehiclesGreeting";
import { VehicleListPanel } from "./VehicleListPanel";
import { VehicleDetailPanel } from "./VehicleDetailPanel";
import { AddVehicleModal } from "./add-vehicle";
import type { VehicleListItem, VehicleStatsDisplay } from "./types";

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleListItem[]>([]);
  const [inventoryById, setInventoryById] = useState<
    Record<string, InventoryVehicleRaw>
  >({});
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [stats, setStats] = useState<VehicleStatsDisplay>(createEmptyVehicleStats());

  const loadInventory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await vehiclesApi.getInventory();
      const items = mapInventoryResponse(response.data);

      setVehicles(items);
      setInventoryById(indexInventoryVehicles(response.data));
      setStats(mapInventorySummary(response.data) ?? createEmptyVehicleStats());
      setSelectedId((current) => current || items[0]?.id || "");
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load vehicle inventory";

      showError(message);
      setVehicles([]);
      setInventoryById({});
      setStats(createEmptyVehicleStats());
      setSelectedId("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === selectedId),
    [vehicles, selectedId],
  );

  const detail = useMemo(
    () =>
      mapVehicleDetail(
        inventoryById[selectedId],
        selectedVehicle,
      ),
    [inventoryById, selectedId, selectedVehicle],
  );

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
          />
        </div>
        <div className="xl:col-span-3">
          <VehicleDetailPanel detail={detail} />
        </div>
      </div>

      <AddVehicleModal
        open={addVehicleOpen}
        onClose={() => setAddVehicleOpen(false)}
        onSuccess={loadInventory}
      />
    </div>
  );
}
