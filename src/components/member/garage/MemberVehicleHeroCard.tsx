"use client";

import { useState } from "react";
import { MemberGarageChevronRight } from "@/components/common/Svgs";
import { VehicleDocumentsModal } from "./VehicleDocumentsModal";
import { resolveAssetUrl } from "@/lib/resolveAssetUrl";
import type { GarageVehicleStatusTone, MemberVehicleDetail } from "./types";
import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";

const STATUS_TO_TONE: Record<GarageVehicleStatusTone, ChipTone> = {
  ready:      "teal",
  in_service: "pink",
  away:       "gold",
  stored:     "gold",
  in_review:  "info",
};

type MemberVehicleHeroCardProps = {
  vehicle: MemberVehicleDetail;
  onDocumentUploaded?: () => void;
};

export function MemberVehicleHeroCard({ vehicle, onDocumentUploaded }: MemberVehicleHeroCardProps) {
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-accent/10 bg-card">
        <div className="relative h-[200px] sm:h-[240px] w-full">
          {vehicle.imageUrl ? (
            <img
              src={resolveAssetUrl(vehicle.imageUrl)}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-accent/6">
              <span className="font-copperplate text-[13px] tracking-[0.12em] text-secondary/40 uppercase">
                {vehicle.make} {vehicle.model}
              </span>
            </div>
          )}

          {vehicle.statusLabel && (
            <Chip
              label={vehicle.statusLabel}
              context="overlay"
              tone={STATUS_TO_TONE[vehicle.statusTone]}
              shape="pill"
              showDot
              className="absolute left-3 top-3"
            />
          )}

          {vehicle.bayLabel && (
            <Chip
              label={vehicle.bayLabel}
              context="overlay"
              tone="ghost"
              shape="pill"
              className="absolute right-3 top-3"
            />
          )}
        </div>

        <div className="space-y-3 sm:space-y-4 p-4 sm:p-5">
          <div className="space-y-1">
            <h2 className="font-copperplate text-[16px] sm:text-[18px] leading-tight uppercase">
              <span className="text-foreground">{vehicle.make} </span>
              <span className="text-primary">{vehicle.model}</span>
            </h2>
            <p className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
              {vehicle.detail}
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-4 gap-1.5 sm:gap-2 rounded-lg bg-accent/10 p-3 sm:p-4">
            {vehicle.stats.map((stat) => (
              <div key={stat.label} className="min-w-0 overflow-hidden text-center">
                <p
                  className="font-copperplate truncate text-[15px] sm:text-[18px] leading-tight tabular-nums text-foreground"
                  title={stat.value}
                >
                  {stat.value}
                </p>
                <p className="font-roboto mt-1 sm:mt-1.5 truncate text-[8px] sm:text-[9px] tracking-[0.12em] text-secondary uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-end justify-between gap-3 border-t border-accent/10 pt-3 sm:pt-4">
            <div className="space-y-0.5">
              <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary/70 uppercase">
                {vehicle.lastInspectedLabel}
              </p>
              <p className="font-roboto text-[11px] text-foreground/80">
                {vehicle.lastInspectedValue}
              </p>
            </div>

            {vehicle.statusTone !== "in_review" && (
              <button
                type="button"
                onClick={() => setIsDocumentsOpen(true)}
                className="font-roboto flex shrink-0 items-center gap-1 rounded-full border border-accent/25 bg-accent/8 px-3 sm:px-4 py-2 text-[9px] font-semibold tracking-[0.14em] text-primary uppercase transition-colors hover:border-primary/40 hover:bg-accent/8 cursor-pointer"
              >
                View Document
                <MemberGarageChevronRight className="size-[10px]" color="currentColor" />
              </button>
            )}
          </div>
        </div>
      </div>

      <VehicleDocumentsModal
        open={isDocumentsOpen}
        vehicleId={vehicle.id}
        onClose={() => setIsDocumentsOpen(false)}
        documents={vehicle.documents}
        onUploaded={() => {
          onDocumentUploaded?.();
        }}
      />
    </>
  );
}
