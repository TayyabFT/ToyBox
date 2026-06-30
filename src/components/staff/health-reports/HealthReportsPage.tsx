"use client";

import { useMemo, useState } from "react";
import { StatusPill } from "@/components/staff/overview/StatusPill";
import { VehicleListPanel } from "@/components/staff/vehicles/VehicleListPanel";
import { HealthReportDetailPanel } from "./HealthReportDetailPanel";
import { HealthReportsGreeting } from "./HealthReportsGreeting";
import { fleetHealthItems, healthReports } from "./mockData";
import { mapFleetHealthItem } from "./mapFleetHealthItem";
import type { HealthFilter } from "./types";

function matchesFilter(
  healthStatus: string,
  filter: HealthFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "critical") return healthStatus === "critical";
  if (filter === "due-service") return healthStatus === "due-service";
  return healthStatus === "good" || healthStatus === "excellent";
}

export function HealthReportsPage() {
  const [activeFilter, setActiveFilter] = useState<HealthFilter>("all");
  const [selectedId, setSelectedId] = useState(fleetHealthItems[0]?.id ?? "");

  const filteredItems = useMemo(
    () =>
      fleetHealthItems.filter((item) =>
        matchesFilter(item.healthStatus, activeFilter),
      ),
    [activeFilter],
  );

  const vehicles = useMemo(
    () => filteredItems.map(mapFleetHealthItem),
    [filteredItems],
  );

  const effectiveSelectedId = useMemo(() => {
    if (vehicles.some((vehicle) => vehicle.id === selectedId)) {
      return selectedId;
    }

    return vehicles[0]?.id ?? "";
  }, [vehicles, selectedId]);

  const selectedReport = healthReports[effectiveSelectedId];

  return (
    <div className="space-y-8 p-8">
      <HealthReportsGreeting
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <VehicleListPanel
            vehicles={vehicles}
            selectedId={effectiveSelectedId}
            loading={false}
            onSelect={setSelectedId}
            title="Fleet Health Summary"
            headerRight={
              <StatusPill label="287 Vehicles" tone="gold" />
            }
            emptyMessage="No vehicles match this filter"
          />
        </div>

        <div className="xl:col-span-3">
          {selectedReport ? (
            <HealthReportDetailPanel report={selectedReport} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
