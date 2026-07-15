"use client";

import { useState } from "react";
import { MemberGarageChevronRight } from "@/components/common/Svgs";
import { VehicleDocumentsModal } from "./VehicleDocumentsModal";
import type { GarageVehicleStatusTone, MemberVehicleDetail } from "./types";

const statusToneClass: Record<GarageVehicleStatusTone, string> = {
  ready: "border-teal/30 bg-teal/10 text-teal",
  in_service: "border-pink/30 bg-pink/10 text-pink",
  away: "border-accent/25 bg-accent/8 text-secondary",
  stored: "border-accent/20 bg-accent/6 text-foreground-soft",
  in_review: "border-info/30 bg-info/10 text-info",
};

type MemberVehicleHeroCardProps = {
  vehicle: MemberVehicleDetail;
};

export function MemberVehicleHeroCard({ vehicle }: MemberVehicleHeroCardProps) {
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-accent/10 bg-card">
        <div className="relative h-[240px] w-full">
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
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
            <span
              className={`font-roboto absolute left-3 top-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] uppercase ${statusToneClass[vehicle.statusTone]}`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {vehicle.statusLabel}
            </span>
          )}

          {vehicle.bayLabel && (
            <span className="font-roboto absolute right-3 top-3 rounded-full border border-foreground/20 bg-background/60 px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] text-foreground/85 uppercase backdrop-blur-sm">
              {vehicle.bayLabel}
            </span>
          )}
        </div>

        <div className="space-y-4 p-5">
          <div className="space-y-1">
            <h2 className="font-copperplate text-[18px] leading-tight uppercase">
              <span className="text-foreground">{vehicle.make} </span>
              <span className="text-primary">{vehicle.model}</span>
            </h2>
            <p className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
              {vehicle.detail}
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-4 gap-2 rounded-lg bg-accent/10 p-4">
            {vehicle.stats.map((stat) => (
              <div key={stat.label} className="min-w-0 overflow-hidden text-center">
                <p
                  className="font-copperplate truncate text-[18px] leading-tight tabular-nums text-foreground"
                  title={stat.value}
                >
                  {stat.value}
                </p>
                <p className="font-roboto mt-1.5 truncate text-[9px] tracking-[0.12em] text-secondary uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-end justify-between gap-3 border-t border-accent/10 pt-4">
            <div className="space-y-0.5">
              <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary/70 uppercase">
                {vehicle.lastInspectedLabel}
              </p>
              <p className="font-roboto text-[11px] text-foreground/80">
                {vehicle.lastInspectedValue}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsDocumentsOpen(true)}
              className="font-roboto flex shrink-0 items-center gap-1 rounded-full border border-accent/25 bg-accent/8 px-4 py-2 text-[9px] font-semibold tracking-[0.14em] text-primary uppercase transition-colors hover:border-primary/40 hover:bg-accent/8"
            >
              View Document
              <MemberGarageChevronRight className="size-[10px]" color="currentColor" />
            </button>
          </div>
        </div>
      </div>

      <VehicleDocumentsModal
        open={isDocumentsOpen}
        onClose={() => setIsDocumentsOpen(false)}
        documents={vehicle.documents}
      />
    </>
  );
}
