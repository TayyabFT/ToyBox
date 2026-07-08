"use client";

import { useState } from "react";
import { MemberGarageCard } from "./MemberGarageCard";
import { MemberGarageFilters } from "./MemberGarageFilters";
import { MemberGarageHeader } from "./MemberGarageHeader";
import { garageFilters, garageVehicles } from "./mockData";
import type { GarageFilterKey } from "./types";

function matchesFilter(vehicle: (typeof garageVehicles)[number], filter: GarageFilterKey) {
  if (filter === "all") return true;
  if (filter === "modern" || filter === "classic") return vehicle.era === filter;
  return vehicle.statusTone === filter;
}

export function MemberGaragePage() {
  const [activeFilter, setActiveFilter] = useState<GarageFilterKey>("all");

  const vehicles = garageVehicles.filter((vehicle) => matchesFilter(vehicle, activeFilter));

  return (
    <div className="space-y-6 p-8">
      <MemberGarageHeader />
      <MemberGarageFilters
        filters={garageFilters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {vehicles.map((vehicle) => (
          <MemberGarageCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}
