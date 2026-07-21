"use client";

import { useEffect, useState } from "react";
import { staffParkingApi } from "@/api/staffParking.api";
import { showError, showSuccess } from "@/lib/toast";
import {
  PARKING_SESSION_ACTION_LABELS,
  type ParkingSessionAction,
  type ParkingSessionDetail,
} from "./types";

type ParkingSessionActionModalProps = {
  open: boolean;
  action: ParkingSessionAction | null;
  session: ParkingSessionDetail | null;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
};

const fieldBorder = "border-accent/25";
const fieldClass = `font-roboto w-full rounded-xl border ${fieldBorder} bg-card px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-secondary focus:border-accent/60 disabled:cursor-not-allowed disabled:opacity-60`;

function FieldLabel({ children }: { children: string }) {
  return (
    <label className="font-roboto block text-[10px] tracking-[0.12em] text-section-label uppercase">
      {children}
    </label>
  );
}

export function ParkingSessionActionModal({
  open,
  action,
  session,
  onClose,
  onSuccess,
}: ParkingSessionActionModalProps) {
  const [staffNotes, setStaffNotes] = useState("");
  const [notifyMember, setNotifyMember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !action || !session) {
      return;
    }

    setStaffNotes("");
    setNotifyMember(true);
    setSubmitting(false);
  }, [action, open, session]);

  function handleClose() {
    if (submitting) {
      return;
    }

    onClose();
  }

  async function handleSubmit() {
    if (!action || !session) {
      return;
    }

    setSubmitting(true);

    try {
      const trimmedNotes = staffNotes.trim();

      if (action === "accept") {
        await staffParkingApi.acceptSession(session.id, {
          staffNotes: trimmedNotes || undefined,
        });
      } else if (action === "start") {
        await staffParkingApi.startSession(session.id, {
          staffNotes: trimmedNotes || undefined,
          notifyMember,
        });
      } else {
        await staffParkingApi.completeSession(session.id, {
          staffNotes: trimmedNotes || undefined,
          notifyMember,
        });
      }

      showSuccess(PARKING_SESSION_ACTION_LABELS[action].success);
      onClose();
      await onSuccess?.();
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to update parking session";

      showError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open || !action || !session) {
    return null;
  }

  const actionCopy = PARKING_SESSION_ACTION_LABELS[action];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`admin-modal-panel relative z-10 flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[28px] border ${fieldBorder} shadow-[var(--shadow-modal)]`}
      >
        <div className={`shrink-0 border-b ${fieldBorder} px-6 pb-5 pt-6`}>
          <p className="font-roboto text-[10px] tracking-[0.14em] text-section-label uppercase">
            Parking Session
          </p>
          <h2 className="mt-2 font-copperplate text-[22px] uppercase text-accent">
            {actionCopy.title}
          </h2>
          <p className="mt-2 font-roboto text-sm text-secondary">
            {session.vehicleName} · Bay {session.slotCode}
          </p>
        </div>

        <div className="Custom__Scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div className="space-y-2">
            <FieldLabel>Staff Notes</FieldLabel>
            <textarea
              value={staffNotes}
              disabled={submitting}
              rows={4}
              placeholder={
                action === "accept"
                  ? "Bay confirmed free"
                  : action === "start"
                    ? "Vehicle arrived at bay"
                    : "Vehicle ready at bay"
              }
              onChange={(event) => setStaffNotes(event.target.value)}
              className={`${fieldClass} resize-none`}
            />
          </div>

          {action !== "accept" ? (
            <label
              className={`font-roboto flex cursor-pointer items-center gap-3 rounded-xl border ${fieldBorder} bg-card px-4 py-3.5`}
            >
              <input
                type="checkbox"
                checked={notifyMember}
                disabled={submitting}
                onChange={(event) => setNotifyMember(event.target.checked)}
                className="size-4 cursor-pointer accent-[var(--accent)]"
              />
              <span className="text-sm text-foreground">Notify member</span>
            </label>
          ) : null}
        </div>

        <div
          className={`flex shrink-0 justify-end gap-3 border-t ${fieldBorder} px-6 py-5`}
        >
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className={`font-roboto cursor-pointer rounded-xl border ${fieldBorder} bg-card px-5 py-3 text-[11px] font-semibold tracking-[0.12em] text-foreground uppercase transition-colors hover:border-accent/50 hover:text-accent disabled:cursor-not-allowed disabled:opacity-60`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting}
            className="admin-gold-cta font-roboto cursor-pointer rounded-xl px-5 py-3 text-[11px] font-bold tracking-[0.12em] uppercase disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Processing..." : actionCopy.submit}
          </button>
        </div>
      </div>
    </div>
  );
}
