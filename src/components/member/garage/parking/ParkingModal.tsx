"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { prependParkingActivity } from "@/store/slices/memberDashboardSlice";
import { invalidateDiary } from "@/store/slices/diarySlice";
import { authApi } from "@/api/auth.api";
import { memberParkingApi } from "@/api/memberParking.api";
import { memberVehiclesApi } from "@/api/memberVehicles.api";
import { MemberRequestModalFrame } from "../shared/MemberRequestModalFrame";
import {
  memberRequestModalPrimaryButtonFullClass,
  memberRequestModalSecondaryButtonClass,
} from "../shared/memberRequestModal";
import { RequestStepper } from "../shared/RequestStepper";
import { ParkingFindSlotStep } from "./ParkingFindSlotStep";
import { ParkingModeForm } from "./ParkingModeForm";
import { ParkingConfirmedStep } from "./ParkingConfirmedStep";
import { currentRoundedTime, toIsoString, todayIso } from "./parkingOptions";
import type {
  ParkingFindSlotFormState,
  ParkingFormState,
  ParkingReviewFormState,
  ParkingSlotResult,
  ParkingSubmitResult,
} from "./types";

// ── Stepper labels ────────────────────────────────────────────────────────

const PARKING_STEPS = [
  { id: 1, label: "Find Slot" },
  { id: 2, label: "Review" },
  { id: 3, label: "Confirmed" },
];

// ── Vehicle option ────────────────────────────────────────────────────────

export type ParkingVehicleOption = {
  id: string;
  name: string;
};

// ── Initial form state ────────────────────────────────────────────────────

function buildInitialForm(): ParkingFormState {
  const today = todayIso();
  const fromTime = currentRoundedTime(0);
  const toTime = currentRoundedTime(180); // +3 h default window

  return {
    fromDate: today,
    fromTime,
    toDate: today,
    toTime,
    level: "any",
    zone: "any",
    slotType: "any",
    selectableOnly: true,
    mode: "drop_self",
    pickupAddress: "",
    pickupNotes: "",
  };
}

// ── Validation helpers ────────────────────────────────────────────────────

function isFindSlotComplete(
  form: ParkingFindSlotFormState,
  selectedSlot: ParkingSlotResult | null,
): boolean {
  return Boolean(
    form.fromDate && form.fromTime && form.toDate && form.toTime && selectedSlot,
  );
}

function isReviewComplete(form: ParkingReviewFormState): boolean {
  if (form.mode === "pickup") {
    return form.pickupAddress.trim().length > 0;
  }
  return true;
}

// ── Props ─────────────────────────────────────────────────────────────────

type ParkingModalProps = {
  vehicleId: string;
  vehicleName: string;
  open: boolean;
  onClose: () => void;
};

// ── Component ─────────────────────────────────────────────────────────────

export function ParkingModal({
  vehicleId,
  vehicleName,
  open,
  onClose,
}: ParkingModalProps) {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ParkingFormState>(buildInitialForm);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlotResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<ParkingSubmitResult | null>(null);

  // ── Vehicle list ──────────────────────────────────────────────────────────
  const [vehicles, setVehicles] = useState<ParkingVehicleOption[]>([
    { id: vehicleId, name: vehicleName },
  ]);
  const [activeVehicleId, setActiveVehicleId] = useState(vehicleId);

  // Fetch all member vehicles when the modal first opens
  useEffect(() => {
    if (!open) return;

    async function loadVehicles() {
      try {
        const profile = await authApi.getProfile();
        const memberId = profile.data.id;
        if (!memberId) return;

        const res = await memberVehiclesApi.getGarage({ memberId });
        const raw = res.data?.vehicles ?? [];

        const options: ParkingVehicleOption[] = raw
          .filter((v) => v.id)
          .map((v) => ({
            id: String(v.id),
            name:
              [v.make, v.model].filter(Boolean).join(" ").trim() ||
              v.displayName ||
              "Vehicle",
          }));

        if (options.length > 0) {
          setVehicles(options);
          // Keep the originally opened vehicle selected if it's in the list
          const stillPresent = options.some((v) => v.id === vehicleId);
          if (!stillPresent) setActiveVehicleId(options[0].id);
        }
      } catch {
        // Fall through — keep the single pre-seeded chip
      }
    }

    void loadVehicles();
  }, [open, vehicleId]);

  // Derived display name for the currently active vehicle
  const activeVehicleName =
    vehicles.find((v) => v.id === activeVehicleId)?.name ?? vehicleName;

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleClose() {
    setStep(1);
    setForm(buildInitialForm());
    setSelectedSlot(null);
    setActiveVehicleId(vehicleId);
    setIsSubmitting(false);
    setSubmitError(null);
    setSubmitResult(null);
    onClose();
  }

  function handleChangeFindSlot(patch: Partial<ParkingFindSlotFormState>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function handleChangeReview(patch: Partial<ParkingReviewFormState>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function handleContinueToReview() {
    setSubmitError(null);
    setStep(2);
  }

  function handleEditRequest() {
    setSubmitError(null);
    setStep(1);
  }

  async function handleConfirmSubmit() {
    if (!selectedSlot) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const body = {
        vehicleId: activeVehicleId,
        slotId: selectedSlot.id,
        scheduledStartAt: toIsoString(form.fromDate, form.fromTime),
        scheduledEndAt: toIsoString(form.toDate, form.toTime),
        mode: form.mode,
        pickupAddress: form.mode === "pickup" ? form.pickupAddress : undefined,
        pickupNotes:
          form.mode === "pickup" && form.pickupNotes
            ? form.pickupNotes
            : undefined,
      };

      const res = await memberParkingApi.createSession(body);
      const data = (res as { data?: unknown }).data as
        | Record<string, unknown>
        | undefined;

      setSubmitResult({
        sessionId: String(data?.id ?? ""),
        referenceNumber: String(data?.referenceNumber ?? data?.reference ?? ""),
        status: String(data?.status ?? "pending"),
      });

      // ── Update dashboard activity feed immediately ──────────────────
      const slotLabel = selectedSlot
        ? `${selectedSlot.slotCode} · Level ${selectedSlot.level} · Zone ${selectedSlot.zone}`
        : "Slot confirmed";
      const modeLabel = form.mode === "pickup" ? "Pickup" : "Drop Off";

      dispatch(
        prependParkingActivity({
          id: `parking-${String(data?.id ?? Date.now())}`,
          title: `Vehicle Parking — ${activeVehicleName}`,
          titlePrefix: "Vehicle Parking",
          titleHighlight: activeVehicleName,
          detail: `${slotLabel} · ${modeLabel} · Pending`,
          timeLabel: "Just now",
          tone: "gold",
        }),
      );

      // ── Invalidate diary so it refetches on next visit ──────────────
      dispatch(invalidateDiary());

      setStep(3);
    } catch (err) {
      setSubmitError(
        (err as { message?: string }).message ??
          "Failed to submit parking request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNewRequest() {
    setStep(1);
    setForm(buildInitialForm());
    setSelectedSlot(null);
    setSubmitError(null);
    setSubmitResult(null);
  }

  // ── Footer ────────────────────────────────────────────────────────────────

  let footer: React.ReactNode = null;

  if (step === 1) {
    const canContinue = isFindSlotComplete(form, selectedSlot);
    footer = (
      <button
        type="button"
        onClick={handleContinueToReview}
        disabled={!canContinue}
        className={`${memberRequestModalPrimaryButtonFullClass} uppercase disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Continue to Review
      </button>
    );
  } else if (step === 2) {
    const canSubmit = isReviewComplete(form);
    footer = (
      <div className="flex flex-col gap-3">
        {submitError ? (
          <p className="font-roboto text-center text-[12px] text-pink">
            {submitError}
          </p>
        ) : null}
        <button
          type="button"
          onClick={handleConfirmSubmit}
          disabled={isSubmitting || !canSubmit}
          className={`${memberRequestModalPrimaryButtonFullClass} uppercase disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {isSubmitting ? "Submitting…" : "Confirm & Submit"}
        </button>
        <button
          type="button"
          onClick={handleEditRequest}
          disabled={isSubmitting}
          className={`${memberRequestModalSecondaryButtonClass} w-full flex-none text-primary`}
        >
          Edit Request
        </button>
      </div>
    );
  } else if (step === 3) {
    footer = (
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleClose}
          className={`${memberRequestModalPrimaryButtonFullClass} uppercase`}
        >
          Back to Requests
        </button>
        <button
          type="button"
          onClick={handleNewRequest}
          className={`${memberRequestModalSecondaryButtonClass} w-full flex-none text-primary`}
        >
          New Parking Request
        </button>
      </div>
    );
  }

  // ── Header ────────────────────────────────────────────────────────────────

  const titleAfter =
    step === 3 ? "Confirmed" : step === 2 ? "Review" : "Parking";

  return (
    <MemberRequestModalFrame
      open={open}
      onClose={handleClose}
      garageLabel={`Garage . ${activeVehicleName}`}
      titleBefore="Vehicle "
      titleAfter={titleAfter}
      stepper={
        <RequestStepper
          currentStep={step}
          steps={PARKING_STEPS}
          completedLineVariant="primary"
          labelVariant="small"
        />
      }
      footer={footer}
    >
      {step === 1 && (
        <ParkingFindSlotStep
          vehicles={vehicles}
          activeVehicleId={activeVehicleId}
          onVehicleChange={(id) => {
            setActiveVehicleId(id);
            setSelectedSlot(null);
          }}
          form={form}
          onChange={handleChangeFindSlot}
          selectedSlot={selectedSlot}
          onSlotSelect={setSelectedSlot}
        />
      )}

      {step === 2 && selectedSlot && (
        <ParkingModeForm
          vehicleName={activeVehicleName}
          form={form}
          selectedSlot={selectedSlot}
          onChange={handleChangeReview}
        />
      )}

      {step === 3 && selectedSlot && submitResult && (
        <ParkingConfirmedStep
          vehicleName={activeVehicleName}
          form={form}
          selectedSlot={selectedSlot}
          result={submitResult}
        />
      )}
    </MemberRequestModalFrame>
  );
}
