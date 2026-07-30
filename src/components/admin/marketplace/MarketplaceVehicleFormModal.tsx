"use client";

import { useEffect, useState } from "react";
import { Dropdown } from "@/components/common/Dropdown";
import { Input } from "@/components/common/Input";
import { buildMarketplaceVehicleBody } from "@/lib/adminMarketplace";
import type {
  MarketplaceVehicleFormState,
  MarketplaceVehicleItem,
} from "./types";
import { EMPTY_MARKETPLACE_VEHICLE_FORM } from "./types";

type MarketplaceVehicleFormModalProps = {
  open: boolean;
  vehicle?: MarketplaceVehicleItem | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (body: ReturnType<typeof buildMarketplaceVehicleBody>) => void;
};

type FormErrors = Partial<Record<keyof MarketplaceVehicleFormState, string>>;

const STATUS_OPTIONS = [
  { label: "AVAILABLE", value: "AVAILABLE" },
  { label: "RESERVED", value: "RESERVED" },
  { label: "SOLD", value: "SOLD" },
];

const MIN_YEAR = 1900;
const MAX_YEAR = new Date().getFullYear() + 1;

function vehicleToForm(
  vehicle: MarketplaceVehicleItem,
): MarketplaceVehicleFormState {
  return {
    title: vehicle.title,
    description: vehicle.description,
    make: vehicle.make,
    model: vehicle.model,
    variant: vehicle.variant,
    year: vehicle.year ? String(vehicle.year) : "",
    color: vehicle.color,
    mileage: vehicle.mileage ? String(vehicle.mileage) : "",
    vin: vehicle.vin,
    transmission: vehicle.transmission,
    fuelType: vehicle.fuelType,
    imagesText: vehicle.images.join("\n"),
    price: String(vehicle.price || ""),
    discount: String(vehicle.discount || 0),
    status: vehicle.status || "AVAILABLE",
  };
}

function validateForm(form: MarketplaceVehicleFormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!form.make.trim()) {
    errors.make = "Make is required.";
  }

  if (!form.model.trim()) {
    errors.model = "Model is required.";
  }

  if (!form.year.trim()) {
    errors.year = "Year is required.";
  } else {
    const year = Number(form.year);

    if (!Number.isInteger(year)) {
      errors.year = "Year must be a whole number.";
    } else if (year < MIN_YEAR) {
      errors.year = `Year must be ${MIN_YEAR} or later.`;
    } else if (year > MAX_YEAR) {
      errors.year = `Year cannot be later than ${MAX_YEAR}.`;
    }
  }

  if (!form.price.trim()) {
    errors.price = "Price is required.";
  } else {
    const price = Number(form.price);

    if (Number.isNaN(price) || price < 0) {
      errors.price = "Enter a valid price.";
    }
  }

  if (form.discount.trim()) {
    const discount = Number(form.discount);

    if (Number.isNaN(discount) || discount < 0) {
      errors.discount = "Enter a valid discount.";
    } else if (
      form.price.trim() &&
      !Number.isNaN(Number(form.price)) &&
      discount > Number(form.price)
    ) {
      errors.discount = "Discount cannot exceed price.";
    }
  }

  if (form.mileage.trim()) {
    const mileage = Number(form.mileage);

    if (Number.isNaN(mileage) || mileage < 0) {
      errors.mileage = "Enter a valid mileage.";
    }
  }

  if (!form.status.trim()) {
    errors.status = "Status is required.";
  }

  return errors;
}

export function MarketplaceVehicleFormModal({
  open,
  vehicle = null,
  submitting = false,
  onClose,
  onSubmit,
}: MarketplaceVehicleFormModalProps) {
  const [form, setForm] = useState<MarketplaceVehicleFormState>(
    EMPTY_MARKETPLACE_VEHICLE_FORM,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const isEdit = Boolean(vehicle);

  useEffect(() => {
    if (!open) return;

    setErrors({});
    setSubmitted(false);
    setForm(vehicle ? vehicleToForm(vehicle) : EMPTY_MARKETPLACE_VEHICLE_FORM);
  }, [open, vehicle]);

  if (!open) return null;

  function updateField<K extends keyof MarketplaceVehicleFormState>(
    key: K,
    value: MarketplaceVehicleFormState[K],
  ) {
    const updated = { ...form, [key]: value };
    setForm(updated);

    if (submitted) {
      const nextErrors = validateForm(updated);
      setErrors((current) => ({ ...current, [key]: nextErrors[key] }));
    }
  }

  function handleSubmit() {
    setSubmitted(true);

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit(buildMarketplaceVehicleBody(form));
  }

  const previewFinal = Math.max(
    0,
    Number(form.price || 0) - Number(form.discount || 0),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="admin-modal-panel relative z-10 flex max-h-[92vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[28px] border border-accent/20 shadow-[var(--shadow-modal)]">
        <div className="shrink-0 border-b border-accent/10 px-6 py-5">
          <h2 className="font-copperplate text-[18px] tracking-[0.06em] text-foreground uppercase">
            {isEdit ? "Edit Vehicle" : "Add Vehicle"}
          </h2>
          <p className="font-roboto mt-1 text-[10px] tracking-[0.1em] text-secondary uppercase">
            Final price = price − discount
          </p>
        </div>

        <div className="Custom__Scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <Input
            label="Title"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Ferrari 296 GTB"
            error={errors.title}
          />

          <div className="space-y-2">
            <label className="font-roboto block text-[11px] tracking-[0.04em] text-foreground">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={3}
              className="font-roboto w-full resize-none rounded-xl border border-accent/15 bg-input-muted px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-secondary/80 focus:border-accent/35"
              placeholder="Listing description"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Make"
              value={form.make}
              onChange={(event) => updateField("make", event.target.value)}
              placeholder="Ferrari"
              error={errors.make}
            />
            <Input
              label="Model"
              value={form.model}
              onChange={(event) => updateField("model", event.target.value)}
              placeholder="296"
              error={errors.model}
            />
            <Input
              label="Variant"
              value={form.variant}
              onChange={(event) => updateField("variant", event.target.value)}
              placeholder="GTB"
            />
            <Input
              label="Year"
              type="number"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={form.year}
              onChange={(event) => updateField("year", event.target.value)}
              placeholder="2024"
              error={errors.year}
            />
            <Input
              label="Color"
              value={form.color}
              onChange={(event) => updateField("color", event.target.value)}
              placeholder="Rosso Corsa"
            />
            <Input
              label="Mileage"
              type="number"
              min={0}
              value={form.mileage}
              onChange={(event) => updateField("mileage", event.target.value)}
              placeholder="8150"
              error={errors.mileage}
            />
            <Input
              label="VIN"
              value={form.vin}
              onChange={(event) => updateField("vin", event.target.value)}
              placeholder="ZFF92LLA4R0312345"
            />
            <Input
              label="Transmission"
              value={form.transmission}
              onChange={(event) =>
                updateField("transmission", event.target.value)
              }
              placeholder="Automatic"
            />
            <Input
              label="Fuel Type"
              value={form.fuelType}
              onChange={(event) => updateField("fuelType", event.target.value)}
              placeholder="Petrol"
            />
            <Dropdown
              label="Status"
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(value) => updateField("status", value)}
              placeholder="Select status"
              error={errors.status}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Price"
              type="number"
              min={0}
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="1200000"
              error={errors.price}
            />
            <Input
              label="Discount"
              type="number"
              min={0}
              value={form.discount}
              onChange={(event) => updateField("discount", event.target.value)}
              placeholder="50000"
              error={errors.discount}
            />
          </div>

          <p className="font-roboto text-[11px] tracking-[0.06em] text-accent uppercase">
            Final price preview · AED {previewFinal.toLocaleString("en-US")}
          </p>

          <div className="space-y-2">
            <label className="font-roboto block text-[11px] tracking-[0.04em] text-foreground">
              Image URLs
            </label>
            <textarea
              value={form.imagesText}
              onChange={(event) =>
                updateField("imagesText", event.target.value)
              }
              rows={3}
              className="font-roboto w-full resize-none rounded-xl border border-accent/15 bg-input-muted px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-secondary/80 focus:border-accent/35"
              placeholder={"One URL per line\nhttps://..."}
            />
          </div>
        </div>

        <div className="flex shrink-0 gap-3 border-t border-accent/10 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="font-roboto flex flex-1 cursor-pointer items-center justify-center rounded-2xl border border-accent/25 bg-input-muted py-4 text-sm font-bold tracking-[0.08em] text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="admin-gold-cta font-roboto flex flex-1 cursor-pointer items-center justify-center rounded-2xl py-4 text-sm font-bold tracking-[0.08em] uppercase disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save Changes"
                : "Create Vehicle"}
          </button>
        </div>
      </div>
    </div>
  );
}
