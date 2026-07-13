"use client";

import { useEffect, useState } from "react";
import { adminParkingApi } from "@/api/adminParking.api";
import { showError, showSuccess } from "@/lib/toast";
import type { StaffParkingSlotUpdateRequest } from "@/types/api";
import {
  PARKING_SLOT_STATUS_OPTIONS,
  PARKING_SLOT_TYPE_OPTIONS,
  type ParkingSlotDetail,
} from "./types";

type EditParkingSlotModalProps = {
  open: boolean;
  slot: ParkingSlotDetail | null;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
};

const fieldBorder = "border-[#D4A8472E]";
const fieldClass = `font-roboto w-full rounded-xl border ${fieldBorder} bg-[#11100C] px-4 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-accent/60 disabled:cursor-not-allowed disabled:opacity-60`;

function FieldLabel({ children }: { children: string }) {
  return (
    <label className="font-roboto block text-[10px] tracking-[0.12em] text-secondary uppercase">
      {children}
    </label>
  );
}

function ToggleButton({
  active,
  disabled,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`font-roboto cursor-pointer rounded-xl px-2 py-3 text-[10px] tracking-[0.08em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${className} ${
        active
          ? "bg-gradient-to-r from-gold-bright to-primary font-bold text-dark"
          : `border ${fieldBorder} bg-[#11100C] text-primary hover:border-accent/50`
      }`}
    >
      {children}
    </button>
  );
}

export function EditParkingSlotModal({
  open,
  slot,
  onClose,
  onSuccess,
}: EditParkingSlotModalProps) {
  const [form, setForm] = useState<StaffParkingSlotUpdateRequest>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !slot) return;

    setForm({
      slotCode: slot.slotCode,
      level: slot.level,
      zone: slot.zone,
      label: slot.label,
      slotType: slot.slotType,
      openTime: slot.openTime === "—" ? "" : slot.openTime,
      closeTime: slot.closeTime === "—" ? "" : slot.closeTime,
      status: slot.status,
      isActive: slot.isActive,
      notes: slot.notes,
    });
    setSubmitting(false);
  }, [open, slot]);

  function handleClose() {
    if (submitting) return;

    onClose();
  }

  async function handleSubmit() {
    if (!slot) return;

    setSubmitting(true);

    try {
      await adminParkingApi.updateSlot(slot.id, {
        ...form,
        notes: form.notes?.trim() || undefined,
      });

      showSuccess("Parking slot updated successfully");
      onClose();
      await onSuccess?.();
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to update parking slot";

      showError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open || !slot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative z-10 flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[28px] border ${fieldBorder} bg-[#11100C] shadow-[var(--shadow-modal)]`}
      >
        <div className={`shrink-0 border-b ${fieldBorder} px-6 pb-5 pt-6`}>
          <p className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
            Parking
          </p>
          <h2 className="mt-2 font-copperplate text-[22px] uppercase text-foreground">
            Edit Slot
          </h2>
        </div>

        <div className="Custom__Scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FieldLabel>Slot Code</FieldLabel>
              <input
                value={form.slotCode ?? ""}
                disabled={submitting}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slotCode: event.target.value,
                  }))
                }
                className={fieldClass}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Zone</FieldLabel>
              <input
                value={form.zone ?? ""}
                disabled={submitting}
                maxLength={1}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    zone: event.target.value.toUpperCase(),
                  }))
                }
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FieldLabel>Level</FieldLabel>
              <input
                value={form.level ?? ""}
                disabled={submitting}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    level: event.target.value,
                  }))
                }
                className={fieldClass}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Label</FieldLabel>
              <input
                value={form.label ?? ""}
                disabled={submitting}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    label: event.target.value,
                  }))
                }
                className={fieldClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel>Slot Type</FieldLabel>
            <div className="grid grid-cols-6 gap-2">
              {PARKING_SLOT_TYPE_OPTIONS.map((option) => (
                <ToggleButton
                  key={option.id}
                  active={form.slotType === option.id}
                  disabled={submitting}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      slotType: option.id,
                    }))
                  }
                  className="col-span-2"
                >
                  {option.label}
                </ToggleButton>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel>Status</FieldLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PARKING_SLOT_STATUS_OPTIONS.map((option) => (
                <ToggleButton
                  key={option.id}
                  active={form.status === option.id}
                  disabled={submitting}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      status: option.id,
                    }))
                  }
                >
                  {option.label}
                </ToggleButton>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FieldLabel>Open Time</FieldLabel>
              <input
                type="time"
                value={form.openTime ?? ""}
                disabled={submitting}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    openTime: event.target.value,
                  }))
                }
                className={`${fieldClass} staff-modal-date-field cursor-pointer`}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Close Time</FieldLabel>
              <input
                type="time"
                value={form.closeTime ?? ""}
                disabled={submitting}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    closeTime: event.target.value,
                  }))
                }
                className={`${fieldClass} staff-modal-date-field cursor-pointer`}
              />
            </div>
          </div>

          <label className="font-roboto flex cursor-pointer items-center gap-3 rounded-xl border border-[#D4A8472E] bg-[#11100C] px-4 py-3.5">
            <input
              type="checkbox"
              checked={form.isActive ?? true}
              disabled={submitting}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  isActive: event.target.checked,
                }))
              }
              className="size-4 cursor-pointer accent-[#D4A847]"
            />
            <span className="text-sm text-foreground">Slot is active</span>
          </label>

          <div className="space-y-2">
            <FieldLabel>Notes</FieldLabel>
            <textarea
              value={form.notes ?? ""}
              disabled={submitting}
              rows={3}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  notes: event.target.value,
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
            onClick={handleClose}
            disabled={submitting}
            className={`font-roboto cursor-pointer rounded-xl border ${fieldBorder} bg-[#11100C] px-5 py-3 text-[11px] font-semibold tracking-[0.12em] text-foreground uppercase transition-colors hover:border-accent/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting}
            className="font-roboto cursor-pointer rounded-xl bg-gradient-to-r from-gold-bright to-primary px-5 py-3 text-[11px] font-bold tracking-[0.12em] text-dark uppercase disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
