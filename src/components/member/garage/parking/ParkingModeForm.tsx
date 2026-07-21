"use client";

import { RequestFieldLabel, RequestRadioDot, ReviewRow } from "../shared/requestFormUi";
import { formatParkingWindow } from "./parkingOptions";
import type { ParkingFormState, ParkingReviewFormState, ParkingSlotResult } from "./types";

type ParkingModeFormProps = {
  vehicleName: string;
  form: ParkingFormState;
  selectedSlot: ParkingSlotResult;
  onChange: (patch: Partial<ParkingReviewFormState>) => void;
};

export function ParkingModeForm({
  vehicleName,
  form,
  selectedSlot,
  onChange,
}: ParkingModeFormProps) {
  return (
    <div className="space-y-5">
      {/* ── Summary table (collapsed) ─────────────────────────────────── */}
      <div className="rounded-xl border border-accent/10 bg-input-muted px-4">
        <ReviewRow label="Details">
          <span className="font-roboto text-[11px] font-medium text-secondary">
            Level {selectedSlot.level} · Zone {selectedSlot.zone} · {selectedSlot.slotTypeLabel}
          </span>
        </ReviewRow>

        <ReviewRow label="Window">
          <span className="font-roboto text-[11px] font-medium text-secondary">
            {formatParkingWindow(form.fromDate, form.fromTime, form.toDate, form.toTime)}
          </span>
        </ReviewRow>

        <ReviewRow label="Mode">
          <span className="font-roboto text-[11px] font-medium text-foreground">
            {form.mode === "pickup" ? "Pickup" : "Drop Off"}
          </span>
        </ReviewRow>

        {form.mode === "pickup" ? (
          <ReviewRow label="Pickup address">
            <span className="font-roboto text-[11px] text-secondary">
              {form.pickupAddress || "—"}
            </span>
          </ReviewRow>
        ) : null}
      </div>

      {/* ── Mode selector ─────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <RequestFieldLabel>Mode</RequestFieldLabel>

        <div className="space-y-2.5">
          <ModeButton
            selected={form.mode === "drop_self"}
            title="Drop Off"
            subtitle="Bring the vehicle yourself"
            onClick={() => onChange({ mode: "drop_self" })}
          />
          <ModeButton
            selected={form.mode === "pickup"}
            title="Pickup"
            subtitle="Concierge collects the vehicle"
            onClick={() => onChange({ mode: "pickup" })}
          />
        </div>
      </div>

      {/* ── Pickup address (shown when pickup mode is selected) ────────── */}
      {form.mode === "pickup" ? (
        <>
          <div className="space-y-2.5">
            <RequestFieldLabel>Pickup Address</RequestFieldLabel>
            <input
              type="text"
              value={form.pickupAddress}
              onChange={(e) => onChange({ pickupAddress: e.target.value })}
              placeholder="Enter pickup address"
              className="font-roboto w-full rounded-xl border border-accent/10 bg-input-muted px-4 py-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-secondary/50 focus:border-primary/40"
            />
          </div>

          <div className="space-y-2.5">
            <RequestFieldLabel>Pickup Notes</RequestFieldLabel>
            <textarea
              value={form.pickupNotes}
              onChange={(e) => onChange({ pickupNotes: e.target.value })}
              rows={3}
              placeholder="Call on arrival…"
              className="font-roboto w-full resize-none rounded-xl border border-accent/10 bg-input-muted px-4 py-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-secondary/50 focus:border-primary/40"
            />
          </div>
        </>
      ) : null}
    </div>
  );
}

// ── Interactive mode button ───────────────────────────────────────────────

function ModeButton({
  selected,
  title,
  subtitle,
  onClick,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
        selected
          ? "border-primary/60 bg-primary/6"
          : "border-accent/10 bg-input-muted hover:border-accent/25"
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
    </button>
  );
}
