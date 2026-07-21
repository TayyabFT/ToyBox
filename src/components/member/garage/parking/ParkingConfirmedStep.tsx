"use client";

import { ConfirmedRow } from "../shared/requestFormUi";
import { formatParkingWindow } from "./parkingOptions";
import type { ParkingFormState, ParkingSlotResult, ParkingSubmitResult } from "./types";

type ParkingConfirmedStepProps = {
  vehicleName: string;
  form: ParkingFormState;
  selectedSlot: ParkingSlotResult;
  result: ParkingSubmitResult;
};

export function ParkingConfirmedStep({
  vehicleName,
  form,
  selectedSlot,
  result,
}: ParkingConfirmedStepProps) {
  return (
    <div className="space-y-6">
      {/* ── Success icon + heading ─────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-dark"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>

        <div>
          <h3 className="font-roboto text-[15px] font-semibold text-foreground">
            Parking request submitted
          </h3>
          <p className="font-roboto mt-0.5 text-[12px] text-secondary">
            {result.referenceNumber}
          </p>
        </div>
      </div>

      {/* ── Detail rows ───────────────────────────────────────────────── */}
      <div className="rounded-xl border border-accent/10 bg-input-muted px-4">
        <div className="divide-y divide-accent/8">
          <ConfirmedRow label="Vehicle" value={vehicleName} />
          <ConfirmedRow label="Slot" value={selectedSlot.slotCode} />
          <ConfirmedRow
            label="Details"
            value={`Level ${selectedSlot.level} · Zone ${selectedSlot.zone} · ${selectedSlot.slotTypeLabel}`}
          />
          <ConfirmedRow
            label="Window"
            value={formatParkingWindow(form.fromDate, form.fromTime, form.toDate, form.toTime)}
          />
          <ConfirmedRow
            label="Mode"
            value={form.mode === "pickup" ? "Pickup" : "Drop Off"}
          />
          <ConfirmedRow label="Status" value={resolveStatusLabel(result.status)} />
          <ConfirmedRow label="Reference" value={result.referenceNumber} />
        </div>
      </div>
    </div>
  );
}

function resolveStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    accepted: "Accepted",
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status?.toLowerCase()] ?? status ?? "Pending";
}
