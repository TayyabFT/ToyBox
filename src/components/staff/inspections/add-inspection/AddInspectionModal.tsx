"use client";

import { useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/api/auth.api";
import { membersApi } from "@/api/members.api";
import { staffApi } from "@/api/staff.api";
import { vehiclesApi } from "@/api/vehicles.api";
import { ChevronDown } from "@/components/common/Svgs";
import { mapMembersDirectory } from "@/lib/members";
import { mapStaffDirectory } from "@/lib/staff";
import { showError } from "@/lib/toast";
import {
  buildCreateInspectionBody,
  hasAddInspectionErrors,
  resolveInspectionType,
  validateAddInspectionForm,
  type AddInspectionFieldErrors,
  type CreateInspectionResult,
} from "@/lib/addInspectionValidation";
import { mapOfferVehicleOptions, indexInventoryVehicles } from "@/lib/vehicles";
import type { StaffInspectionCreateRequest } from "@/types/api";
import {
  createInitialAddInspectionForm,
  FUEL_LEVEL_OPTIONS,
  INSPECTION_TYPE_OPTIONS,
  type AddInspectionFormState,
} from "./types";

type SelectOption = {
  id: string;
  label: string;
};

type AddInspectionModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (body: StaffInspectionCreateRequest) => Promise<CreateInspectionResult>;
};

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={`font-roboto block text-[10px] tracking-[0.12em] uppercase ${
          error ? "text-red-500" : "text-primary"
        }`}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="font-roboto text-[10px] text-red-500">{error}</p>
      ) : null}
    </div>
  );
}

const selectClass = (hasError: boolean) =>
  `font-roboto w-full cursor-pointer appearance-none rounded-xl border bg-dark px-4 py-3.5 pr-10 text-sm text-foreground outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-accent/20 focus:border-accent/40"
  }`;

const inputClass = (hasError: boolean) =>
  `font-roboto w-full rounded-xl border bg-dark px-4 py-3.5 text-sm text-foreground outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60 [color-scheme:dark] ${
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-accent/20 focus:border-accent/40"
  }`;

export function AddInspectionModal({
  open,
  onClose,
  onSubmit,
}: AddInspectionModalProps) {
  const [form, setForm] = useState<AddInspectionFormState>(
    createInitialAddInspectionForm(),
  );
  const [errors, setErrors] = useState<AddInspectionFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [vehicles, setVehicles] = useState<SelectOption[]>([]);
  const [members, setMembers] = useState<SelectOption[]>([]);
  const [staff, setStaff] = useState<SelectOption[]>([]);
  const [vehicleMembers, setVehicleMembers] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (!open) return;

    async function loadOptions() {
      setLoadingOptions(true);

      try {
        const [inventoryResponse, membersResponse, staffResponse, profileResponse] =
          await Promise.all([
            vehiclesApi.getInventory(),
            membersApi.getMembers({ limit: 100 }),
            staffApi.getStaff({ limit: 100 }),
            authApi.getProfile().catch(() => null),
          ]);

        const vehicleOptions = mapOfferVehicleOptions(inventoryResponse.data);
        const memberOptions = mapMembersDirectory(membersResponse.data).members.map(
          (member) => ({
            id: member.id,
            label: member.name,
          }),
        );
        const staffOptions = mapStaffDirectory(staffResponse.data).staff.map(
          (item) => ({
            id: item.id,
            label: item.name,
          }),
        );

        const membersByVehicle: Record<string, string> = {};
        const inventoryById = indexInventoryVehicles(inventoryResponse.data);

        for (const [vehicleId, item] of Object.entries(inventoryById)) {
          if (
            item.memberId !== undefined &&
            item.memberId !== null &&
            item.memberId !== ""
          ) {
            membersByVehicle[vehicleId] = String(item.memberId);
          }
        }

        setVehicles(vehicleOptions.map((item) => ({ id: item.id, label: item.name })));
        setMembers(memberOptions);
        setStaff(staffOptions);
        setVehicleMembers(membersByVehicle);

        const profileEmail = profileResponse?.data?.email?.trim().toLowerCase();
        const matchedStaff = profileEmail
          ? staffOptions.find(
              (item) =>
                staffResponse.data?.staff?.find(
                  (staffItem) =>
                    String(staffItem.id) === item.id &&
                    staffItem.email?.trim().toLowerCase() === profileEmail,
                ),
            )
          : undefined;

        setForm({
          ...createInitialAddInspectionForm(),
          vehicleId: vehicleOptions[0]?.id ?? "",
          memberId:
            (vehicleOptions[0]?.id
              ? membersByVehicle[vehicleOptions[0].id]
              : "") ||
            memberOptions[0]?.id ||
            "",
          assignedStaffId: matchedStaff?.id ?? staffOptions[0]?.id ?? "",
          inspectionType: "pre_service",
        });
        setErrors({});
      } catch (error) {
        const message =
          (error as { message?: string }).message ??
          "Failed to load inspection form options";

        showError(message);
        setVehicles([]);
        setMembers([]);
        setStaff([]);
      } finally {
        setLoadingOptions(false);
      }
    }

    void loadOptions();
  }, [open]);

  function resetAndClose() {
    if (submitting) return;

    setForm(createInitialAddInspectionForm());
    setErrors({});
    onClose();
  }

  function updateField<K extends keyof AddInspectionFormState>(
    key: K,
    value: AddInspectionFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handleVehicleChange(vehicleId: string) {
    const linkedMemberId = vehicleMembers[vehicleId];

    setForm((current) => ({
      ...current,
      vehicleId,
      memberId: linkedMemberId || current.memberId,
    }));
    setErrors((current) => ({
      ...current,
      vehicleId: undefined,
      memberId: linkedMemberId ? undefined : current.memberId,
    }));
  }

  async function handleSubmit() {
    const nextErrors = validateAddInspectionForm(form);

    if (hasAddInspectionErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    const body = buildCreateInspectionBody(form);

    if (!body) {
      setErrors(validateAddInspectionForm(form));
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const result = await onSubmit(body);

      if (!result.ok) {
        if (result.fieldErrors && hasAddInspectionErrors(result.fieldErrors)) {
          setErrors(result.fieldErrors);
        } else if (result.message) {
          showError(result.message);
        }

        return;
      }

      setForm(createInitialAddInspectionForm());
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[28px] border border-accent/20 bg-background shadow-[var(--shadow-modal)]">
        <div className="relative shrink-0 border-b border-accent/10 px-6 pb-5 pt-6">
          <p className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
            Inspections
          </p>
          <h2 className="mt-2 font-copperplate text-[22px] uppercase text-primary">
            Add Inspection
          </h2>
          <button
            type="button"
            onClick={resetAndClose}
            disabled={submitting}
            className="absolute right-5 top-5 cursor-pointer text-secondary transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="Custom__Scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <Field id="inspection-vehicle" label="Vehicle" error={errors.vehicleId}>
            <div className="relative">
              <select
                id="inspection-vehicle"
                value={form.vehicleId}
                disabled={loadingOptions || submitting}
                aria-invalid={Boolean(errors.vehicleId)}
                onChange={(event) => handleVehicleChange(event.target.value)}
                className={selectClass(Boolean(errors.vehicleId))}
              >
                <option value="">Select vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-secondary" />
            </div>
          </Field>

          <Field id="inspection-member" label="Member" error={errors.memberId}>
            <div className="relative">
              <select
                id="inspection-member"
                value={form.memberId}
                disabled={loadingOptions || submitting}
                aria-invalid={Boolean(errors.memberId)}
                onChange={(event) => updateField("memberId", event.target.value)}
                className={selectClass(Boolean(errors.memberId))}
              >
                <option value="">Select member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-secondary" />
            </div>
          </Field>

          <Field
            id="inspection-type"
            label="Inspection Type"
            error={errors.inspectionType}
          >
            <div className="relative">
              <select
                id="inspection-type"
                value={form.inspectionType}
                disabled={submitting}
                aria-invalid={Boolean(errors.inspectionType)}
                onChange={(event) => {
                  const nextType = resolveInspectionType(event.target.value);

                  if (nextType) {
                    updateField("inspectionType", nextType);
                  }
                }}
                className={selectClass(Boolean(errors.inspectionType))}
              >
                {INSPECTION_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-secondary" />
            </div>
          </Field>

          <Field
            id="inspection-scheduled-at"
            label="Scheduled At"
            error={errors.scheduledAt}
          >
            <input
              id="inspection-scheduled-at"
              type="datetime-local"
              value={form.scheduledAt}
              disabled={submitting}
              aria-invalid={Boolean(errors.scheduledAt)}
              onChange={(event) => updateField("scheduledAt", event.target.value)}
              className={inputClass(Boolean(errors.scheduledAt))}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="inspection-bay" label="Bay" error={errors.bay}>
              <input
                id="inspection-bay"
                type="text"
                value={form.bay}
                disabled={submitting}
                placeholder="A-02"
                aria-invalid={Boolean(errors.bay)}
                onChange={(event) => updateField("bay", event.target.value)}
                className={inputClass(Boolean(errors.bay))}
              />
            </Field>

            <Field
              id="inspection-staff"
              label="Assigned Staff"
              error={errors.assignedStaffId}
            >
              <div className="relative">
                <select
                  id="inspection-staff"
                  value={form.assignedStaffId}
                  disabled={loadingOptions || submitting}
                  aria-invalid={Boolean(errors.assignedStaffId)}
                  onChange={(event) =>
                    updateField("assignedStaffId", event.target.value)
                  }
                  className={selectClass(Boolean(errors.assignedStaffId))}
                >
                  <option value="">Select staff</option>
                  {staff.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-secondary" />
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="inspection-odometer" label="Odometer (km)" error={errors.odometerReading}>
              <input
                id="inspection-odometer"
                type="text"
                inputMode="numeric"
                value={form.odometerReading}
                disabled={submitting}
                placeholder="28890"
                aria-invalid={Boolean(errors.odometerReading)}
                onChange={(event) =>
                  updateField("odometerReading", event.target.value)
                }
                className={inputClass(Boolean(errors.odometerReading))}
              />
            </Field>

            <Field id="inspection-fuel" label="Fuel Level">
              <div className="relative">
                <select
                  id="inspection-fuel"
                  value={form.fuelLevel}
                  disabled={submitting}
                  onChange={(event) => updateField("fuelLevel", event.target.value)}
                  className={selectClass(false)}
                >
                  {FUEL_LEVEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-secondary" />
              </div>
            </Field>
          </div>
        </div>

        <div className="shrink-0 border-t border-accent/10 px-6 py-5">
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting || loadingOptions}
            className="font-roboto flex w-full cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-gold-bright to-primary py-4 text-sm font-bold tracking-[0.08em] text-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add Inspection"}
          </button>
        </div>
      </div>
    </div>
  );
}
