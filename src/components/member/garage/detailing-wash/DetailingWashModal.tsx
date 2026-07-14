"use client";

import { useState } from "react";
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
import { calculateWashTotal, formatWashTotal } from "./washOptions";
import type { WashDetailsFormState } from "./types";

import { generateDateOptions } from "@/components/member/garage/shared/requestFormUi";

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

  function handleChange(patch: Partial<WashDetailsFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function handleClose() {
    setStep(1);
    setForm(INITIAL_FORM_STATE);
    setReferenceNumber("");
    setSubmitError(null);
    setIsSubmitting(false);
    onClose();
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
  const bookingTotal = formatWashTotal(calculateWashTotal(form));

  let footer: React.ReactNode = null;

  if (step === 1) {
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
      stepper={isTracking ? undefined : <RequestStepper currentStep={step} completedLineVariant="muted" labelVariant="normal" />}
      footer={footer}
    >
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

      {step === 4 && <DetailingWashBookingStatusStep form={form} />}
    </MemberRequestModalFrame>
  );
}
