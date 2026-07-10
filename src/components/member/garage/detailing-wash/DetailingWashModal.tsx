"use client";

import { useState } from "react";
import { RightArrow } from "@/components/common";
import { MemberRequestModalFrame } from "../shared/MemberRequestModalFrame";
import {
  memberRequestModalPrimaryButtonFullClass,
  memberRequestModalSecondaryButtonClass,
} from "../shared/memberRequestModal";
import { TransportDeliveryStepper } from "../transport-delivery/TransportDeliveryStepper";
import { DetailingWashBookingStatusStep } from "./DetailingWashBookingStatusStep";
import { DetailingWashConfirmedStep } from "./DetailingWashConfirmedStep";
import { DetailingWashDetailsForm } from "./DetailingWashDetailsForm";
import { DetailingWashReviewStep } from "./DetailingWashReviewStep";
import { calculateWashTotal, formatWashTotal } from "./washOptions";
import type { WashDetailsFormState } from "./types";

const INITIAL_FORM_STATE: WashDetailsFormState = {
  package: "full-detail",
  addOns: ["ceramic-coat"],
  date: "30",
  notes: "Wrap on rear bumper",
};

type DetailingWashModalProps = {
  vehicleId: string;
  vehicleName: string;
  open: boolean;
  onClose: () => void;
};

export function DetailingWashModal({
  vehicleName,
  open,
  onClose,
}: DetailingWashModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<WashDetailsFormState>(INITIAL_FORM_STATE);

  function handleChange(patch: Partial<WashDetailsFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function handleClose() {
    setStep(1);
    setForm(INITIAL_FORM_STATE);
    onClose();
  }

  function handleContinueToReview() {
    setStep(2);
  }

  function handleConfirmSubmit() {
    setStep(3);
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
      <button
        type="button"
        onClick={handleConfirmSubmit}
        className={`${memberRequestModalPrimaryButtonFullClass} gap-2 uppercase`}
      >
        Confirm &amp; Submit
        <RightArrow className="shrink-0" />
      </button>
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
      stepper={isTracking ? undefined : <TransportDeliveryStepper currentStep={step} />}
      footer={footer}
    >
      {step === 1 && (
        <DetailingWashDetailsForm value={form} onChange={handleChange} />
      )}

      {step === 2 && (
        <DetailingWashReviewStep vehicleName={vehicleName} form={form} />
      )}

      {step === 3 && (
        <DetailingWashConfirmedStep vehicleName={vehicleName} form={form} />
      )}

      {step === 4 && <DetailingWashBookingStatusStep form={form} />}
    </MemberRequestModalFrame>
  );
}
