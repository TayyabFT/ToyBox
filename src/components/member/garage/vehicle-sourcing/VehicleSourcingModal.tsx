"use client";

import { useState } from "react";
import { authApi } from "@/api/auth.api";
import { memberSourcingApi } from "@/api/memberSourcing.api";
import {
  buildSourcingRequestBody,
  resolveSourcingReferenceNumber,
  resolveSourcingRequestId,
  resolveSourcingSubmittedDate,
} from "@/lib/memberSourcing";
import { RightArrow } from "@/components/common";
import { MemberRequestModalFrame } from "../shared/MemberRequestModalFrame";
import {
  memberRequestModalPrimaryButtonClass,
  memberRequestModalPrimaryButtonFullClass,
  memberRequestModalSecondaryButtonClass,
} from "../shared/memberRequestModal";
import { RequestStepper } from "../shared/RequestStepper";
import { VehicleSourcingConfirmedStep } from "./VehicleSourcingConfirmedStep";
import { VehicleSourcingDetailsForm } from "./VehicleSourcingDetailsForm";
import { VehicleSourcingLandingStep } from "./VehicleSourcingLandingStep";
import { VehicleSourcingReviewStep } from "./VehicleSourcingReviewStep";
import { VehicleSourcingTrackRequestStep } from "./VehicleSourcingTrackRequestStep";
import type { VehicleSourcingDetailsFormState } from "./types";

// Steps:
//  0 = landing (history + new request CTA)
//  1 = details form
//  2 = review brief
//  3 = confirmed
//  4 = track request

const BASE_FORM_STATE: VehicleSourcingDetailsFormState = {
  make: "",
  model: "",
  category: "sports-car",
  yearFrom: "",
  yearTo: "",
  budget: "1m-2m",
  preferredColour: "",
  keySpecifications: [],
  condition: "new-nearly-new",
  timeline: "1-3-months",
  additionalNotes: "",
};

type VehicleSourcingModalProps = {
  open: boolean;
  onClose: () => void;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleColour?: string;
};

type SubmitResult = {
  referenceNumber: string;
  requestId: string | null;
  submittedDate: string;
};

function buildInitialFormState(
  make?: string,
  model?: string,
  year?: string,
  colour?: string,
): VehicleSourcingDetailsFormState {
  return {
    ...BASE_FORM_STATE,
    make: make?.trim() ?? "",
    model: model?.trim() ?? "",
    yearFrom: year ?? "",
    yearTo: year ?? "",
    preferredColour: colour?.trim() ?? "",
  };
}

export function VehicleSourcingModal({
  open,
  onClose,
  vehicleMake,
  vehicleModel,
  vehicleYear,
  vehicleColour,
}: VehicleSourcingModalProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<VehicleSourcingDetailsFormState>(() =>
    buildInitialFormState(vehicleMake, vehicleModel, vehicleYear, vehicleColour),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  const isLanding  = step === 0;
  const isReview   = step === 2;
  const isConfirmed = step === 3;
  const isTracking  = step === 4;

  function handleChange(patch: Partial<VehicleSourcingDetailsFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function handleClose() {
    setStep(0);
    setForm(buildInitialFormState(vehicleMake, vehicleModel, vehicleYear, vehicleColour));
    setSubmitError(null);
    setIsSubmitting(false);
    setSubmitResult(null);
    onClose();
  }

  function handleNewRequest() {
    setForm(buildInitialFormState(vehicleMake, vehicleModel, vehicleYear, vehicleColour));
    setSubmitError(null);
    setStep(1);
  }

  function handleEditBrief() {
    setSubmitError(null);
    setStep(1);
  }

  function handleContinueToReview() {
    setSubmitError(null);
    setStep(2);
  }

  async function handleSubmitBrief() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const profile = await authApi.getProfile();
      const memberId = profile.data.id;

      if (!memberId) {
        throw new Error("Unable to resolve member profile.");
      }

      const response = await memberSourcingApi.createRequest(
        buildSourcingRequestBody(memberId, form),
      );

      setSubmitResult({
        referenceNumber: resolveSourcingReferenceNumber(response.data),
        requestId: resolveSourcingRequestId(response.data),
        submittedDate: resolveSourcingSubmittedDate(response.data),
      });
      setStep(3);
    } catch (error) {
      setSubmitError(
        (error as { message?: string }).message ??
          "Failed to submit sourcing request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleTrackRequest() {
    setStep(4);
  }

  // ── Footer ──────────────────────────────────────────────────────────────────

  let footer: React.ReactNode = null;

  if (step === 0) {
    footer = (
      <button
        type="button"
        onClick={handleNewRequest}
        className={`${memberRequestModalPrimaryButtonFullClass} gap-2 uppercase`}
      >
        + New Sourcing Request
      </button>
    );
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

        <button
          type="button"
          onClick={handleSubmitBrief}
          disabled={isSubmitting}
          className={`${memberRequestModalPrimaryButtonFullClass} gap-2 uppercase`}
        >
          {isSubmitting ? "Submitting..." : "Submit Brief"}
          {!isSubmitting && <RightArrow className="shrink-0" />}
        </button>
        <button
          type="button"
          onClick={handleEditBrief}
          disabled={isSubmitting}
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

  // ── Header labels ───────────────────────────────────────────────────────────

  const titleBefore = isTracking
    ? "Request "
    : isReview
      ? "Review "
      : isConfirmed
        ? "Review "
        : "Vehicle ";

  const titleAfter = isTracking
    ? "Detail"
    : isReview
      ? "Brief"
      : isConfirmed
        ? "Request"
        : "Sourcing";

  return (
    <MemberRequestModalFrame
      open={open}
      onClose={handleClose}
      garageLabel={isTracking ? undefined : isConfirmed ? "Garage." : "Garage"}
      titleBefore={titleBefore}
      titleAfter={titleAfter}
      stepper={
        isLanding || isTracking
          ? undefined
          : <RequestStepper currentStep={step - 1} />
      }
      footer={footer}
    >
      {step === 0 && (
        <VehicleSourcingLandingStep onNewRequest={handleNewRequest} />
      )}

      {step === 1 && (
        <VehicleSourcingDetailsForm value={form} onChange={handleChange} />
      )}

      {step === 2 && <VehicleSourcingReviewStep form={form} />}

      {step === 3 && (
        <VehicleSourcingConfirmedStep
          form={form}
          referenceNumber={submitResult?.referenceNumber ?? ""}
          submittedDate={submitResult?.submittedDate}
        />
      )}

      {step === 4 && (
        <VehicleSourcingTrackRequestStep
          form={form}
          requestId={submitResult?.requestId ?? null}
          referenceNumber={submitResult?.referenceNumber ?? ""}
          submittedDate={submitResult?.submittedDate ?? ""}
        />
      )}
    </MemberRequestModalFrame>
  );
}
