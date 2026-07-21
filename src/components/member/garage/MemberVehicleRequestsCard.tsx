"use client";

import { useState } from "react";
import {
  MemberGarageChevronRight,
  MemberVehicleDetailingIcon,
  MemberVehicleMaintenanceIcon,
  MemberVehicleSourcingIcon,
  MemberVehicleTransportIcon,
  NavParking,
} from "@/components/common/Svgs";
import { DetailingWashModal } from "./detailing-wash/DetailingWashModal";
import { MaintenanceServiceModal } from "./maintenance-service/MaintenanceServiceModal";
import { ParkingModal } from "./parking/ParkingModal";
import { TransportDeliveryModal } from "./transport-delivery/TransportDeliveryModal";
import { VehicleSourcingModal } from "./vehicle-sourcing/VehicleSourcingModal";
import type { MemberVehicleRecentRequest, MemberVehicleRequestItem } from "./types";

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

  if (icon === "parking") {
    return <NavParking className="size-[18px]" />;
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

function getStatusBadgeStyle(tone?: MemberVehicleRecentRequest["statusTone"]) {
  switch (tone) {
    case "completed":
      return "border-green-500/30 bg-green-500/10 text-green-400";
    case "in_progress":
      return "border-teal/30 bg-teal/10 text-teal";
    case "cancelled":
      return "border-pink/30 bg-pink/10 text-pink";
    case "pending":
    default:
      return "border-gold/30 bg-gold/10 text-gold";
  }
}

const REQUEST_TYPE_FALLBACK_TITLES: Record<string, string> = {
  transport: "Transport & Delivery",
  detailing: "Detailing & Wash",
  maintenance: "Maintenance & Service",
  parking: "Vehicle Parking",
  sourcing: "Vehicle Sourcing",
  garage_request: "Vehicle Request",
};

function formatDisplayTitle(item: MemberVehicleRecentRequest): string {
  if (
    !item.title ||
    /^TB\s*[-–]/i.test(item.title) ||
    /^REF\s*[-–]/i.test(item.title) ||
    /^MAINT\s*[-–]/i.test(item.title) ||
    /^TR\s*[-–]/i.test(item.title)
  ) {
    return REQUEST_TYPE_FALLBACK_TITLES[item.type] || "Vehicle Request";
  }
  return item.title;
}

function formatDisplaySubtitle(item: MemberVehicleRecentRequest): string {
  // If title was originally a reference number (like TB-2026-0721-155), make sure the ref number is shown in subtitle
  const originalWasRef = /^TB\s*[-–]/i.test(item.title) || /^REF\s*[-–]/i.test(item.title);
  
  if (originalWasRef && !item.subtitle?.includes(item.title)) {
    const datePart = item.dateLabel ? ` · ${item.dateLabel}` : "";
    return `${item.title}${datePart}`;
  }

  return item.subtitle || item.dateLabel || "";
}

function RecentRequestRow({ item }: { item: MemberVehicleRecentRequest }) {
  const badgeStyle = getStatusBadgeStyle(item.statusTone);
  const displayTitle = formatDisplayTitle(item);
  const displaySubtitle = formatDisplaySubtitle(item);

  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-accent/10 bg-surface/60 px-3.5 py-3 transition-colors hover:bg-surface">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/8">
          <RequestIcon icon={item.type === "garage_request" ? "transport" : item.type} />
        </span>
        <div className="min-w-0">
          <p className="font-roboto text-[12px] font-medium text-foreground truncate">
            {displayTitle}
          </p>
          <p className="font-roboto text-[10px] text-secondary truncate">
            {displaySubtitle}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className={`font-roboto rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${badgeStyle}`}>
          {item.status}
        </span>
      </div>
    </div>
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
  recentRequests?: MemberVehicleRecentRequest[];
  /** When true the card is hidden — used while a sourcing request is in review */
  hidden?: boolean;
  /** Callback fired after a request modal is submitted to refresh request data */
  onRequestCreated?: () => void;
};

export function MemberVehicleRequestsCard({
  vehicleId,
  vehicleName,
  vehicleMake,
  vehicleModel,
  vehicleYear,
  vehicleColour,
  requests,
  recentRequests = [],
  hidden = false,
  onRequestCreated,
}: MemberVehicleRequestsCardProps) {
  if (hidden) return null;
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const [isDetailingOpen, setIsDetailingOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isSourcingOpen, setIsSourcingOpen] = useState(false);
  const [isParkingOpen, setIsParkingOpen] = useState(false);

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
      return;
    }

    if (requestId === "parking") {
      setIsParkingOpen(true);
    }
  }

  const interactiveRequestIds = new Set<MemberVehicleRequestItem["id"]>([
    "transport",
    "detailing",
    "maintenance",
    "sourcing",
    "parking",
  ]);

  return (
    <div className="rounded-2xl border border-accent/10 bg-card p-4 sm:p-5">
      <h2 className="font-copperplate text-[14px] sm:text-[15px] uppercase">
        <span className="text-foreground">Vehicle </span>
        <span className="text-primary">Requests</span>
      </h2>

      <div className="mt-3 sm:mt-4 space-y-2.5">
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

      {/* Recent Requests List */}
      <div className="mt-5 pt-4 border-t border-accent/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-copperplate text-[12px] uppercase text-secondary tracking-wider">
            Recent <span className="text-primary">Requests</span>
          </h3>
          {recentRequests.length > 0 && (
            <span className="font-roboto text-[10px] font-medium text-secondary bg-accent/10 px-2 py-0.5 rounded-full">
              {recentRequests.length}
            </span>
          )}
        </div>

        {recentRequests.length > 0 ? (
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {recentRequests.map((item) => (
              <RecentRequestRow key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-accent/15 p-4 text-center">
            <p className="font-roboto text-[11px] text-secondary">
              No requests made for this vehicle yet.
            </p>
          </div>
        )}
      </div>

      <TransportDeliveryModal
        vehicleId={vehicleId}
        vehicleName={vehicleName}
        open={isTransportOpen}
        onClose={() => {
          setIsTransportOpen(false);
          onRequestCreated?.();
        }}
      />

      <DetailingWashModal
        vehicleId={vehicleId}
        vehicleName={vehicleName}
        open={isDetailingOpen}
        onClose={() => {
          setIsDetailingOpen(false);
          onRequestCreated?.();
        }}
      />

      <MaintenanceServiceModal
        vehicleId={vehicleId}
        open={isMaintenanceOpen}
        onClose={() => {
          setIsMaintenanceOpen(false);
          onRequestCreated?.();
        }}
      />

      <VehicleSourcingModal
        open={isSourcingOpen}
        onClose={() => {
          setIsSourcingOpen(false);
          onRequestCreated?.();
        }}
        vehicleMake={vehicleMake}
        vehicleModel={vehicleModel}
        vehicleYear={vehicleYear}
        vehicleColour={vehicleColour}
      />

      <ParkingModal
        vehicleId={vehicleId}
        vehicleName={vehicleName}
        open={isParkingOpen}
        onClose={() => {
          setIsParkingOpen(false);
          onRequestCreated?.();
        }}
      />
    </div>
  );
}
