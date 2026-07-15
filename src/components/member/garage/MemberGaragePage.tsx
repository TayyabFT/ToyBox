"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/api/auth.api";
import { memberVehiclesApi } from "@/api/memberVehicles.api";
import { mapGarageFilters, mapGarageVehicle } from "@/lib/garage";
import { MemberGarageCard } from "./MemberGarageCard";
import { MemberGarageFilters } from "./MemberGarageFilters";
import { MemberGarageHeader } from "./MemberGarageHeader";
import { MemberGarageSkeleton, MemberGarageCardsSkeleton } from "./MemberGarageSkeleton";
import type { GarageFilter, GarageFilterKey, GarageVehicle } from "./types";

export function MemberGaragePage() {
  const [memberId, setMemberId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<GarageFilterKey>("all");
  const [vehicles, setVehicles] = useState<GarageVehicle[]>([]);
  const [filters, setFilters] = useState<GarageFilter[]>([
    { key: "all", label: "All" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMemberId() {
      try {
        const profile = await authApi.getProfile();
        if (!cancelled) {
          setMemberId(profile.data.id ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            (err as { message?: string }).message ?? "Failed to load member profile",
          );
          setLoading(false);
        }
      }
    }

    loadMemberId();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!memberId) return;

    const currentMemberId = memberId;
    let cancelled = false;

    async function loadVehicles() {
      setLoading(true);
      setError(null);

      try {
        const response = await memberVehiclesApi.getGarage({
          memberId: currentMemberId,
          filter: activeFilter,
        });

        if (!cancelled) {
          setVehicles(response.data.vehicles.map(mapGarageVehicle));
          setFilters(mapGarageFilters(response.data.tabs));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            (err as { message?: string }).message ?? "Failed to load vehicles",
          );
          setVehicles([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadVehicles();

    return () => {
      cancelled = true;
    };
  }, [memberId, activeFilter]);

  // Initial load — show full-page skeleton until the first response resolves.
  if (loading && vehicles.length === 0 && !error) {
    return <MemberGarageSkeleton />;
  }

  return (
    <div className="space-y-6 p-8">
      <MemberGarageHeader />

      {error ? (
        <p className="font-roboto rounded-xl border border-pink/20 bg-pink/5 px-4 py-3 text-[12px] text-pink">
          {error}
        </p>
      ) : null}

      <MemberGarageFilters
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {loading ? (
        <MemberGarageCardsSkeleton />
      ) : vehicles.length === 0 && !error ? (
        <p className="font-roboto text-[12px] text-secondary">No vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {vehicles.map((vehicle) => (
            <MemberGarageCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
