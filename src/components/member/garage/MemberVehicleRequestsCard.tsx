"use client";

import { useState } from "react";
import {
  MemberGarageChevronRight,
  MemberVehicleDetailingIcon,
  MemberVehicleMaintenanceIcon,
  MemberVehicleSourcingIcon,
  MemberVehicleTransportIcon,
} from "@/components/common/Svgs";
import { DetailingWashModal } from "./detailing-wash/DetailingWashModal";
import { MaintenanceServiceModal } from "./maintenance-service/MaintenanceServiceModal";
import { TransportDeliveryModal } from "./transport-delivery/TransportDeliveryModal";
import { VehicleSourcingModal } from "./vehicle-sourcing/VehicleSourcingModal";
import type { MemberVehicleRequestItem } from "./types";

function RequestIcon({ icon }: { icon: MemberVehicleRequestItem["icon"] }) {
  const iconClass = icon === "sourcing" ? "size-5" : "size-[18px]";

  if (icon === "transport") {
    return (
      <span className="relative flex size-[18px] items-center justify-center">
        <MemberVehicleTransportIcon
          className={`${iconClass} transition-opacity group-hover:opacity-0`}
        />
        <MemberVehicleTransportIcon
          className={`${iconClass} absolute opacity-0 transition-opacity group-hover:opacity-100`}
          highlighted
        />
      </span>
    );
  }

  if (icon === "detailing") {
    return <MemberVehicleDetailingIcon className={iconClass} />;
  }

  if (icon === "maintenance") {
    return <MemberVehicleMaintenanceIcon className={iconClass} />;
  }

  return <MemberVehicleSourcingIcon className={iconClass} />;
}

function RequestRowContent({ request }: { request: MemberVehicleRequestItem }) {
  return (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/8 transition-colors group-hover:bg-primary/15">
        <RequestIcon icon={request.icon} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-roboto text-[13px] font-medium text-foreground">
          {request.title}
        </p>
        <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
          {request.subtitle}
        </p>
      </div>

      <span className="hidden size-7 shrink-0 items-center justify-center rounded-full bg-primary text-dark group-hover:flex">
        <MemberGarageChevronRight className="size-[11px]" />
      </span>
    </>
  );
}

type MemberVehicleRequestsCardProps = {
  vehicleId: string;
  vehicleName: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleColour?: string;
  requests: MemberVehicleRequestItem[];
};

export function MemberVehicleRequestsCard({
  vehicleId,
  vehicleName,
  vehicleMake,
  vehicleModel,
  vehicleYear,
  vehicleColour,
  requests,
}: MemberVehicleRequestsCardProps) {
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const [isDetailingOpen, setIsDetailingOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isSourcingOpen, setIsSourcingOpen] = useState(false);

  const rowClassName =
    "group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-surface px-4 py-3.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/6";

  function handleRequestClick(requestId: MemberVehicleRequestItem["id"]) {
    if (requestId === "transport") {
      setIsTransportOpen(true);
      return;
    }

    if (requestId === "detailing") {
      setIsDetailingOpen(true);
      return;
    }

    if (requestId === "maintenance") {
      setIsMaintenanceOpen(true);
      return;
    }

    if (requestId === "sourcing") {
      setIsSourcingOpen(true);
    }
  }

  const interactiveRequestIds = new Set<MemberVehicleRequestItem["id"]>([
    "transport",
    "detailing",
    "maintenance",
    "sourcing",
  ]);

  return (
    <div className="rounded-2xl border border-accent/10 bg-card p-5">
      <h2 className="font-copperplate text-[15px] uppercase">
        <span className="text-foreground">Vehicle </span>
        <span className="text-primary">Requests</span>
      </h2>

      <div className="mt-4 space-y-2.5">
        {requests.map((request) =>
          interactiveRequestIds.has(request.id) ? (
            <button
              key={request.id}
              type="button"
              onClick={() => handleRequestClick(request.id)}
              className={rowClassName}
            >
              <RequestRowContent request={request} />
            </button>
          ) : (
            <div key={request.id} className={rowClassName}>
              <RequestRowContent request={request} />
            </div>
          ),
        )}
      </div>

      <TransportDeliveryModal
        vehicleId={vehicleId}
        vehicleName={vehicleName}
        open={isTransportOpen}
        onClose={() => setIsTransportOpen(false)}
      />

      <DetailingWashModal
        vehicleId={vehicleId}
        vehicleName={vehicleName}
        open={isDetailingOpen}
        onClose={() => setIsDetailingOpen(false)}
      />

      <MaintenanceServiceModal
        vehicleId={vehicleId}
        open={isMaintenanceOpen}
        onClose={() => setIsMaintenanceOpen(false)}
      />

      <VehicleSourcingModal
        open={isSourcingOpen}
        onClose={() => setIsSourcingOpen(false)}
        vehicleMake={vehicleMake}
        vehicleModel={vehicleModel}
        vehicleYear={vehicleYear}
        vehicleColour={vehicleColour}
      />
    </div>
  );
}
