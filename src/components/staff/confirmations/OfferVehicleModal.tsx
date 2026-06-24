"use client";

import { useEffect, useRef, useState } from "react";
import { vehiclesApi } from "@/api/vehicles.api";
import { sourcingApi } from "@/api/sourcing.api";
import { ChevronDown, VehicleCalendar } from "@/components/common/Svgs";
import { mapOfferVehicleOptions, type OfferVehicleOption } from "@/lib/vehicles";
import { showError, showSuccess } from "@/lib/toast";
import type { ConfirmationRequestItem } from "./types";

type OfferVehicleModalProps = {
  open: boolean;
  request: ConfirmationRequestItem | null;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
};

type OfferDateFieldProps = {
  id: string;
  label: string;
  value: string;
  min?: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

function OfferDateField({
  id,
  label,
  value,
  min,
  error,
  onChange,
  disabled = false,
}: OfferDateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    if (disabled) return;

    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={`font-roboto block text-[10px] tracking-[0.12em] uppercase ${
          error ? "text-red-500" : "text-primary"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="date"
          value={value}
          min={min}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className={`font-roboto w-full cursor-pointer rounded-xl border bg-dark px-4 py-3.5 pr-10 text-sm text-foreground outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-accent/20 focus:border-accent/40"
          }`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={openPicker}
          disabled={disabled}
          aria-label={`Select ${label} date`}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer disabled:cursor-not-allowed"
        >
          <VehicleCalendar />
        </button>
      </div>
      {error ? (
        <p className="font-roboto text-[10px] text-red-500">{error}</p>
      ) : null}
    </div>
  );
}

type FieldErrors = {
  vehicleId?: string;
  offerStartDate?: string;
  offerEndDate?: string;
};

export function OfferVehicleModal({
  open,
  request,
  onClose,
  onSuccess,
}: OfferVehicleModalProps) {
  const [vehicles, setVehicles] = useState<OfferVehicleOption[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerEndDate, setOfferEndDate] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!open) return;

    async function loadVehicles() {
      setLoadingVehicles(true);

      try {
        const response = await vehiclesApi.getInventory();
        const options = mapOfferVehicleOptions(response.data);

        setVehicles(options);
        setVehicleId((current) => current || options[0]?.id || "");
      } catch (error) {
        const message =
          (error as { message?: string }).message ??
          "Failed to load inventory vehicles";

        showError(message);
        setVehicles([]);
        setVehicleId("");
      } finally {
        setLoadingVehicles(false);
      }
    }

    loadVehicles();
  }, [open]);

  function handleClose() {
    if (submitting) return;

    setVehicleId("");
    setOfferStartDate("");
    setOfferEndDate("");
    setErrors({});
    onClose();
  }

  function validateForm(): FieldErrors {
    const nextErrors: FieldErrors = {};

    if (!vehicleId) {
      nextErrors.vehicleId = "Please select a vehicle";
    }

    if (!offerStartDate) {
      nextErrors.offerStartDate = "Please select a start date";
    }

    if (!offerEndDate) {
      nextErrors.offerEndDate = "Please select an end date";
    } else if (offerStartDate && offerEndDate < offerStartDate) {
      nextErrors.offerEndDate = "End date must be on or after start date";
    }

    return nextErrors;
  }

  async function handleSubmit() {
    if (!request) return;

    if (!request.memberId) {
      showError("Member information is missing for this request");
      return;
    }

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await sourcingApi.assignVehicle(request.id, {
        vehicleId: vehicleId.trim(),
        memberId: request.memberId.trim(),
        offerStartDate,
        offerEndDate,
      });

      showSuccess(response.message || "Vehicle offer sent successfully");
      setVehicleId("");
      setOfferStartDate("");
      setOfferEndDate("");
      setErrors({});
      onClose();
      await onSuccess?.();
    } catch (error) {
      const message =
        (error as { message?: string }).message ?? "Failed to send vehicle offer";

      showError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-[500px] overflow-hidden rounded-[28px] border border-accent/20 bg-background shadow-[var(--shadow-modal)]">
        <div className="relative border-b border-accent/10 px-6 pb-5 pt-6">
          <p className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
            Bookings
          </p>
          <h2 className="mt-2 font-copperplate text-[22px] uppercase text-primary">
            Offer a Vehicle
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="absolute right-5 top-5 cursor-pointer text-secondary transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="space-y-2">
            <label
              htmlFor="offer-vehicle"
              className={`font-roboto block text-[10px] tracking-[0.12em] uppercase ${
                errors.vehicleId ? "text-red-500" : "text-primary"
              }`}
            >
              Vehicle
            </label>
            <div className="relative">
              <select
                id="offer-vehicle"
                value={vehicleId}
                aria-invalid={Boolean(errors.vehicleId)}
                onChange={(event) => {
                  setVehicleId(event.target.value);
                  if (errors.vehicleId) {
                    setErrors((current) => ({ ...current, vehicleId: undefined }));
                  }
                }}
                disabled={loadingVehicles || submitting || vehicles.length === 0}
                className={`font-roboto w-full appearance-none rounded-xl border bg-dark px-4 py-3.5 pr-10 text-sm text-foreground outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  errors.vehicleId
                    ? "border-red-500 focus:border-red-500"
                    : "border-accent/20 focus:border-accent/40"
                }`}
              >
                {loadingVehicles ? (
                  <option value="">Loading vehicles...</option>
                ) : vehicles.length > 0 ? (
                  vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </option>
                  ))
                ) : (
                  <option value="">No inventory vehicles available</option>
                )}
              </select>
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
                <ChevronDown />
              </span>
            </div>
            {errors.vehicleId ? (
              <p className="font-roboto text-[10px] text-red-500">
                {errors.vehicleId}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="font-roboto text-[10px] tracking-[0.12em] text-primary uppercase">
              Offer to Member
            </p>
            <div className="font-roboto rounded-xl border border-accent/20 bg-dark px-4 py-3.5 text-sm text-foreground">
              {request.memberName}
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-roboto text-[10px] tracking-[0.12em] text-primary uppercase">
              Preferred Dates
            </p>
            <div className="grid grid-cols-2 gap-3">
              <OfferDateField
                id="offer-start-date"
                label="Start"
                value={offerStartDate}
                error={errors.offerStartDate}
                onChange={(value) => {
                  setOfferStartDate(value);
                  if (errors.offerStartDate || errors.offerEndDate) {
                    setErrors((current) => ({
                      ...current,
                      offerStartDate: undefined,
                      offerEndDate: undefined,
                    }));
                  }
                }}
                disabled={submitting}
              />
              <OfferDateField
                id="offer-end-date"
                label="End"
                value={offerEndDate}
                min={offerStartDate || undefined}
                error={errors.offerEndDate}
                onChange={(value) => {
                  setOfferEndDate(value);
                  if (errors.offerEndDate) {
                    setErrors((current) => ({
                      ...current,
                      offerEndDate: undefined,
                    }));
                  }
                }}
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-accent/10 px-6 py-5">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="font-roboto cursor-pointer rounded-xl border border-accent/25 px-5 py-3 text-[11px] font-semibold tracking-[0.12em] text-foreground uppercase transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || loadingVehicles || vehicles.length === 0}
            className="font-roboto cursor-pointer rounded-xl bg-gradient-to-r from-gold-bright to-primary px-5 py-3 text-[11px] font-semibold tracking-[0.12em] text-dark uppercase disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Offer"}
          </button>
        </div>
      </div>
    </div>
  );
}
