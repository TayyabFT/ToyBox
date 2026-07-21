"use client";

import { RequestFieldLabel, RequestRadioDot, ReviewRow } from "../shared/requestFormUi";
import { formatParkingWindow } from "./parkingOptions";
import type { ParkingFormState, ParkingSlotResult } from "./types";

type ParkingReviewStepProps = {
  vehicleName: string;
  form: ParkingFormState;
  selectedSlot: ParkingSlotResult;
};

export function ParkingReviewStep({
  vehicleName,
  form,
  selectedSlot,
}: ParkingReviewStepProps) {
  return (
    <div className="space-y-5">
      {/* ── Summary table ─────────────────────────────────────────────── */}
      <div className="rounded-xl border border-accent/10 bg-input-muted px-4">
        <ReviewRow label="Vehicle">
          <span className="font-roboto text-[12px] font-medium text-foreground">
            {vehicleName}
          </span>
        </ReviewRow>

        <ReviewRow label="Slot">
          <span className="font-roboto text-[12px] font-medium text-foreground">
            {selectedSlot.slotCode}
          </span>
        </ReviewRow>

        <ReviewRow label="Details">
          <span className="font-roboto text-[12px] font-medium text-foreground">
            Level {selectedSlot.level} · Zone {selectedSlot.zone} · {selectedSlot.slotTypeLabel}
          </span>
        </ReviewRow>

        <ReviewRow label="Window">
          <span className="font-roboto text-[12px] font-medium text-foreground">
            {formatParkingWindow(form.fromDate, form.fromTime, form.toDate, form.toTime)}
          </span>
        </ReviewRow>

        <ReviewRow label="Mode">
          <span className="font-roboto text-[12px] font-medium text-foreground">
            {form.mode === "pickup" ? "Pickup" : "Drop Off"}
          </span>
        </ReviewRow>
      </div>

      {/* ── Mode selector ─────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <RequestFieldLabel>Mode</RequestFieldLabel>

        <div className="space-y-2.5">
          {/* Drop Off */}
          <ModeRow
            selected={form.mode === "drop_self"}
            title="Drop Off"
            subtitle="Bring the vehicle yourself"
            // mode value is driven from parent via prop — we only display here
          />

          {/* Pickup */}
          <ModeRow
            selected={form.mode === "pickup"}
            title="Pickup"
            subtitle="Concierge collects the vehicle"
          />
        </div>
      </div>

      {/* ── Pickup address (review-only, shown when pickup is selected) ── */}
      {form.mode === "pickup" && form.pickupAddress ? (
        <div className="space-y-2.5">
          <RequestFieldLabel>Pickup Address</RequestFieldLabel>
          <p className="font-roboto rounded-xl border border-accent/10 bg-input-muted px-4 py-3 text-[13px] text-foreground">
            {form.pickupAddress}
          </p>
        </div>
      ) : null}
    </div>
  );
}

// ── Read-only mode row (display only in review step) ─────────────────────

function ModeRow({
  selected,
  title,
  subtitle,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
        selected ? "border-primary/60 bg-primary/6" : "border-accent/10 bg-input-muted"
      }`}
    >
      <RequestRadioDot selected={selected} />
      <div className="min-w-0 flex-1">
        <p
          className={`font-roboto text-[13px] font-semibold ${
            selected ? "text-foreground" : "text-secondary"
          }`}
        >
          {title}
        </p>
        <p className="font-roboto text-[11px] text-secondary">{subtitle}</p>
      </div>
    </div>
  );
}
