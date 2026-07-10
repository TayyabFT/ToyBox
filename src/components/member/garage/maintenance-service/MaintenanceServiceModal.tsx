"use client";

import { useState } from "react";
import { RightArrow } from "@/components/common";
import { MemberRequestModalFrame } from "../shared/MemberRequestModalFrame";
import {
  memberRequestModalPrimaryButtonFullClass,
  memberRequestModalSecondaryButtonClass,
} from "../shared/memberRequestModal";
import { TransportDeliveryStepper } from "../transport-delivery/TransportDeliveryStepper";
import { MaintenanceServiceConfirmedStep } from "./MaintenanceServiceConfirmedStep";
import { MaintenanceServiceDetailsForm } from "./MaintenanceServiceDetailsForm";
import { MaintenanceServiceReviewStep } from "./MaintenanceServiceReviewStep";
import { MaintenanceServiceTrackRequestStep } from "./MaintenanceServiceTrackRequestStep";
import { resolveDefaultMaintenanceVehicle } from "./maintenanceOptions";
import type { MaintenanceDetailsFormState } from "./types";

type MaintenanceServiceModalProps = {
  vehicleId: string;
  open: boolean;
  onClose: () => void;
};

function createInitialFormState(vehicleId: string): MaintenanceDetailsFormState {
  return {
    vehicle: resolveDefaultMaintenanceVehicle(vehicleId),
    serviceType: "scheduled-annual",
    serviceCentre: "official-porsche",
    issueDescription:
      "Annual service due. Slight vibration at high speed noticed.",
    preferredDate: "may-1",
    preferredTime: "afternoon",
  };
}

export function MaintenanceServiceModal({
  vehicleId,
  open,
  onClose,
}: MaintenanceServiceModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<MaintenanceDetailsFormState>(() =>
    createInitialFormState(vehicleId),
  );

  const isTracking = step === 4;

  function handleChange(patch: Partial<MaintenanceDetailsFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function handleClose() {
    setStep(1);
    setForm(createInitialFormState(vehicleId));
    onClose();
  }

  function handleEditRequest() {
    setStep(1);
  }

  function handleContinueToReview() {
    setStep(2);
  }

  function handleConfirmSubmit() {
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
          onClick={handleConfirmSubmit}
          className={`${memberRequestModalPrimaryButtonFullClass} gap-2 uppercase`}
        >
          Confirm &amp; Submit
          <RightArrow className="shrink-0" />
        </button>
        <button
          type="button"
          onClick={handleEditRequest}
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
          onClick={handleTrackRequest}
          className={`${memberRequestModalPrimaryButtonFullClass} uppercase`}
        >
          Track this request
        </button>
        <button
          type="button"
          onClick={handleEditRequest}
          className={`${memberRequestModalSecondaryButtonClass} w-full flex-none text-primary`}
        >
          Edit Request
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
      garageLabel={isTracking ? undefined : "Garage"}
      headerSubtitle={
        isTracking ? "In progress · Service underway" : undefined
      }
      titleBefore={isTracking ? "Track " : "Maintenance & "}
      titleAfter={isTracking ? "Request" : "Service"}
      stepper={isTracking ? undefined : <TransportDeliveryStepper currentStep={step} />}
      footer={footer}
    >
      {step === 1 && (
        <MaintenanceServiceDetailsForm value={form} onChange={handleChange} />
      )}

      {step === 2 && <MaintenanceServiceReviewStep form={form} />}

      {step === 3 && <MaintenanceServiceConfirmedStep form={form} />}

      {step === 4 && <MaintenanceServiceTrackRequestStep form={form} />}
    </MemberRequestModalFrame>
  );
}
