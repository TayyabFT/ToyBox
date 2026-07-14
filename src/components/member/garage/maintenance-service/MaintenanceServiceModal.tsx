"use client";

import { useState } from "react";
import { authApi } from "@/api/auth.api";
import { memberMaintenanceApi } from "@/api/memberMaintenance.api";
import {
  buildMaintenanceRequestBody,
  resolveMaintenanceReferenceNumber,
} from "@/lib/memberMaintenance";
import { RightArrow } from "@/components/common";
import { MemberRequestModalFrame } from "../shared/MemberRequestModalFrame";
import {
  memberRequestModalPrimaryButtonClass,
  memberRequestModalPrimaryButtonFullClass,
  memberRequestModalSecondaryButtonClass,
} from "../shared/memberRequestModal";
import { RequestStepper } from "../shared/RequestStepper";
import { generateDateOptions } from "../shared/requestFormUi";
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
  // Use the first option from the dynamic generator (= today) as the default
  const dateOptions = generateDateOptions(4);
  const defaultDate = dateOptions[0]?.key ?? new Date().toISOString().slice(0, 10);

  return {
    vehicle: resolveDefaultMaintenanceVehicle(vehicleId),
    serviceType: "scheduled-annual",
    serviceCentre: "official-porsche",
    issueDescription: "",
    preferredDate: defaultDate,
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
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isTracking = step === 4;

  function handleChange(patch: Partial<MaintenanceDetailsFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function handleClose() {
    setStep(1);
    setForm(createInitialFormState(vehicleId));
    setReferenceNumber("");
    setSubmitError(null);
    setIsSubmitting(false);
    onClose();
  }

  function handleEditRequest() {
    setSubmitError(null);
    setStep(1);
  }

  function handleContinueToReview() {
    setSubmitError(null);
    setStep(2);
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

      const response = await memberMaintenanceApi.createRequest(
        buildMaintenanceRequestBody(memberId, vehicleId, form),
      );

      setReferenceNumber(resolveMaintenanceReferenceNumber(response.data));
      setStep(3);
    } catch (error) {
      setSubmitError(
        (error as { message?: string }).message ??
          "Failed to submit maintenance request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
          Back to Requests
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
      stepper={isTracking ? undefined : <RequestStepper currentStep={step} />}
      footer={footer}
    >
      {step === 1 && (
        <MaintenanceServiceDetailsForm value={form} onChange={handleChange} />
      )}

      {step === 2 && <MaintenanceServiceReviewStep form={form} />}

      {step === 3 && (
        <MaintenanceServiceConfirmedStep
          form={form}
          referenceNumber={referenceNumber}
        />
      )}

      {step === 4 && <MaintenanceServiceTrackRequestStep form={form} />}
    </MemberRequestModalFrame>
  );
}
