"use client";

import { useState } from "react";
import { vehiclesApi } from "@/api/vehicles.api";
import {
  stepHasErrors,
  validateAddVehicleForm,
  validateAddVehicleStep,
  type AddVehicleStepErrors,
} from "@/lib/addVehicleValidation";
import { showError, showSuccess } from "@/lib/toast";
import { useTheme } from "@/components/common/ThemeProvider";
import { AddVehicleStepper } from "./AddVehicleStepper";
import { VehicleInfoStep } from "./VehicleInfoStep";
import { OwnershipInfoStep } from "./OwnershipInfoStep";
import { DocsStep } from "./DocsStep";
import { HealthStep } from "./HealthStep";
import {
  ADD_VEHICLE_STEPS,
  createInitialAddVehicleForm,
  type AddVehicleFormState,
} from "./types";
import { RightArrow } from "@/components/common";

const LIGHT_PANEL_STYLE = {
  backgroundColor: "#D0C8BC",
} as const;

type AddVehicleModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
};

export function AddVehicleModal({
  open,
  onClose,
  onSuccess,
}: AddVehicleModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<AddVehicleStepErrors>({});
  const [form, setForm] = useState<AddVehicleFormState>(
    createInitialAddVehicleForm(),
  );

  function resetForm() {
    setStep(1);
    setErrors({});
    setForm(createInitialAddVehicleForm());
  }

  function handleClose() {
    if (submitting) return;

    resetForm();
    onClose();
  }

  function handleBack() {
    if (submitting || step <= 1) return;

    setErrors({});
    setStep((current) => current - 1);
  }

  function validateCurrentStep(): boolean {
    const stepErrors = validateAddVehicleStep(step, form);
    setErrors((current) => ({ ...current, ...stepErrors }));

    return !stepHasErrors(step, stepErrors);
  }

  async function handleNext() {
    if (!validateCurrentStep()) {
      return;
    }

    if (step < 4) {
      setErrors({});
      setStep((current) => current + 1);
      return;
    }

    const validationError = validateAddVehicleForm(form);

    if (validationError) {
      showError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const response = await vehiclesApi.addToInventory(form);

      showSuccess(response.message || "Vehicle added successfully");
      resetForm();
      onClose();
      await onSuccess?.();
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to add vehicle to inventory";

      showError(message);
    } finally {
      setSubmitting(false);
    }
  }

  const actionLabel =
    step === 1 ? "Next" : step === 4 ? "Submit" : "Continue";
  const stepTitle = ADD_VEHICLE_STEPS[step - 1]?.label ?? "Add Vehicle";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="admin-modal-panel relative z-10 flex max-h-[92vh] w-full max-w-[500px] flex-col overflow-hidden rounded-[28px] border border-accent/20 shadow-[var(--shadow-modal)]"
        style={isLight ? LIGHT_PANEL_STYLE : undefined}
      >
        <div className="relative shrink-0 border-b border-accent/10 px-6 pb-5 pt-6">
          <h2 className="mb-8 text-center text-[20px] text-primary">
            {stepTitle}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="absolute right-5 top-5 cursor-pointer text-secondary transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            ✕
          </button>

          <AddVehicleStepper currentStep={step} />
        </div>

        <div className="Custom__Scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {step === 1 && (
            <VehicleInfoStep
              value={form.vehicleInfo}
              errors={errors.vehicleInfo}
              onChange={(vehicleInfo) => {
                setForm((current) => ({ ...current, vehicleInfo }));
                setErrors((current) => ({
                  ...current,
                  vehicleInfo: undefined,
                }));
              }}
            />
          )}

          {step === 2 && (
            <OwnershipInfoStep
              value={form.ownershipInfo}
              errors={errors.ownershipInfo}
              onChange={(ownershipInfo) => {
                setForm((current) => ({ ...current, ownershipInfo }));
                setErrors((current) => ({
                  ...current,
                  ownershipInfo: undefined,
                }));
              }}
            />
          )}

          {step === 3 && (
            <DocsStep
              value={form.docs}
              errors={errors.docs}
              onChange={(docs) => {
                setForm((current) => ({ ...current, docs }));
                setErrors((current) => ({
                  ...current,
                  docs: undefined,
                }));
              }}
            />
          )}

          {step === 4 && (
            <HealthStep
              value={form.health}
              errors={errors.health}
              onChange={(health) => {
                setForm((current) => ({ ...current, health }));
                setErrors((current) => ({
                  ...current,
                  health: undefined,
                }));
              }}
            />
          )}
        </div>

        <div className="shrink-0 border-t border-accent/10 px-6 py-5">
          {step > 1 ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className="font-roboto flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-accent/25 bg-input-muted py-4 text-sm font-bold tracking-[0.08em] text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RightArrow className="shrink-0 rotate-180" />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="admin-gold-cta font-roboto flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : actionLabel}
                {!submitting && step < 4 && (
                  <RightArrow className="shrink-0" />
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="admin-gold-cta font-roboto flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-4 text-[13px] font-bold tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionLabel}
              <RightArrow className="shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
