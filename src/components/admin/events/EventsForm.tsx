import React, { useState, useEffect, useRef, useCallback } from 'react';
import { eventsApi } from "@/api/events.api";
import type { CreateEventRequest, EventEligibilityConfig } from "@/types/api";
import { showError, showSuccess } from "@/lib/toast";
import { VehicleCalendar, ClockSmall } from "@/components/common/Svgs";

type FormEligibility = {
  enabled: boolean;
  requiresVehicle: boolean;
  vehicleFilters: {
    enabled: boolean;
    makes: string[];
  };
  joinDate: {
    enabled: boolean;
    mode: "relative" | "custom";
    relativeMonths: number;
    startDate: string;
    endDate: string;
  };
  designations: {
    enabled: boolean;
    tiers: string[];
  };
};

const DEFAULT_ELIGIBILITY: FormEligibility = {
  enabled: false,
  requiresVehicle: false,
  vehicleFilters: {
    enabled: false,
    makes: [],
  },
  joinDate: {
    enabled: false,
    mode: "relative",
    relativeMonths: 6,
    startDate: "",
    endDate: "",
  },
  designations: {
    enabled: false,
    tiers: [],
  },
};

const EMPTY_FORM = {
  title: "",
  category: "drives",
  description: "",
  location: "",
  startsAt: "",
  endsAt: "",
  isAllDay: false,
  imageUrl: "",
  isFeatured: true,
  capacity: 50,
  accessType: "open",
  eligibility: DEFAULT_ELIGIBILITY,
};

type FormErrors = Partial<Record<keyof typeof EMPTY_FORM, string>>;

function validate(data: typeof EMPTY_FORM): FormErrors {
  const errors: FormErrors = {};

  if (!data.title.trim()) {
    errors.title = "Event title is required.";
  } else if (data.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }

  if (!data.startsAt) {
    errors.startsAt = "Start date and time is required.";
  }

  if (!data.endsAt) {
    errors.endsAt = "End date and time is required.";
  } else if (data.startsAt && data.endsAt && new Date(data.endsAt) <= new Date(data.startsAt)) {
    errors.endsAt = "End time must be after start time.";
  }

  if (!data.location.trim()) {
    errors.location = "Location is required.";
  }

  if (!data.description.trim()) {
    errors.description = "Description is required.";
  } else if (data.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  const cap = Number(data.capacity);
  if (!data.capacity || isNaN(cap) || cap < 1) {
    errors.capacity = "Capacity must be at least 1.";
  } else if (cap > 10000) {
    errors.capacity = "Capacity cannot exceed 10,000.";
  }

  if (data.imageUrl && !/^https?:\/\/.+/.test(data.imageUrl.trim())) {
    errors.imageUrl = "Image URL must start with http:// or https://";
  }

  return errors;
}

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  eventId?: string | number;
  initialData?: Partial<Omit<typeof EMPTY_FORM, "eligibility">> & {
    status?: string;
    eligibility?: EventEligibilityConfig | null;
  };
}

// Small inline error message component
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[10px] text-pink tracking-wide mt-1 flex items-center gap-1">
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </p>
  );
}

// Returns the border class — pink when there's an error, default otherwise
function fieldClass(base: string, hasError: boolean) {
  return `${base} ${hasError ? "border-pink/60 focus:border-pink/80" : "border-[var(--overview-border)] focus:border-accent/40"}`;
}

// Splits a "YYYY-MM-DDTHH:mm" value into its date and time parts
function splitDateTime(value: string): { date: string; time: string } {
  const [date = "", time = ""] = value ? value.split("T") : [];
  return { date, time };
}

// Rejoins date + time parts into a "YYYY-MM-DDTHH:mm" value
function joinDateTime(date: string, time: string): string {
  if (!date) return "";
  return `${date}T${time || "00:00"}`;
}

// Same clickable-icon date picker used in the Offer a Vehicle modal
function ScheduleDateField({
  id,
  label,
  value,
  min,
  error,
  onChange,
  disabled = false,
}: {
  id: string;
  label: string;
  value: string;
  min?: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    if (disabled) return;
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[10px] font-bold tracking-widest text-secondary uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="date"
          value={value}
          min={min}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={fieldClass(
            "w-full cursor-pointer rounded-lg bg-input-muted px-4 py-3 pr-10 text-sm outline-none transition-all border [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
            Boolean(error),
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={openPicker}
          disabled={disabled}
          aria-label={`Select ${label} date`}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer disabled:cursor-not-allowed"
        >
          <VehicleCalendar />
        </button>
      </div>
    </div>
  );
}

// Same clickable-icon pattern as ScheduleDateField, adapted for time selection
function ScheduleTimeField({
  id,
  label,
  value,
  error,
  onChange,
  disabled = false,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    if (disabled) return;
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[10px] font-bold tracking-widest text-secondary uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="time"
          value={value}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={fieldClass(
            "w-full cursor-pointer rounded-lg bg-input-muted px-4 py-3 pr-10 text-sm outline-none transition-all border [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
            Boolean(error),
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={openPicker}
          disabled={disabled}
          aria-label={`Select ${label} time`}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer disabled:cursor-not-allowed"
        >
          <ClockSmall />
        </button>
      </div>
    </div>
  );
}

export function EventForm({ isOpen, onClose, onSuccess, eventId, initialData }: EventFormProps) {
  const isEditMode = Boolean(eventId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    description: string;
    location: string;
    startsAt: string;
    endsAt: string;
    isAllDay: boolean;
    imageUrl: string;
    isFeatured: boolean;
    capacity: number;
    accessType: string;
    eligibility: FormEligibility;
  }>({
    ...EMPTY_FORM,
    eligibility: { ...DEFAULT_ELIGIBILITY },
  });
  const [errors, setErrors] = useState<FormErrors>({});
  // Only show errors after the first submit attempt
  const [submitted, setSubmitted] = useState(false);

  // Available vehicle makes loaded from the backend
  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [makesLoading, setMakesLoading] = useState(false);

  const loadMakes = useCallback(async () => {
    setMakesLoading(true);
    try {
      const res = await eventsApi.getVehicleMakes();
      // Backend returns { success: true, data: string[] }
      // apiClient returns the full JSON object as typed
      const makes = (res as { data?: string[] }).data;
      if (Array.isArray(makes)) {
        setAvailableMakes(makes.filter(Boolean));
      }
    } catch {
      // Silently ignore — the card is still usable without pre-loaded makes
    } finally {
      setMakesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) loadMakes();
  }, [isOpen, loadMakes]);

  useEffect(() => {
    if (isOpen) {
      const hasRestrictions = Boolean(
        initialData?.eligibility?.requiresVehicle ||
        initialData?.eligibility?.vehicleFilters?.makes?.length ||
        initialData?.eligibility?.joinDate?.enabled ||
        initialData?.eligibility?.designations?.enabled
      );
      const eligibilityData: FormEligibility = initialData?.eligibility
        ? {
          enabled: Boolean(initialData.eligibility.enabled ?? hasRestrictions),
          requiresVehicle: Boolean(initialData.eligibility.requiresVehicle),
          vehicleFilters: {
            enabled: Boolean(
              initialData.eligibility.vehicleFilters?.makes?.length
            ),
            makes: Array.isArray(initialData.eligibility.vehicleFilters?.makes)
              ? [...initialData.eligibility.vehicleFilters.makes]
              : [],
          },
          joinDate: {
            enabled: Boolean(initialData.eligibility.joinDate?.enabled),
            mode: initialData.eligibility.joinDate?.mode === "custom" ? "custom" : "relative",
            relativeMonths: Number(initialData.eligibility.joinDate?.relativeMonths) || 6,
            startDate: String(initialData.eligibility.joinDate?.startDate || ""),
            endDate: String(initialData.eligibility.joinDate?.endDate || ""),
          },
          designations: {
            enabled: Boolean(initialData.eligibility.designations?.enabled),
            tiers: Array.isArray(initialData.eligibility.designations?.tiers)
              ? [...initialData.eligibility.designations.tiers]
              : [],
          },
        }
        : { ...DEFAULT_ELIGIBILITY };

      setFormData(
        initialData
          ? { ...EMPTY_FORM, ...initialData, eligibility: eligibilityData }
          : { ...EMPTY_FORM, eligibility: { ...DEFAULT_ELIGIBILITY } },
      );
      setErrors({});
      setSubmitted(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const updated = { ...formData, [name]: val };
    setFormData(updated);
    // Live-clear the error for this field once the user starts correcting it
    if (submitted) {
      const newErrors = validate(updated as typeof EMPTY_FORM);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof typeof EMPTY_FORM] }));
    }
  };

  const updateEligibility = (key: keyof FormEligibility, val: unknown) => {
    setFormData((prev) => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        [key]: val,
      },
    }));
  };

  const updateJoinDateEligibility = (key: keyof FormEligibility["joinDate"], val: unknown) => {
    setFormData((prev) => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        joinDate: {
          ...prev.eligibility.joinDate,
          [key]: val,
        },
      },
    }));
  };

  const updateDesignationEligibility = (key: keyof FormEligibility["designations"], val: unknown) => {
    setFormData((prev) => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        designations: {
          ...prev.eligibility.designations,
          [key]: val,
        },
      },
    }));
  };

  const updateDesignationTiers = (tiers: string[]) => {
    setFormData((prev) => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        designations: {
          ...prev.eligibility.designations,
          tiers,
          enabled: tiers.length > 0,
        },
      },
    }));
  };

  const toggleDesignationTier = (tierId: string) => {
    const currentTiers = formData.eligibility.designations?.tiers || [];
    const nextTiers = currentTiers.includes(tierId)
      ? currentTiers.filter((t) => t !== tierId)
      : [...currentTiers, tierId];
    updateDesignationTiers(nextTiers);
  };

  const toggleVehicleMake = (make: string) => {
    const current = formData.eligibility.vehicleFilters?.makes || [];
    const normalised = make.trim();
    const next = current.includes(normalised)
      ? current.filter((m) => m !== normalised)
      : [...current, normalised];
    setFormData((prev) => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        vehicleFilters: {
          ...prev.eligibility.vehicleFilters,
          makes: next,
          enabled: next.length > 0,
        },
      },
    }));
  };

  // Merges a date/time picker change into the combined startsAt/endsAt value
  const updateSchedule = (
    field: "startsAt" | "endsAt",
    part: "date" | "time",
    partValue: string,
  ) => {
    const current = splitDateTime(formData[field]);
    const next = { ...current, [part]: partValue };
    const updated = { ...formData, [field]: joinDateTime(next.date, next.time) };
    setFormData(updated);
    if (submitted) {
      const newErrors = validate(updated as typeof EMPTY_FORM);
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedMakes = formData.eligibility.vehicleFilters?.makes ?? [];
      const eligEnabled = formData.eligibility.enabled;

      // Build the joinDate sub-object — only include date fields relevant to the
      // selected mode so stale empty strings from the other mode are not persisted.
      const joinDateEnabled = eligEnabled && formData.eligibility.joinDate?.enabled;
      const jd = formData.eligibility.joinDate;
      const joinDatePayload = joinDateEnabled
        ? jd.mode === "relative"
          ? { enabled: true as const, mode: "relative" as const, relativeMonths: Number(jd.relativeMonths) || 6 }
          : { enabled: true as const, mode: "custom" as const, startDate: jd.startDate || null, endDate: jd.endDate || null }
        : undefined;

      const payload: CreateEventRequest = {
        ...formData,
        capacity: Number(formData.capacity),
        startsAt: new Date(formData.startsAt).toISOString(),
        endsAt: new Date(formData.endsAt).toISOString(),
        status: isEditMode ? (initialData?.status ?? "draft") : "draft",
        eligibility: eligEnabled
          ? {
              enabled: true,
              requiresVehicle: formData.eligibility.requiresVehicle,
              vehicleFilters: (formData.eligibility.vehicleFilters?.enabled && selectedMakes.length > 0)
                ? { enabled: true, makes: selectedMakes }
                : undefined,
              joinDate: joinDatePayload,
              designations: (formData.eligibility.designations?.enabled && (formData.eligibility.designations?.tiers?.length ?? 0) > 0)
                ? { enabled: true, tiers: formData.eligibility.designations.tiers }
                : undefined,
            }
          : { enabled: false },
      };

      if (isEditMode && eventId) {
        await eventsApi.updateEvent(eventId, payload);
        showSuccess("Event successfully updated!");
      } else {
        await eventsApi.create(payload);
        showSuccess("Event successfully created!");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save event:", error);
      showError(isEditMode
        ? "Something went wrong while updating the event."
        : "Something went wrong while creating the event."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-dark/70 backdrop-blur-sm"
        onClick={isSubmitting ? undefined : onClose}
      />

      <div className="admin-modal-panel relative z-10 flex w-full max-w-xl max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-accent/10 text-foreground shadow-[var(--shadow-modal)]">

        {/* Header */}
        <div className="p-6 border-b border-accent/8 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
              {isEditMode ? "— Edit" : "— Create New"}
            </p>
            <h2 className="text-2xl font-copperplate uppercase mt-1 tracking-[0.03em]">
              {isEditMode ? "Edit Event" : "Add Event"}
            </h2>
          </div>
          <button
            disabled={isSubmitting}
            onClick={onClose}
            className="p-2 rounded-full hover:bg-elevated text-secondary transition-colors disabled:opacity-30"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form id="event-form" onSubmit={handleSubmit} noValidate className="Custom__Scrollbar min-h-0 flex-1 overflow-y-auto p-8 space-y-6">

          {/* Basic Info */}
          <div className="space-y-4">

            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold tracking-widest text-secondary uppercase">Event Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Auction Day — Yas Marina"
                disabled={isSubmitting}
                className={fieldClass("bg-input-muted rounded-lg px-4 py-3 text-sm outline-none transition-all border", Boolean(errors.title))}
              />
              <FieldError message={errors.title} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold tracking-widest text-secondary uppercase">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="bg-input-muted border border-[var(--overview-border)] rounded-lg px-4 py-3 text-sm focus:border-accent/40 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="drives">Drives</option>
                  <option value="auctions">Auctions</option>
                  <option value="dining">Dining</option>
                  <option value="track">Track</option>
                </select>
              </div>

              {/* Capacity */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold tracking-widest text-secondary uppercase">Capacity *</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min={1}
                  max={10000}
                  className={fieldClass("bg-input-muted rounded-lg px-4 py-3 text-sm outline-none transition-all border", Boolean(errors.capacity))}
                />
                <FieldError message={errors.capacity} />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-accent border-b border-accent/8 pb-2">SCHEDULE</h3>

            {/* Starts At */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">Starts At *</p>
              <div className="grid grid-cols-2 gap-3">
                <ScheduleDateField
                  id="event-starts-date"
                  label="Date"
                  value={splitDateTime(formData.startsAt).date}
                  error={errors.startsAt}
                  onChange={(value) => updateSchedule("startsAt", "date", value)}
                  disabled={isSubmitting}
                />
                <ScheduleTimeField
                  id="event-starts-time"
                  label="Time"
                  value={splitDateTime(formData.startsAt).time}
                  error={errors.startsAt}
                  onChange={(value) => updateSchedule("startsAt", "time", value)}
                  disabled={isSubmitting}
                />
              </div>
              <FieldError message={errors.startsAt} />
            </div>

            {/* Ends At */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">Ends At *</p>
              <div className="grid grid-cols-2 gap-3">
                <ScheduleDateField
                  id="event-ends-date"
                  label="Date"
                  value={splitDateTime(formData.endsAt).date}
                  min={splitDateTime(formData.startsAt).date || undefined}
                  error={errors.endsAt}
                  onChange={(value) => updateSchedule("endsAt", "date", value)}
                  disabled={isSubmitting}
                />
                <ScheduleTimeField
                  id="event-ends-time"
                  label="Time"
                  value={splitDateTime(formData.endsAt).time}
                  error={errors.endsAt}
                  onChange={(value) => updateSchedule("endsAt", "time", value)}
                  disabled={isSubmitting}
                />
              </div>
              <FieldError message={errors.endsAt} />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-accent border-b border-accent/8 pb-2">DETAILS</h3>

            {/* Location */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold tracking-widest text-secondary uppercase">Location *</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Yas Marina Circuit, Abu Dhabi"
                className={fieldClass("bg-input-muted rounded-lg px-4 py-3 text-sm outline-none border", Boolean(errors.location))}
              />
              <FieldError message={errors.location} />
            </div>

            {/* Image URL — optional */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold tracking-widest text-secondary uppercase">Image URL</label>
              <input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="https://example.com/image.jpg"
                className={fieldClass("bg-input-muted rounded-lg px-4 py-3 text-sm outline-none border", Boolean(errors.imageUrl))}
              />
              <FieldError message={errors.imageUrl} />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold tracking-widest text-secondary uppercase">Description *</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                className={fieldClass("bg-input-muted rounded-lg px-4 py-3 text-sm outline-none resize-none border", Boolean(errors.description))}
              />
              <FieldError message={errors.description} />
            </div>
          </div>

          {/* ELIGIBILITY RESTRICTIONS */}
          <div className="space-y-4 rounded-2xl border border-accent/20 bg-gradient-to-b from-card to-card/60 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-all">

            {/* Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-accent/10">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 shadow-inner">
                  <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[11px] font-bold tracking-[0.18em] text-accent uppercase">
                      ELIGIBILITY RESTRICTIONS
                    </h3>
                    <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${formData.eligibility?.enabled
                      ? "bg-teal/15 text-teal border-teal/30"
                      : "bg-elevated text-secondary border-accent/10"
                      }`}>
                      {formData.eligibility?.enabled ? "RESTRICTED" : "OPEN TO ALL"}
                    </span>
                  </div>
                  <p className="text-[10px] text-secondary mt-0.5">
                    Configure access rules to determine which members can view and join this event.
                  </p>
                </div>
              </div>

              {/* Master Toggle Switch */}
              <label className="relative inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.eligibility?.enabled ?? false}
                  onChange={(e) => updateEligibility("enabled", e.target.checked)}
                  className="peer sr-only"
                  disabled={isSubmitting}
                />
                <div className="peer h-6 w-11 rounded-full bg-input-muted border border-accent/15 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-secondary after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:border-accent peer-checked:after:translate-x-5 peer-checked:after:bg-dark peer-focus:outline-none" />
              </label>
            </div>

            {formData.eligibility?.enabled && (
              <div className="space-y-4 pt-1">

                {/* 1. Member Vehicle Requirement Card */}
                <div className="rounded-xl border border-accent/12 bg-input-muted/40 p-4 transition-all hover:border-accent/25">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg border border-accent/15 bg-accent/5">
                        <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-9 4h10M4 11l2-4h12l2 4M5 19a2 2 0 100-4 2 2 0 000 4zm14 0a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
                          Vehicle Ownership Requirement
                        </h4>
                        <p className="text-[10px] text-secondary mt-0.5">
                          Require member to have at least 1 registered vehicle in their garage.
                          {formData.eligibility.requiresVehicle && (formData.eligibility.vehicleFilters?.makes ?? []).length > 0 && (
                            <span className="block mt-1 text-amber-400/80">
                              ⚠ A make filter is active — vehicle ownership is already implied by the make check. Members without any vehicle will be rejected by the make filter, not this toggle.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center shrink-0">
                      <input
                        type="checkbox"
                        checked={formData.eligibility.requiresVehicle ?? false}
                        onChange={(e) => updateEligibility("requiresVehicle", e.target.checked)}
                        disabled={isSubmitting}
                        className="peer sr-only"
                      />
                      <div className="peer h-5 w-9 rounded-full bg-input-muted border border-accent/15 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-secondary after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:border-accent peer-checked:after:translate-x-4 peer-checked:after:bg-dark peer-focus:outline-none" />
                    </label>
                  </div>
                </div>

                {/* 1b. Vehicle Make Filter Card */}
                {formData.eligibility.requiresVehicle && (
                  <div className="rounded-xl border border-accent/12 bg-input-muted/40 p-4 transition-all hover:border-accent/25 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3 items-start">
                        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg border border-accent/15 bg-accent/5">
                          <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
                            Vehicle Make Filter
                          </h4>
                          <p className="text-[10px] text-secondary mt-0.5">
                            Restrict to members who own specific vehicle brands. Leave empty to allow any vehicle.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Makes multi-select grid */}
                    <div className="pt-3 border-t border-accent/10 space-y-3">
                      {/* Selected badges */}
                      {(formData.eligibility.vehicleFilters?.makes ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {(formData.eligibility.vehicleFilters?.makes ?? []).map((make) => (
                            <span
                              key={make}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-accent/20 border border-accent text-accent"
                            >
                              {make}
                              <button
                                type="button"
                                onClick={() => toggleVehicleMake(make)}
                                disabled={isSubmitting}
                                className="hover:text-pink transition-colors"
                                aria-label={`Remove ${make}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({
                              ...prev,
                              eligibility: {
                                ...prev.eligibility,
                                vehicleFilters: { enabled: false, makes: [] },
                              },
                            }))}
                            disabled={isSubmitting}
                            className="text-[10px] text-secondary hover:text-foreground font-semibold transition-colors ml-auto"
                          >
                            Clear all
                          </button>
                        </div>
                      )}

                      {/* Available makes buttons */}
                      {makesLoading ? (
                        <p className="text-[10px] text-secondary text-center py-2">Loading makes…</p>
                      ) : availableMakes.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {availableMakes.map((make) => {
                            const selected = (formData.eligibility.vehicleFilters?.makes ?? []).includes(make);
                            return (
                              <button
                                type="button"
                                key={make}
                                onClick={() => toggleVehicleMake(make)}
                                disabled={isSubmitting}
                                className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all border cursor-pointer text-center ${selected
                                  ? "bg-accent/15 border-accent text-accent shadow-sm"
                                  : "bg-card border-accent/10 text-secondary hover:border-accent/30 hover:text-foreground"
                                  }`}
                              >
                                {selected && <span className="mr-1">✓</span>}{make}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[10px] text-secondary text-center py-2">No vehicle makes found in the system.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Membership Join Date Window Card */}
                <div className="rounded-xl border border-accent/12 bg-input-muted/40 p-4 transition-all hover:border-accent/25 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg border border-accent/15 bg-accent/5">
                        <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
                          Membership Join Date Rule
                        </h4>
                        <p className="text-[10px] text-secondary mt-0.5">
                          Target members based on when they joined the club.
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center shrink-0">
                      <input
                        type="checkbox"
                        checked={formData.eligibility.joinDate?.enabled ?? false}
                        onChange={(e) => updateJoinDateEligibility("enabled", e.target.checked)}
                        disabled={isSubmitting}
                        className="peer sr-only"
                      />
                      <div className="peer h-5 w-9 rounded-full bg-input-muted border border-accent/15 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-secondary after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:border-accent peer-checked:after:translate-x-4 peer-checked:after:bg-dark peer-focus:outline-none" />
                    </label>
                  </div>

                  {formData.eligibility.joinDate?.enabled && (
                    <div className="pt-3 border-t border-accent/10 space-y-4">

                      {/* Mode Segmented Controls */}
                      <div className="grid grid-cols-2 gap-2 bg-card p-1 rounded-xl border border-accent/10">
                        <button
                          type="button"
                          onClick={() => updateJoinDateEligibility("mode", "relative")}
                          disabled={isSubmitting}
                          className={`py-2 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all ${formData.eligibility.joinDate.mode === "relative"
                            ? "bg-accent/20 border border-accent text-accent shadow-sm"
                            : "text-secondary hover:text-foreground"
                            }`}
                        >
                          Recent Members (Months)
                        </button>
                        <button
                          type="button"
                          onClick={() => updateJoinDateEligibility("mode", "custom")}
                          disabled={isSubmitting}
                          className={`py-2 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all ${formData.eligibility.joinDate.mode === "custom"
                            ? "bg-accent/20 border border-accent text-accent shadow-sm"
                            : "text-secondary hover:text-foreground"
                            }`}
                        >
                          Specific Date Range
                        </button>
                      </div>

                      {formData.eligibility.joinDate.mode === "relative" ? (
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-secondary uppercase">
                            Joined Within Last:
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            {[1, 3, 6, 12, 24].map((m) => (
                              <button
                                type="button"
                                key={m}
                                onClick={() => updateJoinDateEligibility("relativeMonths", m)}
                                disabled={isSubmitting}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all border ${formData.eligibility.joinDate.relativeMonths === m
                                  ? "bg-accent text-dark border-accent font-bold"
                                  : "bg-input-muted border-accent/10 text-secondary hover:border-accent/30"
                                  }`}
                              >
                                {m} {m === 1 ? "Month" : "Months"}
                              </button>
                            ))}
                            <div className="flex items-center gap-1.5 ml-auto">
                              <input
                                type="number"
                                min={1}
                                max={120}
                                value={formData.eligibility.joinDate.relativeMonths || 6}
                                onChange={(e) => updateJoinDateEligibility("relativeMonths", Math.max(1, Number(e.target.value)))}
                                disabled={isSubmitting}
                                className="w-16 bg-input-muted rounded-lg px-2 py-1 text-xs text-center border border-accent/15 focus:border-accent/40 outline-none"
                              />
                              <span className="text-[10px] font-semibold text-secondary uppercase">Custom Mo</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <ScheduleDateField
                            id="eligibility-join-start"
                            label="Joined On or After"
                            value={formData.eligibility.joinDate.startDate || ""}
                            onChange={(val) => updateJoinDateEligibility("startDate", val)}
                            disabled={isSubmitting}
                          />
                          <ScheduleDateField
                            id="eligibility-join-end"
                            label="Joined On or Before"
                            value={formData.eligibility.joinDate.endDate || ""}
                            onChange={(val) => updateJoinDateEligibility("endDate", val)}
                            disabled={isSubmitting}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Member Designation & Tier Restrictions Card */}
                <div className="rounded-xl border border-accent/12 bg-input-muted/40 p-4 transition-all hover:border-accent/25 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg border border-accent/15 bg-accent/5">
                        <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
                          Member Designation & Tier
                        </h4>
                        <p className="text-[10px] text-secondary mt-0.5">
                          Restrict access to specific membership tiers.
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center shrink-0">
                      <input
                        type="checkbox"
                        checked={formData.eligibility.designations?.enabled ?? false}
                        onChange={(e) => updateDesignationEligibility("enabled", e.target.checked)}
                        disabled={isSubmitting}
                        className="peer sr-only"
                      />
                      <div className="peer h-5 w-9 rounded-full bg-input-muted border border-accent/15 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-secondary after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:border-accent peer-checked:after:translate-x-4 peer-checked:after:bg-dark peer-focus:outline-none" />
                    </label>
                  </div>

                  {formData.eligibility.designations?.enabled && (
                    <div className="pt-3 border-t border-accent/10 space-y-3">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold tracking-widest text-secondary uppercase">Allowed Tiers:</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => updateDesignationTiers(["access", "private", "principal", "black_card"])}
                            className="text-accent hover:underline font-semibold"
                          >
                            Select All
                          </button>
                          <span className="text-secondary">•</span>
                          <button
                            type="button"
                            onClick={() => updateDesignationTiers([])}
                            className="text-secondary hover:text-foreground font-semibold"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { id: "access", label: "ACCESS", sub: "Standard Tier" },
                          { id: "private", label: "PRIVATE", sub: "Private Tier" },
                          { id: "principal", label: "PRINCIPLE", sub: "Core Membership" },
                          { id: "black_card", label: "BLACK CARD", sub: "VIP Top Tier" },
                          // { id: "vip", label: "VIP", sub: "Exclusive Access" },
                          // { id: "ambassador", label: "AMBASSADOR", sub: "Club Ambassador" },
                        ].map((tier) => {
                          const selected = formData.eligibility?.designations?.tiers.includes(tier.id);
                          return (
                            <button
                              type="button"
                              key={tier.id}
                              onClick={() => toggleDesignationTier(tier.id)}
                              disabled={isSubmitting}
                              className={`flex items-center justify-between p-2.5 rounded-xl text-left transition-all border cursor-pointer ${selected
                                ? "bg-accent/15 border-accent text-accent shadow-sm"
                                : "bg-card border-accent/10 text-secondary hover:border-accent/30 hover:text-foreground"
                                }`}
                            >
                              <div>
                                <div className="text-xs font-bold tracking-wider uppercase">{tier.label}</div>
                                <div className="text-[9px] opacity-70 mt-0.5">{tier.sub}</div>
                              </div>
                              {selected && (
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-dark font-bold text-[10px]">
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-accent/8 bg-card">
          <div className="flex gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="flex-1 py-4 rounded-xl text-[10px] font-bold tracking-widest text-secondary cursor-pointer border border-accent/12 hover:bg-elevated uppercase transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="event-form"
              disabled={isSubmitting}
              className="admin-gold-cta flex-1 py-4 rounded-xl text-[10px] font-bold tracking-widest cursor-pointer uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  {isEditMode ? "Saving..." : "Creating..."}
                </>
              ) : (
                isEditMode ? "Save Changes" : "Create Event"
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
