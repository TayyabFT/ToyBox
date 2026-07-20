"use client";

import { useCallback, useEffect, useState } from "react";
import { AddVehicleModal } from "@/components/staff/vehicles/add-vehicle";
import { adminVehiclesApi } from "@/api/adminVehicles.api";
import {
  createEmptyVehicleStats,
  mapAdminVehiclesPage,
  OPERATION_FILTER_TO_SUMMARY_KEY,
} from "@/lib/adminVehicles";
import { showError } from "@/lib/toast";
import type { AdminVehiclesSummaryKey } from "@/types/api";
import { BayMap } from "./BayMap";
import { VehicleOperations } from "./VehicleOperations";
import { VehiclesPageHeader } from "./VehiclesPageHeader";
import { VehiclesStatsRow } from "./VehiclesStatsRow";
import { vehicleStats } from "./mockData";
import type {
  BayMapDisplay,
  OperationStatus,
  VehicleOperationRow,
  VehiclesStatsDisplay,
} from "./types";

const PAGE_SIZE = 10;

const EMPTY_BAY_MAP: BayMapDisplay = {
  level: "01",
  levelLabel: "Level 01",
  bays: [],
};

export function VehiclesPage() {
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [stats, setStats] = useState<VehiclesStatsDisplay>(vehicleStats);
  const [bayMap, setBayMap] = useState<BayMapDisplay>(EMPTY_BAY_MAP);
  const [operations, setOperations] = useState<VehicleOperationRow[]>([]);
  const [activeSummaryKey, setActiveSummaryKey] = useState<string | undefined>();
  const [activeFilter, setActiveFilter] = useState<"all" | OperationStatus>("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadVehicles = useCallback(async () => {
    setLoading(true);

    const summaryKey =
      activeSummaryKey ||
      OPERATION_FILTER_TO_SUMMARY_KEY[activeFilter];

    try {
      const response = await adminVehiclesApi.getVehicles({
        summaryKey: summaryKey as AdminVehiclesSummaryKey | undefined,
        includeBayMap: true,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      });

      const result = mapAdminVehiclesPage(response.data);

      setStats(result.stats);
      setBayMap(result.bayMap);
      setOperations(result.operations);
      setTotal(result.total);
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to load vehicles";

      showError(message);
      setStats(createEmptyVehicleStats());
      setBayMap(EMPTY_BAY_MAP);
      setOperations([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, activeSummaryKey, page]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  function handleSummaryClick(summaryKey?: string) {
    if (!summaryKey) return;

    setActiveFilter("all");
    setActiveSummaryKey((current) =>
      current === summaryKey ? undefined : summaryKey,
    );
    setPage(1);
  }

  function handleFilterChange(filter: "all" | OperationStatus) {
    setActiveFilter(filter);
    setActiveSummaryKey(OPERATION_FILTER_TO_SUMMARY_KEY[filter]);
    setPage(1);
  }

  return (
    <div className="space-y-7 p-8">
      <VehiclesPageHeader onAddVehicleClick={() => setAddVehicleOpen(true)} />
      <VehiclesStatsRow
        stats={stats}
        loading={loading}
        activeSummaryKey={activeSummaryKey}
        onSummaryClick={handleSummaryClick}
      />
      <BayMap bayMap={bayMap} loading={loading} />
      <VehicleOperations
        operations={operations}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        loading={loading}
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />
      <AddVehicleModal
        open={addVehicleOpen}
        onClose={() => setAddVehicleOpen(false)}
        onSuccess={loadVehicles}
      />
    </div>
  );
}
