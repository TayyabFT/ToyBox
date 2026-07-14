"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { memberVehiclesApi } from "@/api/memberVehicles.api";
import { mapMemberVehicleDetail } from "@/lib/garage";
import { MemberVehicleDetailHeader } from "./MemberVehicleDetailHeader";
import { MemberVehicleHeroCard } from "./MemberVehicleHeroCard";
import { MemberVehicleHealthCard } from "./MemberVehicleHealthCard";
import { MemberVehicleRequestsCard } from "./MemberVehicleRequestsCard";
import { MemberVehicleSpecsCard } from "./MemberVehicleSpecsCard";
import type { MemberVehicleDetail } from "./types";

type MemberVehicleDetailPageProps = {
  vehicleId: string;
};

export function MemberVehicleDetailPage({
  vehicleId,
}: MemberVehicleDetailPageProps) {
  const [vehicle, setVehicle] = useState<MemberVehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVehicle() {
      setLoading(true);
      setError(null);
      setNotFoundState(false);

      try {
        const response = await memberVehiclesApi.getById(vehicleId);

        if (!cancelled) {
          setVehicle(mapMemberVehicleDetail(response.data));
        }
      } catch (err) {
        if (!cancelled) {
          const status = (err as { status?: number }).status;

          if (status === 404) {
            setNotFoundState(true);
            setVehicle(null);
            return;
          }

          setError(
            (err as { message?: string }).message ?? "Failed to load vehicle details",
          );
          setVehicle(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadVehicle();

    return () => {
      cancelled = true;
    };
  }, [vehicleId]);

  if (!loading && notFoundState) {
    notFound();
  }

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <MemberVehicleDetailHeader />
        <p className="font-roboto text-sm text-secondary">Loading vehicle details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-8">
        <MemberVehicleDetailHeader />
        <p className="font-roboto text-sm text-pink">{error}</p>
      </div>
    );
  }

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="space-y-6 p-8">
      <MemberVehicleDetailHeader />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <MemberVehicleHeroCard vehicle={vehicle} />
          <MemberVehicleRequestsCard
            vehicleId={vehicleId}
            vehicleName={`${vehicle.make} ${vehicle.model}`.trim()}
            vehicleMake={vehicle.make}
            vehicleModel={vehicle.model}
            vehicleYear={vehicle.specs.year}
            vehicleColour={vehicle.ownership.colour}
            requests={vehicle.requests}
          />
        </div>

        <div className="space-y-6">
          <MemberVehicleSpecsCard specs={vehicle.specs} ownership={vehicle.ownership} />
          <MemberVehicleHealthCard
            health={vehicle.health}
            ctaLabel={vehicle.healthCtaLabel}
          />
        </div>
      </div>
    </div>
  );
}
