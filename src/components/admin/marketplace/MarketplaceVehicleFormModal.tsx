"use client";

import { useEffect, useState } from "react";
import { Dropdown } from "@/components/common/Dropdown";
import { Input } from "@/components/common/Input";
import { RightArrow } from "@/components/common/Svgs";
import { DocsStep } from "@/components/staff/vehicles/add-vehicle/DocsStep";
import { HealthStep } from "@/components/staff/vehicles/add-vehicle/HealthStep";
import { OwnershipInfoStep } from "@/components/staff/vehicles/add-vehicle/OwnershipInfoStep";
import { VehicleInfoStep } from "@/components/staff/vehicles/add-vehicle/VehicleInfoStep";
import {
  stepHasErrors,
  validateAddVehicleStep,
  validateDocsStep,
  validateHealthStep,
  validateOwnershipInfoStep,
  validateVehicleInfoStep,
  type AddVehicleStepErrors,
} from "@/lib/addVehicleValidation";
import {
  createInitialMarketplaceVehicleForm,
  marketplaceVehicleToWizardForm,
  type MarketplaceVehicleWizardForm,
} from "@/lib/adminMarketplace";
import type { MarketplaceVehicleItem } from "./types";

type MarketplaceVehicleFormModalProps = {
  open: boolean;
  vehicle?: MarketplaceVehicleItem | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (form: MarketplaceVehicleWizardForm) => void;
};

const MARKETPLACE_STEPS = [
  { id: 1, label: "Vehicle" },
  { id: 2, label: "Ownership" },
  { id: 3, label: "Docs" },
  { id: 4, label: "Health" },
  { id: 5, label: "Listing" },
] as const;

const STATUS_OPTIONS = [
  { label: "AVAILABLE", value: "AVAILABLE" },
  { label: "RESERVED", value: "RESERVED" },
  { label: "SOLD", value: "SOLD" },
];

type ListingErrors = {
  fuelType?: string;
  price?: string;
  discount?: string;
  status?: string;
};

function validateListingStep(form: MarketplaceVehicleWizardForm): ListingErrors {
  const errors: ListingErrors = {};

  if (!form.fuelType.trim()) {
    errors.fuelType = "Fuel type is required";
  }

  if (!form.price.trim()) {
    errors.price = "Price is required";
  } else {
    const price = Number(form.price);

    if (Number.isNaN(price) || price < 0) {
      errors.price = "Enter a valid price";
    }
  }

  if (form.discount.trim()) {
    const discount = Number(form.discount);

    if (Number.isNaN(discount) || discount < 0) {
      errors.discount = "Enter a valid discount";
    } else if (
      form.price.trim() &&
      !Number.isNaN(Number(form.price)) &&
      discount > Number(form.price)
    ) {
      errors.discount = "Discount cannot exceed price";
    }
  }

  if (!form.status.trim()) {
    errors.status = "Status is required";
  }

  return errors;
}

function listingHasErrors(errors: ListingErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function MarketplaceVehicleFormModal({
  open,
  vehicle = null,
  submitting = false,
  onClose,
  onSubmit,
}: MarketplaceVehicleFormModalProps) {
  const isEdit = Boolean(vehicle);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<MarketplaceVehicleWizardForm>(
    createInitialMarketplaceVehicleForm(),
  );
  const [errors, setErrors] = useState<AddVehicleStepErrors>({});
  const [listingErrors, setListingErrors] = useState<ListingErrors>({});

  useEffect(() => {
    if (!open) return;

    setStep(1);
    setErrors({});
    setListingErrors({});
    setForm(
      vehicle
        ? marketplaceVehicleToWizardForm(vehicle)
        : createInitialMarketplaceVehicleForm(),
    );
  }, [open, vehicle]);

  if (!open) return null;

  function validateCurrentStep(): boolean {
    if (step === 5) {
      const next = validateListingStep(form);
      setListingErrors(next);
      return !listingHasErrors(next);
    }

    if (step === 1) {
      const vehicleInfoErrors = validateVehicleInfoStep(form.vehicleInfo);

      if (
        isEdit &&
        form.existingImageUrls.length > 0 &&
        form.vehicleInfo.vehicleImages.length === 0
      ) {
        delete vehicleInfoErrors.vehicleImages;
      }

      setErrors((current) => ({ ...current, vehicleInfo: vehicleInfoErrors }));
      return !Object.values(vehicleInfoErrors).some(Boolean);
    }

    if (step === 3 && isEdit) {
      // Docs already on listing — new uploads optional on edit.
      setErrors((current) => ({ ...current, docs: undefined }));
      return true;
    }

    const stepErrors = validateAddVehicleStep(step, form);
    setErrors((current) => ({ ...current, ...stepErrors }));
    return !stepHasErrors(step, stepErrors);
  }

  function handleBack() {
    if (submitting || step <= 1) return;
    setStep((current) => current - 1);
  }

  function handleNext() {
    if (!validateCurrentStep()) return;

    if (step < 5) {
      setStep((current) => current + 1);
      return;
    }

    const vehicleInfoErrors = validateVehicleInfoStep(form.vehicleInfo);

    if (
      isEdit &&
      form.existingImageUrls.length > 0 &&
      form.vehicleInfo.vehicleImages.length === 0
    ) {
      delete vehicleInfoErrors.vehicleImages;
    }

    const ownershipErrors = validateOwnershipInfoStep(form.ownershipInfo);
    const docsErrors = isEdit ? {} : validateDocsStep(form.docs);
    const healthErrors = validateHealthStep(form.health);
    const listing = validateListingStep(form);

    setErrors({
      vehicleInfo: vehicleInfoErrors,
      ownershipInfo: ownershipErrors,
      docs: docsErrors,
      health: healthErrors,
    });
    setListingErrors(listing);

    if (
      Object.values(vehicleInfoErrors).some(Boolean) ||
      Object.values(ownershipErrors).some(Boolean) ||
      Object.values(docsErrors).some(Boolean) ||
      Object.values(healthErrors).some(Boolean) ||
      listingHasErrors(listing)
    ) {
      return;
    }

    onSubmit(form);
  }

  const stepTitle = MARKETPLACE_STEPS[step - 1]?.label ?? "Marketplace Vehicle";
  const actionLabel =
    step === 1 ? "Next" : step === 5 ? (isEdit ? "Save Changes" : "Create Vehicle") : "Continue";
  const previewFinal = Math.max(
    0,
    Number(form.price || 0) - Number(form.discount || 0),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="admin-modal-panel relative z-10 flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[28px] border border-accent/20 shadow-[var(--shadow-modal)]">
        <div className="relative shrink-0 border-b border-accent/10 px-6 pb-5 pt-6">
          <h2 className="mb-2 text-center font-copperplate text-[18px] tracking-[0.06em] text-foreground uppercase">
            {isEdit ? "Edit Vehicle" : "Add Vehicle"}
          </h2>
          <p className="mb-6 text-center font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
            {stepTitle}
          </p>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="absolute right-5 top-5 cursor-pointer text-secondary transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="flex items-center">
            {MARKETPLACE_STEPS.map((item, index) => {
              const stepNumber = index + 1;
              const isReached = stepNumber <= step;
              const isLast = index === MARKETPLACE_STEPS.length - 1;

              return (
                <div
                  key={item.id}
                  className={`flex items-center ${isLast ? "" : "min-w-0 flex-1"}`}
                >
                  <div className="flex shrink-0 flex-col items-center">
                    <span
                      className={`flex size-8 items-center justify-center rounded-full text-[10px] font-semibold ${
                        isReached
                          ? "admin-gold-cta text-white"
                          : "border border-accent/40 bg-transparent text-accent"
                      }`}
                    >
                      {stepNumber}
                    </span>
                  </div>
                  {!isLast && (
                    <span
                      className={`h-px min-w-0 flex-1 ${
                        stepNumber < step ? "bg-accent" : "bg-accent/20"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="Custom__Scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {step === 1 && (
            <>
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

              {isEdit && form.existingImageUrls.length > 0 ? (
                <div className="space-y-2">
                  <p className="font-roboto text-[11px] tracking-[0.04em] text-foreground">
                    Current Images
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {form.existingImageUrls.map((url) => (
                      <div
                        key={url}
                        className="aspect-square overflow-hidden rounded-lg border border-accent/15 bg-input-muted"
                      >
                        <img
                          src={url}
                          alt="Current vehicle"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="font-roboto text-[10px] text-secondary">
                    Upload new images below to replace / add more.
                  </p>
                </div>
              ) : null}
            </>
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
            <>
              {isEdit ? (
                <p className="font-roboto text-[11px] text-secondary">
                  Documents are optional on edit. Upload only if you want to replace them.
                </p>
              ) : null}
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
            </>
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

          {step === 5 && (
            <div className="space-y-4">
              <Input
                label="Fuel Type"
                value={form.fuelType}
                onChange={(event) => {
                  setForm((current) => ({
                    ...current,
                    fuelType: event.target.value,
                  }));
                  setListingErrors((current) => ({
                    ...current,
                    fuelType: undefined,
                  }));
                }}
                placeholder="Petrol"
                error={listingErrors.fuelType}
              />

              <Input
                label="Price"
                type="number"
                min={0}
                value={form.price}
                onChange={(event) => {
                  setForm((current) => ({
                    ...current,
                    price: event.target.value,
                  }));
                  setListingErrors((current) => ({
                    ...current,
                    price: undefined,
                  }));
                }}
                placeholder="500000"
                error={listingErrors.price}
              />

              <Input
                label="Discount"
                type="number"
                min={0}
                value={form.discount}
                onChange={(event) => {
                  setForm((current) => ({
                    ...current,
                    discount: event.target.value,
                  }));
                  setListingErrors((current) => ({
                    ...current,
                    discount: undefined,
                  }));
                }}
                placeholder="25000"
                error={listingErrors.discount}
              />

              <Dropdown
                label="Status"
                options={STATUS_OPTIONS}
                value={form.status}
                onChange={(value) => {
                  setForm((current) => ({ ...current, status: value }));
                  setListingErrors((current) => ({
                    ...current,
                    status: undefined,
                  }));
                }}
                placeholder="Select status"
                error={listingErrors.status}
              />

              <p className="font-roboto text-[11px] tracking-[0.06em] text-accent uppercase">
                Final price · AED {previewFinal.toLocaleString("en-US")}
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-accent/10 px-6 py-5">
          {step > 1 ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className="font-roboto flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-accent/25 bg-input-muted py-4 text-sm font-bold tracking-[0.08em] text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RightArrow className="shrink-0 rotate-180" />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="admin-gold-cta font-roboto flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold tracking-[0.08em] uppercase disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? isEdit
                    ? "Saving..."
                    : "Creating..."
                  : actionLabel}
                {!submitting && step < 5 ? (
                  <RightArrow className="shrink-0" />
                ) : null}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="admin-gold-cta font-roboto flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold tracking-[0.08em] uppercase disabled:cursor-not-allowed disabled:opacity-60"
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
