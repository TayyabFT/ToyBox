"use client";

import { useEffect, useMemo, useState } from "react";
import { adminParkingApi } from "@/api/adminParking.api";
import {
  buildParkingSlotPayloads,
  formatPaddedNumber,
  getPreviewSlots,
  getSubmitSlotCount,
  hasAddSlotsErrors,
  validateAddSlotsForm,
  type AddSlotsFieldErrors,
} from "@/lib/addParkingSlots";
import { showError, showSuccess } from "@/lib/toast";
import {
  BAY_PREFIX_OPTIONS,
  createInitialAddSlotsForm,
  MAX_SLOTS,
  SLOT_TYPE_OPTIONS,
  type AddSlotsFormState,
} from "./types";

type AddSlotsModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
};

const fieldBorder = "border-accent/18";
const fieldClass = `font-roboto w-full rounded-xl border ${fieldBorder} bg-input-muted px-4 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-accent/60 disabled:cursor-not-allowed disabled:opacity-60`;

function FieldLabel({
  children,
  error,
}: {
  children: string;
  error?: string;
}) {
  return (
    <label
      className={`font-roboto block text-[10px] tracking-[0.12em] uppercase ${
        error ? "text-red-500" : "text-secondary"
      }`}
    >
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="font-roboto text-[10px] text-red-500">{message}</p>
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
          ? "admin-parking-gold-cta bg-gradient-to-r from-gold-bright to-primary font-bold text-dark"
          : `border ${fieldBorder} bg-input-muted text-primary hover:border-accent/50`
      }`}
    >
      {children}
    </button>
  );
}

export function AddSlotsModal({
  open,
  onClose,
  onSuccess,
}: AddSlotsModalProps) {
  const [form, setForm] = useState<AddSlotsFormState>(createInitialAddSlotsForm());
  const [errors, setErrors] = useState<AddSlotsFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const previewSlots = useMemo(() => getPreviewSlots(form), [form]);
  const submitSlotCount = useMemo(() => getSubmitSlotCount(form), [form]);

  useEffect(() => {
    if (!open) return;

    setForm(createInitialAddSlotsForm());
    setErrors({});
    setSubmitting(false);
  }, [open]);

  function updateField<K extends keyof AddSlotsFormState>(
    key: K,
    value: AddSlotsFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, slots: undefined }));
  }

  function handleClose() {
    if (submitting) return;

    onClose();
  }

  function decrementSlots() {
    updateField("slotCount", Math.max(1, form.slotCount - 1));
  }

  function incrementSlots() {
    updateField("slotCount", Math.min(MAX_SLOTS, form.slotCount + 1));
  }

  async function handleSubmit() {
    const nextErrors = validateAddSlotsForm(form);

    if (hasAddSlotsErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    const payloads = buildParkingSlotPayloads(form);

    setErrors({});
    setSubmitting(true);

    try {
      const results = await Promise.allSettled(
        payloads.map((body) => adminParkingApi.createSlot(body)),
      );

      const failures = results.filter(
        (result): result is PromiseRejectedResult => result.status === "rejected",
      );

      if (failures.length > 0) {
        const message =
          (failures[0].reason as { message?: string })?.message ??
          "Failed to create one or more parking slots";

        if (failures.length < payloads.length) {
          showError(
            `${payloads.length - failures.length} slot(s) created, but ${failures.length} failed. ${message}`,
          );
        } else {
          showError(message);
        }

        if (failures.length < payloads.length) {
          await onSuccess?.();
        }

        return;
      }

      const successMessage =
        payloads.length === 1
          ? "Parking slot created successfully"
          : `${payloads.length} parking slots created successfully`;

      showSuccess(successMessage);
      onClose();
      await onSuccess?.();
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to create parking slots";

      showError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative z-10 flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[28px] border ${fieldBorder} bg-card shadow-[var(--shadow-modal)]`}
      >
        <div className={`relative shrink-0 border-b ${fieldBorder} px-5 py-5`}>
          <p className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
            Vehicles
          </p>
          <h2 className="mt-1 font-copperplate text-[22px] uppercase text-foreground">
            Add Slots
          </h2>
        </div>

        <div className="Custom__Scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <label className="font-roboto flex cursor-pointer items-center gap-3 rounded-xl border border-accent/18 bg-input-muted px-4 py-3.5">
            <input
              type="checkbox"
              checked={form.createMultiple}
              disabled={submitting}
              onChange={(event) =>
                updateField("createMultiple", event.target.checked)
              }
              className="size-4 cursor-pointer accent-[#D4A847]"
            />
            <span className="text-sm text-foreground">Create multiple slots</span>
          </label>

          <div className="space-y-2">
            <FieldLabel error={errors.bayPrefix}>Bay</FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              {BAY_PREFIX_OPTIONS.map((prefix) => (
                <ToggleButton
                  key={prefix}
                  active={form.bayPrefix === prefix}
                  disabled={submitting}
                  onClick={() => updateField("bayPrefix", prefix)}
                >
                  {prefix}
                </ToggleButton>
              ))}
            </div>
            <FieldError message={errors.bayPrefix} />
          </div>

          {form.createMultiple ? (
            <div className="space-y-2">
              <FieldLabel error={errors.slotCount}>Number of Slots</FieldLabel>
              <div
                className={`flex h-[48px] items-stretch overflow-hidden rounded-xl border ${fieldBorder} bg-input-muted`}
              >
                <button
                  type="button"
                  onClick={decrementSlots}
                  disabled={submitting || form.slotCount <= 1}
                  className="font-roboto flex w-12 shrink-0 cursor-pointer items-center justify-center text-lg text-foreground transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Decrease number of slots"
                >
                  −
                </button>
                <div className="w-px bg-accent/18" />
                <div className="font-roboto flex flex-1 items-center justify-center text-sm text-foreground">
                  {form.slotCount}
                </div>
                <div className="w-px bg-accent/18" />
                <button
                  type="button"
                  onClick={incrementSlots}
                  disabled={submitting || form.slotCount >= MAX_SLOTS}
                  className="font-roboto flex w-12 shrink-0 cursor-pointer items-center justify-center text-lg text-foreground transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Increase number of slots"
                >
                  +
                </button>
              </div>
              <p className="font-roboto text-[10px] text-secondary">
                Bay numbers are added automatically from 01 to{" "}
                {formatPaddedNumber(form.slotCount)}.
              </p>
              <FieldError message={errors.slotCount} />
            </div>
          ) : (
            <div className="space-y-2">
              <FieldLabel error={errors.baySuffix}>Bay Number</FieldLabel>
              <input
                type="text"
                inputMode="numeric"
                value={form.baySuffix}
                disabled={submitting}
                onChange={(event) => updateField("baySuffix", event.target.value)}
                placeholder="01"
                className={fieldClass}
              />
              <FieldError message={errors.baySuffix} />
            </div>
          )}

          <div className="space-y-2">
            <FieldLabel>Slot Type</FieldLabel>
            <div className="grid grid-cols-6 gap-2">
              {SLOT_TYPE_OPTIONS.map((option) => (
                <ToggleButton
                  key={option.id}
                  active={form.slotType === option.id}
                  disabled={submitting}
                  onClick={() => updateField("slotType", option.id)}
                  className="col-span-2"
                >
                  {option.label}
                </ToggleButton>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel error={errors.openTime}>Open Time</FieldLabel>
              <input
                type="time"
                value={form.openTime}
                disabled={submitting}
                onChange={(event) => updateField("openTime", event.target.value)}
                className={`${fieldClass} staff-modal-date-field cursor-pointer`}
              />
              <FieldError message={errors.openTime} />
            </div>

            <div className="space-y-2">
              <FieldLabel error={errors.closeTime}>Close Time</FieldLabel>
              <input
                type="time"
                value={form.closeTime}
                disabled={submitting}
                onChange={(event) => updateField("closeTime", event.target.value)}
                className={`${fieldClass} staff-modal-date-field cursor-pointer`}
              />
              <FieldError message={errors.closeTime} />
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel>Notes</FieldLabel>
            <textarea
              value={form.notes}
              disabled={submitting}
              rows={3}
              placeholder="Near elevator"
              onChange={(event) => updateField("notes", event.target.value)}
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div className={`rounded-xl border ${fieldBorder} bg-input-muted px-4 py-4`}>
            <p className="font-roboto text-sm text-foreground">
              Slots to be created
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {previewSlots.map((slot) => (
                <span
                  key={slot.slotCode}
                  title={slot.label}
                  className={`font-roboto inline-flex rounded-lg border ${fieldBorder} px-3 py-1.5 text-xs text-primary`}
                >
                  {slot.slotCode}
                </span>
              ))}
            </div>
            <FieldError message={errors.slots} />
          </div>
        </div>

        <div
          className={`flex shrink-0 justify-end gap-3 border-t ${fieldBorder} px-6 py-5`}
        >
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className={`font-roboto cursor-pointer rounded-xl border ${fieldBorder} bg-input-muted px-5 py-3 text-[11px] font-semibold tracking-[0.12em] text-foreground uppercase transition-colors hover:border-accent/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting}
            className="admin-parking-gold-cta font-roboto cursor-pointer rounded-xl bg-gradient-to-r from-gold-bright to-primary px-5 py-3 text-[11px] font-bold tracking-[0.12em] text-dark uppercase disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Adding..."
              : submitSlotCount === 1
                ? "Add Slot"
                : `Add ${submitSlotCount} Slots`}
          </button>
        </div>
      </div>
    </div>
  );
}
