"use client";

import type { MarketplaceVehicleItem } from "./types";

type MarketplaceDeleteVehicleModalProps = {
  open: boolean;
  vehicle: MarketplaceVehicleItem | null;
  submitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function MarketplaceDeleteVehicleModal({
  open,
  vehicle,
  submitting = false,
  onClose,
  onConfirm,
}: MarketplaceDeleteVehicleModalProps) {
  if (!open || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (submitting) return;
          onClose();
        }}
      />

      <div className="admin-modal-panel relative z-10 w-full max-w-[440px] overflow-hidden rounded-[28px] border border-accent/20 shadow-[var(--shadow-modal)]">
        <div className="border-b border-accent/10 px-6 py-5">
          <h2 className="font-copperplate text-[18px] tracking-[0.06em] text-foreground uppercase">
            Delete Vehicle
          </h2>
          <p className="font-roboto mt-1 text-[10px] tracking-[0.1em] text-secondary uppercase">
            This action cannot be undone
          </p>
        </div>

        <div className="space-y-3 px-6 py-5">
          <p className="font-roboto text-sm leading-relaxed text-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-accent">{vehicle.title}</span>{" "}
            from the marketplace?
          </p>
          {(vehicle.make || vehicle.model) && (
            <p className="font-roboto text-[11px] tracking-[0.06em] text-secondary uppercase">
              {[vehicle.make, vehicle.model, vehicle.year]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>

        <div className="flex gap-3 border-t border-accent/10 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="font-roboto flex flex-1 cursor-pointer items-center justify-center rounded-2xl border border-accent/25 bg-input-muted py-3 text-sm font-bold tracking-[0.08em] text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="font-roboto flex flex-1 cursor-pointer items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/15 py-3 text-sm font-bold tracking-[0.08em] text-red-400 uppercase transition-colors hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
