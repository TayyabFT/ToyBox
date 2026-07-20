"use client";

import { useState, useEffect, useRef } from "react";
import { authApi } from "@/api/auth.api";
import { memberDetailingApi } from "@/api/memberDetailing.api";
import {
  buildDetailingBookingBody,
  resolveDetailingReferenceNumber,
} from "@/lib/memberDetailing";
import { RightArrow } from "@/components/common";
import { MemberRequestModalFrame } from "../shared/MemberRequestModalFrame";
import {
  memberRequestModalPrimaryButtonClass,
  memberRequestModalPrimaryButtonFullClass,
  memberRequestModalSecondaryButtonClass,
} from "../shared/memberRequestModal";
import { DetailingWashBookingStatusStep } from "./DetailingWashBookingStatusStep";
import { DetailingWashConfirmedStep } from "./DetailingWashConfirmedStep";
import { DetailingWashDetailsForm } from "./DetailingWashDetailsForm";
import { DetailingWashReviewStep } from "./DetailingWashReviewStep";
import { RequestStepper } from "../shared/RequestStepper";
import { ModalLoadingSkeleton } from "../shared/ModalLoadingSkeleton";
import { calculateWashTotal, formatWashTotal } from "./washOptions";
import type { WashDetailsFormState } from "./types";
import type { MemberDetailingBookingProgressData } from "@/types/api";

import { generateDateOptions } from "@/components/member/garage/shared/requestFormUi";

/** Statuses that mean the booking is still active (not done/cancelled) */
const ACTIVE_STATUSES = new Set([
  "request received",
  "awaiting confirmation",
  "confirmed",
  "in progress",
  "in-progress",
]);

function isActiveStatus(status?: string): boolean {
  return ACTIVE_STATUSES.has((status ?? "").trim().toLowerCase());
}

// Today's ISO key for the initial date selection
function getTodayIso(): string {
  return generateDateOptions(1)[0]?.key ?? new Date().toISOString().slice(0, 10);
}

const INITIAL_FORM_STATE: WashDetailsFormState = {
  package: "full-detail",
  addOns: [],
  date: getTodayIso(),
  notes: "",
};

type DetailingWashModalProps = {
  vehicleId: string;
  vehicleName: string;
  open: boolean;
  onClose: () => void;
};

export function DetailingWashModal({
  vehicleId,
  vehicleName,
  open,
  onClose,
}: DetailingWashModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<WashDetailsFormState>(INITIAL_FORM_STATE);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Active booking state
  const [isCheckingActive, setIsCheckingActive] = useState(false);
  const [progressData, setProgressData] = useState<MemberDetailingBookingProgressData | null>(null);
  const [activeBookingTotal, setActiveBookingTotal] = useState<string | null>(null);

  // Track the last vehicleId we ran the check for to avoid repeat fetches
  const checkedForRef = useRef<string | null>(null);

  // When the modal opens, check for an existing active booking for this vehicle
  useEffect(() => {
    if (!open) return;
    // Avoid redundant calls if we already checked for this vehicle in this session
    if (checkedForRef.current === vehicleId) return;

    async function checkActiveBooking() {
      setIsCheckingActive(true);
      try {
        const profile = await authApi.getProfile();
        const memberId = profile.data.id;
        if (!memberId) return;

        const listRes = await memberDetailingApi.getBookings(memberId);
        const bookings = listRes.data.bookings ?? [];

        // Find the most recent active booking for this vehicle
        const active = bookings.find(
          (b) =>
            String(b.vehicleId) === String(vehicleId) &&
            isActiveStatus(b.status),
        );

        if (active?.id) {
          // Fetch live progress for that booking
          const progressRes = await memberDetailingApi.getProgress(String(active.id));
          setProgressData(progressRes.data);
          setActiveBookingTotal(active.totalLabel ?? null);
          setStep(4); // Jump straight to Booking Status
        }
      } catch {
        // Silently fall through — if the check fails just show the form as normal
      } finally {
        setIsCheckingActive(false);
        checkedForRef.current = vehicleId;
      }
    }

    void checkActiveBooking();
  }, [open, vehicleId]);

  // Reset when modal closes
  function handleClose() {
    setStep(1);
    setForm(INITIAL_FORM_STATE);
    setReferenceNumber("");
    setSubmitError(null);
    setIsSubmitting(false);
    setProgressData(null);
    setActiveBookingTotal(null);
    checkedForRef.current = null;
    onClose();
  }

  function handleChange(patch: Partial<WashDetailsFormState>) {
    setForm((current) => ({ ...current, ...patch }));
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
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const profile = await authApi.getProfile();
      const memberId = profile.data.id;

      if (!memberId) {
        throw new Error("Unable to resolve member profile");
      }

      const response = await memberDetailingApi.createBooking(
        buildDetailingBookingBody(memberId, vehicleId, form),
      );

      setReferenceNumber(resolveDetailingReferenceNumber(response.data));
      setStep(3);
    } catch (error) {
      setSubmitError(
        (error as { message?: string }).message ??
          "Failed to submit detailing request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleTrackBooking() {
    setStep(4);
  }

  const isTracking = step === 4;

  // Use active booking total when viewing an existing booking, otherwise form total
  const bookingTotal = activeBookingTotal ?? formatWashTotal(calculateWashTotal(form));

  let footer: React.ReactNode = null;

  if (isCheckingActive) {
    // Show nothing in the footer while we're checking
    footer = null;
  } else if (step === 1) {
    footer = (
      <button
        type="button"
        onClick={handleContinueToReview}
        className={`${memberRequestModalPrimaryButtonFullClass} gap-2 uppercase`}
      >
        Continue to review
        <RightArrow className="shrink-0" />
      </button>
    );
  } else if (step === 2) {
    footer = (
      <div className="flex flex-col gap-3">
        {submitError ? (
          <p className="font-roboto text-center text-[12px] text-pink">
            {submitError}
          </p>
        ) : null}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleEditRequest}
            disabled={isSubmitting}
            className={memberRequestModalSecondaryButtonClass}
          >
            Edit Request
          </button>
          <button
            type="button"
            onClick={handleConfirmSubmit}
            disabled={isSubmitting}
            className={`${memberRequestModalPrimaryButtonClass} gap-2 uppercase`}
          >
            {isSubmitting ? "Submitting..." : "Confirm & Submit"}
            {!isSubmitting && <RightArrow className="shrink-0" />}
          </button>
        </div>
      </div>
    );
  } else if (step === 3) {
    footer = (
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleTrackBooking}
          className={`${memberRequestModalPrimaryButtonFullClass} uppercase`}
        >
          Track this booking
        </button>
        <button
          type="button"
          onClick={handleClose}
          className={`${memberRequestModalSecondaryButtonClass} w-full flex-none`}
        >
          Back
        </button>
      </div>
    );
  } else if (step === 4) {
    footer = (
      <button
        type="button"
        onClick={handleClose}
        className={`${memberRequestModalSecondaryButtonClass} w-full flex-none`}
      >
        Back To Requests
      </button>
    );
  }

  return (
    <MemberRequestModalFrame
      open={open}
      onClose={handleClose}
      garageLabel={isTracking ? undefined : `Garage . ${vehicleName}`}
      headerSubtitle={isTracking ? `${bookingTotal} . In Progress` : undefined}
      titleBefore={isTracking ? "Booking " : "Detailing & "}
      titleAfter={isTracking ? "Status" : "Wash"}
      stepper={
        isTracking
          ? undefined
          : isCheckingActive
            ? undefined
            : <RequestStepper currentStep={step} completedLineVariant="muted" labelVariant="normal" />
      }
      footer={footer}
    >
      {isCheckingActive ? (
        <ModalLoadingSkeleton />
      ) : (
        <>
          {step === 1 && (
            <DetailingWashDetailsForm value={form} onChange={handleChange} />
          )}

          {step === 2 && (
            <DetailingWashReviewStep vehicleName={vehicleName} form={form} />
          )}

          {step === 3 && (
            <DetailingWashConfirmedStep
              vehicleName={vehicleName}
              form={form}
              referenceNumber={referenceNumber}
            />
          )}

          {step === 4 && (
            <DetailingWashBookingStatusStep form={form} progressData={progressData} />
          )}
        </>
      )}
    </MemberRequestModalFrame>
  );
}
