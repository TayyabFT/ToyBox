"use client";

import { useState, useEffect, useRef } from "react";
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
import { ModalLoadingSkeleton } from "../shared/ModalLoadingSkeleton";
import type { MaintenanceDetailsFormState } from "./types";
import type { MemberMaintenanceRequestStatusData } from "@/types/api";

/** Statuses that mean the request is still active */
const ACTIVE_STATUSES = new Set([
  "request sent",
  "vehicle picked up",
  "service in progress",
  "awaiting approval",
  "ready for delivery",
]);

function isActiveStatus(status?: string): boolean {
  return ACTIVE_STATUSES.has((status ?? "").trim().toLowerCase());
}

type MaintenanceServiceModalProps = {
  vehicleId: string;
  open: boolean;
  onClose: () => void;
};

function createInitialFormState(vehicleId: string): MaintenanceDetailsFormState {
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

  // Active request state
  const [isCheckingActive, setIsCheckingActive] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<MemberMaintenanceRequestStatusData | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Track the vehicleId we already checked so we don't repeat on re-renders
  const checkedForRef = useRef<string | null>(null);

  const isTracking = step === 4;

  // ── Active request check ──────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    if (checkedForRef.current === vehicleId) return;

    async function checkActiveRequest() {
      setIsCheckingActive(true);
      try {
        const profile = await authApi.getProfile();
        const memberId = profile.data.id;
        if (!memberId) return;

        const listRes = await memberMaintenanceApi.getRequests(memberId);
        const requests = listRes.data.requests ?? [];

        // Find the most recent active request for this vehicle
        const active = requests.find(
          (r) =>
            String(r.vehicleId) === String(vehicleId) &&
            isActiveStatus(r.status),
        );

        if (active?.id) {
          const id = String(active.id);
          setActiveRequestId(id);

          // Fetch the live status timeline
          const statusRes = await memberMaintenanceApi.getStatus(id);
          setStatusData(statusRes.data);
          setStep(4); // Jump straight to Track Request
        }
      } catch {
        // Silently fall through — show the form as normal
      } finally {
        setIsCheckingActive(false);
        checkedForRef.current = vehicleId;
      }
    }

    void checkActiveRequest();
  }, [open, vehicleId]);

  // ── Reset on close ────────────────────────────────────────────────────────

  function handleClose() {
    setStep(1);
    setForm(createInitialFormState(vehicleId));
    setReferenceNumber("");
    setSubmitError(null);
    setIsSubmitting(false);
    setActiveRequestId(null);
    setStatusData(null);
    setIsCancelling(false);
    setCancelError(null);
    checkedForRef.current = null;
    onClose();
  }

  // ── Form navigation ───────────────────────────────────────────────────────

  function handleChange(patch: Partial<MaintenanceDetailsFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function handleEditRequest() {
    setSubmitError(null);
    setStep(1);
  }

  function handleContinueToReview() {
    setSubmitError(null);
    setStep(2);
  }

  // ── Submit ────────────────────────────────────────────────────────────────

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

  // ── Cancel request ────────────────────────────────────────────────────────

  async function handleCancelRequest() {
    if (!activeRequestId) {
      // No tracked request id — just close
      handleClose();
      return;
    }

    setIsCancelling(true);
    setCancelError(null);

    try {
      await memberMaintenanceApi.cancelRequest(activeRequestId);
      handleClose();
    } catch (err) {
      setCancelError(
        (err as { message?: string }).message ??
          "Failed to cancel request. Please try again.",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  // ── canCancel — respect the server's flag when available ─────────────────
  const canCancel = statusData?.canCancel !== false; // default true if unknown

  // ── Footer ────────────────────────────────────────────────────────────────

  let footer: React.ReactNode = null;

  if (isCheckingActive) {
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
      <div className="flex flex-col gap-2">
        {cancelError ? (
          <p className="font-roboto text-center text-[12px] text-pink">
            {cancelError}
          </p>
        ) : null}

        {canCancel ? (
          <button
            type="button"
            onClick={handleCancelRequest}
            disabled={isCancelling}
            className={`${memberRequestModalSecondaryButtonClass} w-full flex-none text-primary`}
          >
            {isCancelling ? "Cancelling…" : "Cancel Request"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleClose}
            className={`${memberRequestModalSecondaryButtonClass} w-full flex-none text-primary`}
          >
            Back to Requests
          </button>
        )}
      </div>
    );
  }

  return (
    <MemberRequestModalFrame
      open={open}
      onClose={handleClose}
      garageLabel={isTracking ? undefined : "Garage"}
      headerSubtitle={isTracking ? "In progress · Service underway" : undefined}
      titleBefore={isTracking ? "Track " : "Maintenance & "}
      titleAfter={isTracking ? "Request" : "Service"}
      stepper={
        isTracking
          ? undefined
          : isCheckingActive
            ? undefined
            : <RequestStepper currentStep={step} />
      }
      footer={footer}
    >
      {isCheckingActive ? (
        <ModalLoadingSkeleton />
      ) : (
        <>
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

          {step === 4 && (
            <MaintenanceServiceTrackRequestStep
              form={form}
              statusData={statusData}
            />
          )}
        </>
      )}
    </MemberRequestModalFrame>
  );
}
