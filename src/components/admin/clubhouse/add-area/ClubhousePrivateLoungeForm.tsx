"use client";

import { Dropdown, Input } from "@/components/common";
import { CLUBHOUSE_LOUNGE_TITLE_OPTIONS, CLUBHOUSE_PRIVATE_LOUNGE_TYPE_OPTIONS } from "./constants";
import { ClubhouseAddAreaFormActions } from "./ClubhouseAddAreaFormActions";
import { ClubhouseAddAreaFormHeader } from "./ClubhouseAddAreaFormHeader";
import { ClubhouseAmbienceImagesField } from "./ClubhouseAmbienceImagesField";
import { ClubhouseModalShell } from "./ClubhouseModalShell";
import type { ClubhousePrivateLoungeFormState } from "./types";

type ClubhousePrivateLoungeFormProps = {
  open: boolean;
  value: ClubhousePrivateLoungeFormState;
  saving?: boolean;
  onClose: () => void;
  onChange: (patch: Partial<ClubhousePrivateLoungeFormState>) => void;
  onSave: () => void;
};

function resolveLoungeSubtitle(loungeTitle: string): string {
  return (
    CLUBHOUSE_LOUNGE_TITLE_OPTIONS.find((option) => option.value === loungeTitle)
      ?.label ?? "Members Lounge"
  );
}

export function ClubhousePrivateLoungeForm({
  open,
  value,
  saving = false,
  onClose,
  onChange,
  onSave,
}: ClubhousePrivateLoungeFormProps) {
  const subtitle = resolveLoungeSubtitle(value.loungeTitle);

  return (
    <ClubhouseModalShell open={open} onClose={onClose} maxWidthClass="max-w-[560px]">
      <div className="max-h-[90vh] overflow-y-auto Custom__Scrollbar p-6">
        <ClubhouseAddAreaFormHeader
          areaLabel="Private Lounge"
          subtitle={subtitle}
          onClose={onClose}
        />

        <div className="space-y-5">
          <Dropdown
            label="Lounge Title"
            options={CLUBHOUSE_LOUNGE_TITLE_OPTIONS}
            value={value.loungeTitle}
            placeholder="Select lounge"
            onChange={(loungeTitle) => onChange({ loungeTitle })}
          />

          <Dropdown
            label="Category"
            options={CLUBHOUSE_PRIVATE_LOUNGE_TYPE_OPTIONS}
            value={value.type}
            placeholder="Select category"
            onChange={(type) => onChange({ type })}
          />

          <button
            type="button"
            onClick={() => onChange({ isAvailable24x7: !value.isAvailable24x7 })}
            className="flex w-full items-center justify-between rounded-lg border border-accent/25 bg-card px-4 py-3.5 text-left transition-colors hover:border-accent/60"
          >
            <span className="font-roboto text-sm text-foreground">Availability</span>
            <span className="font-roboto text-sm font-semibold tracking-[0.04em] text-accent">
              {value.isAvailable24x7 ? "24 / 7" : "Scheduled"}
            </span>
          </button>

          <Input
            label="No. of Persons (Capacity)"
            type="number"
            min={0}
            value={value.capacity}
            onChange={(event) => onChange({ capacity: event.target.value })}
          />

          <Input
            label="Maintain Timing (1 Hour)"
            value={value.maintainTiming}
            placeholder="1 hour"
            onChange={(event) => onChange({ maintainTiming: event.target.value })}
          />

          <ClubhouseAmbienceImagesField
            label="Images"
            slotAspectClass="aspect-square"
            files={value.images}
            onChange={(images) => onChange({ images })}
          />
        </div>

        <ClubhouseAddAreaFormActions
          saving={saving}
          onCancel={onClose}
          onSave={onSave}
        />
      </div>
    </ClubhouseModalShell>
  );
}
