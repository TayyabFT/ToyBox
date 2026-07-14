"use client";

import { useEffect, useState } from "react";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { ParkingSlotStatusBadge } from "./ParkingSlotStatusBadge";
import type { ParkingSlotDetail } from "./types";

type ParkingSlotDetailPanelProps = {
  detail: ParkingSlotDetail | null;
  loading: boolean;
  deleting?: boolean;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
};

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
        {label}
      </p>
      <p className="font-roboto text-sm text-foreground">{value}</p>
    </div>
  );
}

export function ParkingSlotDetailPanel({
  detail,
  loading,
  deleting = false,
  onEdit,
  onDelete,
}: ParkingSlotDetailPanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
  }, [detail?.id]);
  if (loading) {
    return (
      <section
        className="overflow-hidden rounded-2xl border border-accent/12 bg-card"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-accent/10 px-5 py-4">
          <div className="space-y-2">
            <ShimmerBlock className="h-2.5 w-20" />
            <ShimmerBlock className="h-5 w-24" />
          </div>
          <ShimmerBlock className="h-6 w-20 rounded-full" />
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-accent/10 px-5 py-5 md:grid-cols-4">
          {Array.from({ length: 7 }, (_, index) => (
            <div key={index} className="space-y-1.5">
              <ShimmerBlock className="h-2.5 w-16" />
              <ShimmerBlock className="h-3.5 w-20" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!detail) {
    return (
      <section className="overflow-hidden rounded-2xl border border-accent/12 bg-card px-5 py-8 text-center">
        <p className="font-roboto text-sm text-secondary">
          Select a parking slot
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-accent/12 bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-accent/10 px-5 py-4">
        <div className="space-y-1">
          <p className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
            Slot Detail
          </p>
          <h3 className="font-copperplate text-[20px] uppercase text-foreground">
            {detail.slotCode}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ParkingSlotStatusBadge
            status={detail.status}
            label={detail.statusLabel}
          />
          {confirmDelete ? (
            <>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setConfirmDelete(false)}
                className="font-roboto cursor-pointer rounded-lg border border-accent/25 bg-transparent px-4 py-2 text-[10px] font-medium tracking-[0.1em] text-secondary uppercase transition-colors hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void onDelete()}
                className="font-roboto cursor-pointer rounded-lg border border-red-500/40 bg-red-950/20 px-4 py-2 text-[10px] font-medium tracking-[0.1em] text-red-400 uppercase transition-colors hover:border-red-500/60 hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="font-roboto cursor-pointer rounded-lg border border-accent/25 bg-transparent px-4 py-2 text-[10px] font-medium tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/40"
              >
                Edit Slot
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="font-roboto cursor-pointer rounded-lg border border-red-500/30 bg-transparent px-4 py-2 text-[10px] font-medium tracking-[0.1em] text-red-400 uppercase transition-colors hover:border-red-500/50 hover:bg-red-950/10"
              >
                Delete Slot
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-b border-accent/10 px-5 py-5 md:grid-cols-4">
        <InfoCell label="Label" value={detail.label} />
        <InfoCell label="Zone" value={detail.zone} />
        <InfoCell label="Level" value={detail.level} />
        <InfoCell label="Type" value={detail.slotTypeLabel} />
        <InfoCell label="Open Time" value={detail.openTime} />
        <InfoCell label="Close Time" value={detail.closeTime} />
        <InfoCell
          label="Active"
          value={detail.isActive ? "Yes" : "No"}
        />
      </div>

      {detail.notes ? (
        <div className="border-t border-accent/10 px-5 py-5 sm:px-6">
          <p className="font-roboto mb-2 text-[9px] tracking-[0.12em] text-secondary uppercase">
            Notes
          </p>
          <p className="font-roboto rounded-xl border border-accent/12 bg-[#11100C] px-4 py-3 text-sm leading-relaxed text-foreground">
            {detail.notes}
          </p>
        </div>
      ) : null}
    </section>
  );
}
