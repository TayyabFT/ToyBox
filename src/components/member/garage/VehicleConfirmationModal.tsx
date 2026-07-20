"use client";

import { useState } from "react";
import { memberSourcingApi } from "@/api/memberSourcing.api";
import {
  memberRequestModalBackdropClass,
  memberRequestModalPrimaryButtonClass,
  memberRequestModalPrimaryButtonFullClass,
  memberRequestModalSecondaryButtonClass,
} from "./shared/memberRequestModal";

// Scoped to the details page container (absolute, not fixed)
const confirmationOverlayClass =
  "absolute inset-0 z-50 flex items-start justify-center p-4";

type ConfirmationStep = "confirm" | "reject";

type VehicleConfirmationModalProps = {
  open: boolean;
  sourcingRequestId: string;
  onApproved: () => void;
  onRejected: () => void;
};

export function VehicleConfirmationModal({
  open,
  sourcingRequestId,
  onApproved,
  onRejected,
}: VehicleConfirmationModalProps) {
  const [step, setStep] = useState<ConfirmationStep>("confirm");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleBackToConfirm() {
    setStep("confirm");
    setError(null);
  }

  async function handleApprove() {
    setIsSubmitting(true);
    setError(null);

    try {
      await memberSourcingApi.approveVehicle(sourcingRequestId);
      onApproved();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "Failed to confirm vehicle. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRejectSubmit() {
    setIsSubmitting(true);
    setError(null);

    try {
      await memberSourcingApi.rejectVehicle(
        sourcingRequestId,
        rejectionReason.trim() || undefined,
      );
      onRejected();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "Failed to reject vehicle. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open) return null;

  // ── Confirm step ────────────────────────────────────────────────────────────

  if (step === "confirm") {
    return (
      <div className={confirmationOverlayClass}>
        <div className={memberRequestModalBackdropClass} />

        <div className="relative z-10 w-full max-w-[420px] rounded-[28px] border border-accent/20 bg-background p-6 shadow-[var(--shadow-modal)]">
          <p className="font-copperplate mb-5 text-[15px] tracking-[0.06em] text-foreground uppercase">
            Confirm the vehicle
          </p>

          {error ? (
            <p className="font-roboto mb-4 text-center text-[12px] text-pink">
              {error}
            </p>
          ) : null}

          <div className="flex gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleApprove}
              className={`${memberRequestModalPrimaryButtonClass} flex-1 uppercase`}
            >
              {isSubmitting ? "Confirming…" : "Yes"}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setError(null);
                setStep("reject");
              }}
              className={`${memberRequestModalSecondaryButtonClass} flex-1`}
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Reject step ─────────────────────────────────────────────────────────────

  return (
    <div className={confirmationOverlayClass}>
      <div className={memberRequestModalBackdropClass} />

      <div className="relative z-10 w-full max-w-[420px] rounded-[28px] border border-accent/20 bg-background p-6 shadow-[var(--shadow-modal)]">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleBackToConfirm}
            className="font-roboto flex items-center gap-1.5 rounded-full border border-accent/25 bg-surface px-4 py-2 text-[11px] font-semibold tracking-[0.06em] text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            Cancel
          </button>

          <p className="font-copperplate text-[15px] tracking-[0.06em] text-foreground uppercase">
            Reject vehicle
          </p>
        </div>

        {/* Prompt */}
        <p className="font-roboto mb-3 text-[13px] text-foreground/80">
          Tell us why you&apos;re rejecting this vehicle.
        </p>

        {/* Textarea */}
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="e.g. Colour does not match preference"
          rows={4}
          disabled={isSubmitting}
          className="font-roboto w-full resize-none rounded-2xl border border-accent/20 bg-surface px-4 py-3.5 text-[13px] text-foreground placeholder:text-secondary/50 focus:border-primary/40 focus:outline-none disabled:opacity-60"
        />

        {error ? (
          <p className="font-roboto mt-3 text-center text-[12px] text-pink">
            {error}
          </p>
        ) : null}

        {/* Submit */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleRejectSubmit}
          className={`${memberRequestModalPrimaryButtonFullClass} mt-4 uppercase`}
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </div>
  );
}
