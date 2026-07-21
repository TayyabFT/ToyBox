"use client";

import { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import { memberVehiclesApi } from "@/api/memberVehicles.api";
import { memberSourcingApi } from "@/api/memberSourcing.api";
import { memberParkingApi } from "@/api/memberParking.api";
import { authApi } from "@/api/auth.api";
import { mapMemberVehicleDetail } from "@/lib/garage";
import { MemberVehicleDetailSkeleton } from "./MemberGarageSkeleton";
import { MemberVehicleDetailHeader } from "./MemberVehicleDetailHeader";
import { MemberVehicleHeroCard } from "./MemberVehicleHeroCard";
import { MemberVehicleHealthCard } from "./MemberVehicleHealthCard";
import { MemberVehicleRequestsCard } from "./MemberVehicleRequestsCard";
import { MemberVehicleSpecsCard } from "./MemberVehicleSpecsCard";
import { MaintenanceServiceModal } from "./maintenance-service/MaintenanceServiceModal";
import { VehicleConfirmationModal } from "./VehicleConfirmationModal";
import type { MemberVehicleDetail, MemberVehicleRecentRequest } from "./types";

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
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [sourcingRequestId, setSourcingRequestId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const requestsRef = useRef<HTMLDivElement>(null);

  function handleBookServices() {
    setMaintenanceOpen(true);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadVehicle() {
      setLoading(true);
      setError(null);
      setNotFoundState(false);

      try {
        const response = await memberVehiclesApi.getById(vehicleId);

        if (!cancelled) {
          const mapped = mapMemberVehicleDetail(response.data);

          // Fetch parking sessions for this vehicle to merge with recent requests
          try {
            const parkingRes = await memberParkingApi.getSessions({ vehicleId });
            const sessionsData = (parkingRes as any)?.data;
            const sessions =
              Array.isArray(sessionsData)
                ? sessionsData
                : sessionsData?.sessions || sessionsData?.rows || sessionsData?.items || [];

            if (Array.isArray(sessions) && sessions.length > 0) {
              const parkingRequests: MemberVehicleRecentRequest[] = sessions.map((s: any) => {
                const slotLabel = s.slot?.label || s.slot?.slotCode || "Slot";
                const statusStr = String(s.status || "Pending");
                const statusLower = statusStr.toLowerCase();
                let statusTone: MemberVehicleRecentRequest["statusTone"] = "pending";
                if (statusLower.includes("complete")) statusTone = "completed";
                else if (statusLower.includes("cancel")) statusTone = "cancelled";
                else if (statusLower.includes("active") || statusLower.includes("accept")) statusTone = "in_progress";

                return {
                  id: `parking-${s.id || s.referenceNumber || Math.random()}`,
                  title: `Vehicle Parking — ${s.mode === "pickup" ? "Valet Pickup" : "Self Drop-Off"}`,
                  type: "parking" as const,
                  status: statusStr.charAt(0).toUpperCase() + statusStr.slice(1),
                  statusTone,
                  createdAt: s.createdAt || s.scheduledStartAt,
                  dateLabel: s.scheduledStartAt
                    ? new Date(s.scheduledStartAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "",
                  subtitle: `Slot ${slotLabel} ${s.referenceNumber ? `· Ref: ${s.referenceNumber}` : ""}`,
                  referenceNumber: s.referenceNumber,
                };
              });

              const existingIds = new Set((mapped.recentRequests || []).map((r) => r.id));
              const merged = [...(mapped.recentRequests || [])];
              for (const pr of parkingRequests) {
                if (!existingIds.has(pr.id) && !existingIds.has(pr.referenceNumber || "")) {
                  merged.push(pr);
                }
              }
              merged.sort((a, b) => {
                const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return timeB - timeA;
              });
              mapped.recentRequests = merged;
            }
          } catch {
            // Fallback: keep existing mapped recent requests
          }

          setVehicle(mapped);

          if (mapped.statusTone === "in_review") {
            // Use sourcingRequestId from the vehicle detail if the backend provided it
            if (mapped.sourcingRequestId) {
              setSourcingRequestId(mapped.sourcingRequestId);
              setConfirmationOpen(true);
            } else {
              // Fallback: look up the pending sourcing request for this member
              try {
                const profile = await authApi.getProfile();
                const memberId = profile.data.id;
                if (memberId && !cancelled) {
                  const sourcingRes = await memberSourcingApi.listRequests(memberId);
                  const requests = (sourcingRes as { data?: { requests?: Array<{ id: string; status?: string }> } }).data?.requests ?? [];
                  // Find the most recent active sourcing request (offer ready or searching)
                  const active = requests.find(
                    (r) =>
                      r.status === "Offer ready" ||
                      r.status === "Searching for vehicle" ||
                      r.status === "Request received" ||
                      r.status === "Vehicle found" ||
                      r.status === "Inspection in progress",
                  );
                  if (active && !cancelled) {
                    setSourcingRequestId(active.id);
                    setConfirmationOpen(true);
                  }
                }
              } catch {
                // Fallback failed silently — popup won't open but page still renders
              }
            }
          }
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
  }, [vehicleId, refreshTrigger]);

  if (!loading && notFoundState) {
    notFound();
  }

  if (loading) {
    return <MemberVehicleDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-5 sm:space-y-6 p-4 sm:p-6 lg:p-8">
        <MemberVehicleDetailHeader onBookServices={handleBookServices} />
        <p className="font-roboto text-sm text-pink">{error}</p>
      </div>
    );
  }

  if (!vehicle) {
    notFound();
  }

  const isInReview = vehicle.statusTone === "in_review";

  return (
    <div className="relative space-y-5 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      <MemberVehicleDetailHeader onBookServices={handleBookServices} />

      <div className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-2">
        <div className="space-y-5 sm:space-y-6">
          <MemberVehicleHeroCard vehicle={vehicle} />
          <div ref={requestsRef}>
            <MemberVehicleRequestsCard
              vehicleId={vehicleId}
              vehicleName={`${vehicle.make} ${vehicle.model}`.trim()}
              vehicleMake={vehicle.make}
              vehicleModel={vehicle.model}
              vehicleYear={vehicle.specs.year}
              vehicleColour={vehicle.ownership.colour}
              requests={vehicle.requests}
              recentRequests={vehicle.recentRequests}
              hidden={isInReview}
              onRequestCreated={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </div>
        </div>

        <div className="space-y-5 sm:space-y-6">
          <MemberVehicleSpecsCard specs={vehicle.specs} ownership={vehicle.ownership} />
          <MemberVehicleHealthCard
            health={vehicle.health}
            ctaLabel={vehicle.healthCtaLabel}
          />
        </div>
      </div>

      <MaintenanceServiceModal
        vehicleId={vehicleId}
        open={maintenanceOpen}
        onClose={() => setMaintenanceOpen(false)}
      />

      {isInReview && sourcingRequestId ? (
        <VehicleConfirmationModal
          open={confirmationOpen}
          sourcingRequestId={sourcingRequestId}
          onApproved={() => {
            setConfirmationOpen(false);
            // Reload vehicle data so status updates
            setLoading(true);
            memberVehiclesApi
              .getById(vehicleId)
              .then((res) => setVehicle(mapMemberVehicleDetail(res.data)))
              .catch(() => {})
              .finally(() => setLoading(false));
          }}
          onRejected={() => {
            setConfirmationOpen(false);
            setLoading(true);
            memberVehiclesApi
              .getById(vehicleId)
              .then((res) => setVehicle(mapMemberVehicleDetail(res.data)))
              .catch(() => {})
              .finally(() => setLoading(false));
          }}
        />
      ) : null}
    </div>
  );
}
