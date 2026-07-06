"use client";

import { useEffect, useMemo, useState } from "react";
import { staffHealthReportsApi } from "@/api/staffHealthReports.api";
import { StatusPill } from "@/components/staff/overview/StatusPill";
import { VehicleListPanel } from "@/components/staff/vehicles/VehicleListPanel";
import { showError } from "@/lib/toast";
import { HealthReportDetailPanel } from "./HealthReportDetailPanel";
import { HealthReportsGreeting } from "./HealthReportsGreeting";
import {
  getFleetOverviewLabel,
  getFleetSummaryLabel,
  mapFleetHealthVehicles,
  mapHealthReportDetail,
  mapHealthReportTabs,
} from "./apiMappers";
import { mapFleetHealthItem } from "./mapFleetHealthItem";
import type {
  FleetHealthItem,
  HealthFilter,
  HealthReport,
  HealthReportTab,
} from "./types";

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
  const [selectedId, setSelectedId] = useState("");
  const [fleetHealthItems, setFleetHealthItems] = useState<FleetHealthItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null);
  const [tabs, setTabs] = useState<HealthReportTab[]>([]);
  const [summaryTitle, setSummaryTitle] = useState("Fleet Health Summary");
  const [overviewLabel, setOverviewLabel] = useState("Vehicles");
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const filteredItems = useMemo(
    () =>
      fleetHealthItems.filter((item) =>
        matchesFilter(item.healthStatus, activeFilter),
      ),
    [activeFilter, fleetHealthItems],
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

  useEffect(() => {
    let cancelled = false;

    async function loadVehicles() {
      setLoadingVehicles(true);

      try {
        const response = await staffHealthReportsApi.getVehicles();

        if (cancelled) return;

        const items = mapFleetHealthVehicles(response.data.vehicles);
        setFleetHealthItems(items);
        setTabs(mapHealthReportTabs(response.data.tabs));
        setSummaryTitle(getFleetSummaryLabel(response.data));
        setOverviewLabel(getFleetOverviewLabel(response.data));
        setSelectedId((current) => current || items[0]?.id || "");
      } catch (error) {
        if (!cancelled) {
          setFleetHealthItems([]);
          setSelectedReport(null);
          showError(
            error instanceof Error
              ? error.message
              : "Failed to load health report vehicles.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingVehicles(false);
        }
      }
    }

    void loadVehicles();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!effectiveSelectedId) {
      setSelectedReport(null);
      return;
    }

    let cancelled = false;

    async function loadDetail() {
      setLoadingDetail(true);

      try {
        const response =
          await staffHealthReportsApi.getVehicleDetail(effectiveSelectedId);

        if (!cancelled) {
          setSelectedReport(mapHealthReportDetail(response.data));
        }
      } catch (error) {
        if (!cancelled) {
          setSelectedReport(null);
          showError(
            error instanceof Error
              ? error.message
              : "Failed to load vehicle health report.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingDetail(false);
        }
      }
    }

    void loadDetail();

    return () => {
      cancelled = true;
    };
  }, [effectiveSelectedId]);

  return (
    <div className="space-y-8 p-8">
      <HealthReportsGreeting
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        tabs={tabs}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <VehicleListPanel
            vehicles={vehicles}
            selectedId={effectiveSelectedId}
            loading={loadingVehicles}
            onSelect={setSelectedId}
            title={summaryTitle}
            headerRight={
              <StatusPill label={overviewLabel} tone="gold" />
            }
            emptyMessage="No vehicles match this filter"
          />
        </div>

        <div className="xl:col-span-3">
          {loadingDetail ? (
            <div className="rounded-2xl border border-accent/10 bg-card px-5 py-8 text-center">
              <p className="font-roboto text-sm text-secondary">
                Loading health report...
              </p>
            </div>
          ) : selectedReport ? (
            <HealthReportDetailPanel report={selectedReport} />
          ) : (
            <div className="rounded-2xl border border-accent/10 bg-card px-5 py-8 text-center">
              <p className="font-roboto text-sm text-secondary">
                Select a vehicle to view its health report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
