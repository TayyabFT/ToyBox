import React, { useState, useEffect, useRef } from 'react';
import { eventsApi } from "@/api/events.api";
import type { CreateEventRequest } from "@/types/api";
import { showError, showSuccess } from "@/lib/toast";
import { VehicleCalendar, ClockSmall } from "@/components/common/Svgs";

const EMPTY_FORM = {
  title: "",
  category: "auctions",
  description: "",
  location: "",
  startsAt: "",
  endsAt: "",
  isAllDay: false,
  imageUrl: "",
  isFeatured: true,
  capacity: 50,
  accessType: "open",
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
  initialData?: Partial<typeof EMPTY_FORM> & { status?: string };
}

// Small inline error message component
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[10px] text-red-400 tracking-wide mt-1 flex items-center gap-1">
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </p>
  );
}

// Returns the border class — red when there's an error, default otherwise
function fieldClass(base: string, hasError: boolean) {
  return `${base} ${hasError ? "border-red-500/60 focus:border-red-500/80" : "border-zinc-800 focus:border-[#D4A847]/40"}`;
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
      <label htmlFor={id} className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
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
            "w-full cursor-pointer rounded-lg bg-[#121314] px-4 py-3 pr-10 text-sm outline-none transition-all border [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
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
      <label htmlFor={id} className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
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
            "w-full cursor-pointer rounded-lg bg-[#121314] px-4 py-3 pr-10 text-sm outline-none transition-all border [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
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
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<FormErrors>({});
  // Only show errors after the first submit attempt
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ? { ...EMPTY_FORM, ...initialData } : { ...EMPTY_FORM });
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
      const payload: CreateEventRequest = {
        ...formData,
        capacity: Number(formData.capacity),
        startsAt: new Date(formData.startsAt).toISOString(),
        endsAt: new Date(formData.endsAt).toISOString(),
        status: isEditMode ? (initialData?.status ?? "draft") : "draft",
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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={isSubmitting ? undefined : onClose}
      />

      <div className="relative z-10 flex w-full max-w-xl max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-[#D4A847]/10 bg-[#0c0d0e] text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)]">

        {/* Header */}
        <div className="p-6 border-b border-zinc-900/50 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#D4A847] uppercase">
              {isEditMode ? "— Edit" : "— Create New"}
            </p>
            <h2 className="text-2xl font-semibold font-copperplate uppercase mt-1">
              {isEditMode ? "Edit Event" : "Add Event"}
            </h2>
          </div>
          <button
            disabled={isSubmitting}
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-900 text-zinc-500 transition-colors disabled:opacity-30"
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
              <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Event Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Auction Day — Yas Marina"
                disabled={isSubmitting}
                className={fieldClass("bg-[#121314] rounded-lg px-4 py-3 text-sm outline-none transition-all border", Boolean(errors.title))}
              />
              <FieldError message={errors.title} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="bg-[#121314] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-[#D4A847]/40 outline-none transition-all appearance-none"
                >
                  <option value="auctions">Auctions</option>
                  <option value="drives">Drives</option>
                  <option value="social">Social</option>
                </select>
              </div>

              {/* Capacity */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Capacity *</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min={1}
                  max={10000}
                  className={fieldClass("bg-[#121314] rounded-lg px-4 py-3 text-sm outline-none transition-all border", Boolean(errors.capacity))}
                />
                <FieldError message={errors.capacity} />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-[#D4A847] border-b border-zinc-900 pb-2">SCHEDULE</h3>

            {/* Starts At */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Starts At *</p>
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
              <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Ends At *</p>
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
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-[#D4A847] border-b border-zinc-900 pb-2">DETAILS</h3>

            {/* Location */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Location *</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Yas Marina Circuit, Abu Dhabi"
                className={fieldClass("bg-[#121314] rounded-lg px-4 py-3 text-sm outline-none border", Boolean(errors.location))}
              />
              <FieldError message={errors.location} />
            </div>

            {/* Image URL — optional */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Image URL</label>
              <input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="https://example.com/image.jpg"
                className={fieldClass("bg-[#121314] rounded-lg px-4 py-3 text-sm outline-none border", Boolean(errors.imageUrl))}
              />
              <FieldError message={errors.imageUrl} />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Description *</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                className={fieldClass("bg-[#121314] rounded-lg px-4 py-3 text-sm outline-none resize-none border", Boolean(errors.description))}
              />
              <FieldError message={errors.description} />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-zinc-950 bg-[#0c0d0e]">
          <div className="flex gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="flex-1 py-4 rounded-xl text-[10px] font-bold tracking-widest text-zinc-400 cursor-pointer border border-zinc-800 hover:bg-zinc-900 uppercase transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="event-form"
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-xl text-[10px] font-bold tracking-widest cursor-pointer  text-dark bg-primary hover:bg-[#D4B45C] uppercase shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
