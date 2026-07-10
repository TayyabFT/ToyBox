"use client";

import { useState } from "react";
import { RightArrow } from "@/components/common";
import { MemberRequestModalFrame } from "../shared/MemberRequestModalFrame";
import {
  memberRequestModalPrimaryButtonFullClass,
  memberRequestModalSecondaryButtonClass,
} from "../shared/memberRequestModal";
import { TransportDeliveryStepper } from "../transport-delivery/TransportDeliveryStepper";
import { VehicleSourcingConfirmedStep } from "./VehicleSourcingConfirmedStep";
import { VehicleSourcingDetailsForm } from "./VehicleSourcingDetailsForm";
import { VehicleSourcingReviewStep } from "./VehicleSourcingReviewStep";
import { VehicleSourcingTrackRequestStep } from "./VehicleSourcingTrackRequestStep";
import type { VehicleSourcingDetailsFormState } from "./types";

const INITIAL_FORM_STATE: VehicleSourcingDetailsFormState = {
  make: "Porsche",
  model: "GT2 RS",
  category: "sports-car",
  yearFrom: "2021",
  yearTo: "2024",
  budget: "1m-2m",
  preferredColour: "Guards Red or Arctic Silver",
  keySpecifications: ["weissach-package", "single-owner"],
  condition: "new-nearly-new",
  timeline: "1-3-months",
  additionalNotes:
    "Open to importing from Europe or UK. Prefer documented UK or German car. No accident history.",
};

type VehicleSourcingModalProps = {
  open: boolean;
  onClose: () => void;
};

export function VehicleSourcingModal({ open, onClose }: VehicleSourcingModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<VehicleSourcingDetailsFormState>(INITIAL_FORM_STATE);

  const isReview = step === 2;
  const isConfirmed = step === 3;
  const isTracking = step === 4;

  function handleChange(patch: Partial<VehicleSourcingDetailsFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function handleClose() {
    setStep(1);
    setForm(INITIAL_FORM_STATE);
    onClose();
  }

  function handleEditBrief() {
    setStep(1);
  }

  function handleContinueToReview() {
    setStep(2);
  }

  function handleSubmitBrief() {
    setStep(3);
  }

  function handleTrackRequest() {
    setStep(4);
  }

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
        <button
          type="button"
          onClick={handleSubmitBrief}
          className={`${memberRequestModalPrimaryButtonFullClass} gap-2 uppercase`}
        >
          Submit Brief
          <RightArrow className="shrink-0" />
        </button>
        <button
          type="button"
          onClick={handleEditBrief}
          className={`${memberRequestModalSecondaryButtonClass} w-full flex-none text-primary`}
        >
          Edit Brief
        </button>
      </div>
    );
  } else if (step === 3) {
    footer = (
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleTrackRequest}
          className={`${memberRequestModalPrimaryButtonFullClass} uppercase`}
        >
          Track this request
        </button>
        <button
          type="button"
          onClick={handleClose}
          className={`${memberRequestModalSecondaryButtonClass} w-full flex-none text-primary`}
        >
          Back To Sourcing
        </button>
      </div>
    );
  } else if (step === 4) {
    footer = (
      <button
        type="button"
        onClick={handleClose}
        className={`${memberRequestModalSecondaryButtonClass} w-full flex-none text-primary`}
      >
        Cancel Request
      </button>
    );
  }

  return (
    <MemberRequestModalFrame
      open={open}
      onClose={handleClose}
      garageLabel={isTracking ? undefined : isConfirmed ? "Garage." : "Garage"}
      titleBefore={
        isTracking
          ? "Request "
          : isReview
            ? "Review "
            : isConfirmed
              ? "Review "
              : "Vehicle "
      }
      titleAfter={
        isTracking
          ? "Detail"
          : isReview
            ? "Brief"
            : isConfirmed
              ? "Request"
              : "Sourcing"
      }
      stepper={isTracking ? undefined : <TransportDeliveryStepper currentStep={step} />}
      footer={footer}
    >
      {step === 1 && (
        <VehicleSourcingDetailsForm value={form} onChange={handleChange} />
      )}

      {step === 2 && <VehicleSourcingReviewStep form={form} />}

      {step === 3 && <VehicleSourcingConfirmedStep form={form} />}

      {step === 4 && <VehicleSourcingTrackRequestStep form={form} />}
    </MemberRequestModalFrame>
  );
}
