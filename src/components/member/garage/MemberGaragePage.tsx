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
import { AddVehicleModal } from "@/components/staff/vehicles/add-vehicle";
import { API_ENDPOINTS } from "@/api/endpoints";

function GarageEmptyState({ filter }: { filter: GarageFilterKey }) {
  const isFiltered = filter !== "all";

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-accent/10 bg-card px-4 sm:px-6 py-12 sm:py-16 text-center">
      {/* Car icon */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-accent/15 bg-elevated">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M6 20H7.5L9.5 14H22.5L24.5 20H26"
            stroke="var(--accent)"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 20H26V23C26 23.55 25.55 24 25 24H7C6.45 24 6 23.55 6 23V20Z"
            stroke="var(--accent)"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="23.5" r="1.5" fill="var(--accent)" />
          <circle cx="22" cy="23.5" r="1.5" fill="var(--accent)" />
          <path
            d="M9.5 14L11.5 10H20.5L22.5 14"
            stroke="var(--accent)"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="font-copperplate mb-2 text-[15px] tracking-[0.12em] text-foreground-soft uppercase">
        {isFiltered ? "No vehicles in this category" : "Your garage is empty"}
      </p>
      <p className="font-roboto max-w-[260px] text-[11px] leading-relaxed text-secondary">
        {isFiltered
          ? "No vehicles match the selected filter. Try switching to a different category."
          : "Your collection will appear here once vehicles have been added to your account."}
      </p>
    </div>
  );
}

export function MemberGaragePage() {
  const [memberId, setMemberId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<GarageFilterKey>("all");
  const [vehicles, setVehicles] = useState<GarageVehicle[]>([]);
  const [filters, setFilters] = useState<GarageFilter[]>([
    { key: "all", label: "All" },
  ]);
  const [loading, setLoading] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
          garageStatus: activeFilter,
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
          setInitialLoaded(true);
        }
      }
    }

    loadVehicles();

    return () => {
      cancelled = true;
    };
  }, [memberId, activeFilter, refreshTrigger]);

  // Initial load only — show full-page skeleton until the very first response resolves.
  if (!initialLoaded && loading && !error) {
    return <MemberGarageSkeleton />;
  }

  return (
    <div className="space-y-5 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      <MemberGarageHeader onAddVehicleClick={() => setAddVehicleOpen(true)} />

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
        <GarageEmptyState filter={activeFilter} />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {vehicles.map((vehicle) => (
            <MemberGarageCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}

      <AddVehicleModal
        open={addVehicleOpen}
        onClose={() => setAddVehicleOpen(false)}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        apiUrl={API_ENDPOINTS.memberVehicles.list}
      />
    </div>
  );
}
