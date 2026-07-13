"use client";

import { useCallback, useEffect, useState } from "react";
import {
  VehicleFleetCar,
  VehicleFleetInService,
  VehicleFleetOverdue,
  VehicleFleetReady,
} from "@/components/common/Svgs";
import { staffParkingApi } from "@/api/staffParking.api";
import { StatCard } from "@/components/staff/overview/StatCard";
import {
  createEmptyParkingSlotsSummary,
  mapParkingSlotsSummary,
} from "@/lib/staffParkingSlots";
import type { ParkingSlotsSummaryDisplay } from "@/components/staff/vehicles/parking-slots/types";

type ParkingSlotsSummaryRowProps = {
  refreshToken?: number;
};

export function ParkingSlotsSummaryRow({
  refreshToken = 0,
}: ParkingSlotsSummaryRowProps) {
  const [summary, setSummary] = useState<ParkingSlotsSummaryDisplay>(
    createEmptyParkingSlotsSummary(),
  );
  const [loading, setLoading] = useState(true);

  const loadSummary = useCallback(async () => {
    setLoading(true);

    try {
      const response = await staffParkingApi.getSummary();
      setSummary(mapParkingSlotsSummary(response.data));
    } catch {
      setSummary(createEmptyParkingSlotsSummary());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary, refreshToken]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
      <StatCard
        label={summary.total.label}
        value={summary.total.value}
        subtext={summary.total.subtext || "ALL PARKING SLOTS"}
        icon={<VehicleFleetCar />}
        iconSize="lg"
        iconFit="native"
        valueLoading={loading}
      />
      <StatCard
        label={summary.available.label}
        value={summary.available.value}
        subtext={summary.available.subtext || "OPEN SLOTS"}
        icon={<VehicleFleetReady />}
        iconSize="lg"
        valueLoading={loading}
      />
      <StatCard
        label={summary.occupied.label}
        value={summary.occupied.value}
        subtext={summary.occupied.subtext || "IN USE"}
        icon={<VehicleFleetInService />}
        iconSize="lg"
        valueLoading={loading}
      />
      <StatCard
        label={summary.maintenance.label}
        value={summary.maintenance.value}
        subtext={summary.maintenance.subtext || "UNDER MAINTENANCE"}
        icon={<VehicleFleetOverdue />}
        iconSize="lg"
        valueLoading={loading}
      />
    </div>
  );
}
