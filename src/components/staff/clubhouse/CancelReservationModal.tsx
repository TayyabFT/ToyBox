"use client";

import { useEffect, useState } from "react";

type CancelReservationModalProps = {
  open: boolean;
  memberName?: string;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void | Promise<void>;
};

const fieldBorder = "border-accent/18";
const fieldClass =
  "font-roboto w-full rounded-xl border border-accent/18 bg-input-muted px-4 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-accent/60 disabled:cursor-not-allowed disabled:opacity-60";

export function CancelReservationModal({
  open,
  memberName,
  submitting = false,
  onClose,
  onSubmit,
}: CancelReservationModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setReason("");
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative z-10 w-full max-w-[480px] overflow-hidden rounded-[28px] border ${fieldBorder} bg-card shadow-[var(--shadow-modal)]`}
      >
        <div className={`border-b ${fieldBorder} px-6 pb-5 pt-6`}>
          <p className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
            Reservation
          </p>
          <h2 className="mt-2 font-copperplate text-[22px] uppercase text-foreground">
            Cancel Reservation
          </h2>
          {memberName ? (
            <p className="mt-2 font-roboto text-sm text-secondary">{memberName}</p>
          ) : null}
        </div>

        <div className="space-y-2 px-6 py-5">
          <label className="font-roboto block text-[10px] tracking-[0.12em] text-secondary uppercase">
            Reason
          </label>
          <textarea
            value={reason}
            disabled={submitting}
            rows={4}
            placeholder="Member requested cancellation"
            onChange={(event) => setReason(event.target.value)}
            className={`${fieldClass} resize-none`}
          />
        </div>

        <div
          className={`flex justify-end gap-3 border-t ${fieldBorder} px-6 py-5`}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className={`font-roboto cursor-pointer rounded-xl border ${fieldBorder} bg-input-muted px-5 py-3 text-[11px] font-semibold tracking-[0.12em] text-foreground uppercase transition-colors hover:border-accent/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60`}
          >
            Keep Reservation
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => void onSubmit(reason.trim())}
            className="font-roboto cursor-pointer rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-[11px] font-semibold tracking-[0.12em] text-red-500 uppercase transition-colors hover:border-red-500/60 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Cancelling..." : "Cancel Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
}
