"use client";

import { useEffect, useState } from "react";
import type {
  StaffClubhouseReservationEditableStatus,
  StaffClubhouseReservationUpdateRequest,
} from "@/types/api";
import type { ClubhouseReservation } from "./types";

type EditReservationModalProps = {
  open: boolean;
  reservation: ClubhouseReservation | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (body: StaffClubhouseReservationUpdateRequest) => void | Promise<void>;
};

const fieldBorder = "border-accent/18";
const fieldClass =
  "font-roboto w-full rounded-xl border border-accent/18 bg-input-muted px-4 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-accent/60 disabled:cursor-not-allowed disabled:opacity-60";

function resolveEditableStatus(
  status: ClubhouseReservation["status"],
): StaffClubhouseReservationEditableStatus | undefined {
  if (status === "confirmed" || status === "prep") {
    return status;
  }

  return undefined;
}

function buildUpdatePayload(
  form: StaffClubhouseReservationUpdateRequest,
): StaffClubhouseReservationUpdateRequest {
  const payload: StaffClubhouseReservationUpdateRequest = {
    guests: form.guests,
    date: form.date,
    occasion: form.occasion?.trim() || undefined,
    specialRequests: form.specialRequests?.trim() || undefined,
    arrivalNote: form.arrivalNote?.trim() || undefined,
    timeSlot: form.timeSlot?.trim() || undefined,
  };

  if (form.status === "confirmed" || form.status === "prep") {
    payload.status = form.status;
  }

  return payload;
}

function FieldLabel({ children }: { children: string }) {
  return (
    <label className="font-roboto block text-[10px] tracking-[0.12em] text-secondary uppercase">
      {children}
    </label>
  );
}

export function EditReservationModal({
  open,
  reservation,
  submitting = false,
  onClose,
  onSubmit,
}: EditReservationModalProps) {
  const [form, setForm] = useState<StaffClubhouseReservationUpdateRequest>({});

  useEffect(() => {
    if (!open || !reservation) {
      return;
    }

    setForm({
      guests: reservation.pax,
      occasion: reservation.occasion === "—" ? "" : reservation.occasion,
      specialRequests:
        reservation.specialRequests === "—" ? "" : reservation.specialRequests,
      arrivalNote: reservation.arrivalNote,
      timeSlot: reservation.time === "—" ? "" : reservation.time,
      date: reservation.date,
      status: resolveEditableStatus(reservation.status),
    });
  }, [open, reservation]);

  if (!open || !reservation) {
    return null;
  }

  const canEditStatus =
    reservation.status === "confirmed" || reservation.status === "prep";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative z-10 flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[28px] border ${fieldBorder} bg-card shadow-[var(--shadow-modal)]`}
      >
        <div className={`shrink-0 border-b ${fieldBorder} px-6 pb-5 pt-6`}>
          <p className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
            Reservation
          </p>
          <h2 className="mt-2 font-copperplate text-[22px] uppercase text-foreground">
            Edit Reservation
          </h2>
        </div>

        <div className="Custom__Scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FieldLabel>Guests</FieldLabel>
              <input
                type="number"
                min={1}
                value={form.guests ?? ""}
                disabled={submitting}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    guests: Number(event.target.value) || undefined,
                  }))
                }
                className={fieldClass}
              />
            </div>
            <div className="space-y-2">
              {canEditStatus ? (
                <>
                  <FieldLabel>Status</FieldLabel>
                  <select
                    value={form.status ?? reservation.status}
                    disabled={submitting}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.value as
                          | "confirmed"
                          | "prep",
                      }))
                    }
                    className={fieldClass}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="prep">Prep</option>
                  </select>
                </>
              ) : (
                <>
                  <FieldLabel>Status</FieldLabel>
                  <div className={`${fieldClass} text-secondary capitalize`}>
                    {reservation.status} — use Approve to confirm
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FieldLabel>Date</FieldLabel>
              <input
                type="date"
                value={form.date ?? ""}
                disabled={submitting}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    date: event.target.value,
                  }))
                }
                className={`${fieldClass} staff-modal-date-field cursor-pointer`}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Time Slot</FieldLabel>
              <input
                value={form.timeSlot ?? ""}
                disabled={submitting}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    timeSlot: event.target.value,
                  }))
                }
                className={fieldClass}
                placeholder="12:30 PM"
              />
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel>Occasion</FieldLabel>
            <input
              value={form.occasion ?? ""}
              disabled={submitting}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  occasion: event.target.value,
                }))
              }
              className={fieldClass}
            />
          </div>

          <div className="space-y-2">
            <FieldLabel>Special Requests</FieldLabel>
            <textarea
              value={form.specialRequests ?? ""}
              disabled={submitting}
              rows={3}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  specialRequests: event.target.value,
                }))
              }
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div className="space-y-2">
            <FieldLabel>Arrival Note</FieldLabel>
            <textarea
              value={form.arrivalNote ?? ""}
              disabled={submitting}
              rows={2}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  arrivalNote: event.target.value,
                }))
              }
              className={`${fieldClass} resize-none`}
            />
          </div>
        </div>

        <div
          className={`flex shrink-0 justify-end gap-3 border-t ${fieldBorder} px-6 py-5`}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className={`font-roboto cursor-pointer rounded-xl border ${fieldBorder} bg-input-muted px-5 py-3 text-[11px] font-semibold tracking-[0.12em] text-foreground uppercase transition-colors hover:border-accent/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60`}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => void onSubmit(buildUpdatePayload(form))}
            className="font-roboto cursor-pointer rounded-xl bg-gradient-to-r from-gold-bright to-primary px-5 py-3 text-[11px] font-bold tracking-[0.12em] text-dark uppercase disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
