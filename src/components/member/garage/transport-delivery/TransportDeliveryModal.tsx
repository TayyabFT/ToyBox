"use client";

import { useState } from "react";
import { authApi } from "@/api/auth.api";
import { memberTransportApi } from "@/api/memberTransport.api";
import {
  buildMemberTransportRequestBody,
  resolveTransportRequestNumber,
} from "@/lib/memberTransport";
import { MemberRequestModalFrame } from "../shared/MemberRequestModalFrame";
import {
  memberRequestModalPrimaryButtonClass,
  memberRequestModalPrimaryButtonFullClass,
  memberRequestModalSecondaryButtonClass,
} from "../shared/memberRequestModal";
import { TransportDeliveryConfirmedStep } from "./TransportDeliveryConfirmedStep";
import {
  REQUEST_OPTIONS,
  TransportDeliveryDetailsForm,
} from "./TransportDeliveryDetailsForm";
import { TransportDeliveryReviewStep } from "./TransportDeliveryReviewStep";
import { TransportDeliveryStepper } from "./TransportDeliveryStepper";
import type { TransportDetailsFormState } from "./types";

const INITIAL_FORM_STATE: TransportDetailsFormState = {
  serviceType: "roadside",
  request: "pickup",
  address: "Dubai Marina, Tower 3",
  date: "1",
  timeWindow: "13:00 - 15:00",
  notes: "",
};

type TransportDeliveryModalProps = {
  vehicleId: string;
  vehicleName: string;
  open: boolean;
  onClose: () => void;
};

export function TransportDeliveryModal({
  vehicleId,
  vehicleName,
  open,
  onClose,
}: TransportDeliveryModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<TransportDetailsFormState>(INITIAL_FORM_STATE);
  const [requestNumber, setRequestNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(patch: Partial<TransportDetailsFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function handleClose() {
    setStep(1);
    setForm(INITIAL_FORM_STATE);
    setRequestNumber("");
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

      const response = await memberTransportApi.createRequest(
        buildMemberTransportRequestBody(memberId, vehicleId, form),
      );

      setRequestNumber(resolveTransportRequestNumber(response.data));
      setStep(3);
    } catch (error) {
      setSubmitError(
        (error as { message?: string }).message ??
          "Failed to submit transport request",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const requestLabel =
    REQUEST_OPTIONS.find((option) => option.key === form.request)?.label ?? "";

  let footer: React.ReactNode = null;

  if (step === 1) {
    footer = (
      <button
        type="button"
        onClick={handleContinueToReview}
        className={memberRequestModalPrimaryButtonFullClass}
      >
        Continue to review
      </button>
    );
  } else if (step === 2) {
    footer = (
      <div className="flex flex-col gap-3">
        {submitError ? (
          <p className="font-roboto text-center text-[12px] text-pink">{submitError}</p>
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
            className={memberRequestModalPrimaryButtonClass}
          >
            {isSubmitting ? "Submitting..." : "Confirm & Submit"}
          </button>
        </div>
      </div>
    );
  } else if (step === 3) {
    footer = (
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleEditRequest}
          className={memberRequestModalSecondaryButtonClass}
        >
          Edit Request
        </button>
        <button
          type="button"
          onClick={handleClose}
          className={memberRequestModalPrimaryButtonClass}
        >
          Back to Requests
        </button>
      </div>
    );
  }

  return (
    <MemberRequestModalFrame
      open={open}
      onClose={handleClose}
      garageLabel={`Garage . ${vehicleName}`}
      titleBefore="Transport & "
      titleAfter="Delivery"
      stepper={<TransportDeliveryStepper currentStep={step} />}
      footer={footer}
    >
      {step === 1 && (
        <TransportDeliveryDetailsForm value={form} onChange={handleChange} />
      )}

      {step === 2 && (
        <TransportDeliveryReviewStep
          vehicleName={vehicleName}
          requestLabel={requestLabel}
          form={form}
        />
      )}

      {step === 3 && (
        <TransportDeliveryConfirmedStep
          requestNumber={requestNumber}
          vehicleName={vehicleName}
          form={form}
        />
      )}
    </MemberRequestModalFrame>
  );
}
