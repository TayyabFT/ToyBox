"use client";

import { Dropdown, Input } from "@/components/common";
import {
  CLUBHOUSE_SUITE_ROOM_TYPE_OPTIONS,
  CLUBHOUSE_SUITE_TITLE_OPTIONS,
} from "./constants";
import { ClubhouseAddAreaFormActions } from "./ClubhouseAddAreaFormActions";
import { ClubhouseAddAreaFormHeader } from "./ClubhouseAddAreaFormHeader";
import { ClubhouseAmbienceImagesField } from "./ClubhouseAmbienceImagesField";
import { ClubhouseModalShell } from "./ClubhouseModalShell";
import type { ClubhouseSuiteEntry, ClubhouseSuiteLoungeFormState } from "./types";

type ClubhouseSuiteLoungeFormProps = {
  open: boolean;
  value: ClubhouseSuiteLoungeFormState;
  saving?: boolean;
  onClose: () => void;
  onChange: (value: ClubhouseSuiteLoungeFormState) => void;
  onSave: () => void;
};

function createSuiteEntry(): ClubhouseSuiteEntry {
  return {
    id: crypto.randomUUID(),
    suiteTitle: "",
    location: "",
    roomType: "meeting-rooms",
    capacity: "",
  };
}

function updateSuiteAt(
  suites: ClubhouseSuiteEntry[],
  suiteId: string,
  patch: Partial<ClubhouseSuiteEntry>,
): ClubhouseSuiteEntry[] {
  return suites.map((suite) =>
    suite.id === suiteId ? { ...suite, ...patch } : suite,
  );
}

export function ClubhouseSuiteLoungeForm({
  open,
  value,
  saving = false,
  onClose,
  onChange,
  onSave,
}: ClubhouseSuiteLoungeFormProps) {
  function patch(patch: Partial<ClubhouseSuiteLoungeFormState>) {
    onChange({ ...value, ...patch });
  }

  function handleSuiteChange(
    suiteId: string,
    suitePatch: Partial<ClubhouseSuiteEntry>,
  ) {
    patch({ suites: updateSuiteAt(value.suites, suiteId, suitePatch) });
  }

  function handleAddSuite() {
    patch({ suites: [...value.suites, createSuiteEntry()] });
  }

  return (
    <ClubhouseModalShell open={open} onClose={onClose} maxWidthClass="max-w-[560px]">
      <div className="max-h-[90vh] overflow-y-auto Custom__Scrollbar p-6">
        <ClubhouseAddAreaFormHeader
          areaLabel="Suite Lounge"
          subtitle="Suite Lounge"
          onClose={onClose}
        />

        <div className="space-y-5">
          {value.suites.map((suite, index) => (
            <div key={suite.id} className={index > 0 ? "space-y-5 border-t border-accent/12 pt-5" : "space-y-5"}>
              <Dropdown
                label="Suite Title"
                options={CLUBHOUSE_SUITE_TITLE_OPTIONS}
                value={suite.suiteTitle}
                placeholder="Select suite"
                onChange={(suiteTitle) =>
                  handleSuiteChange(suite.id, { suiteTitle })
                }
              />

              <Input
                label="Location"
                value={suite.location}
                placeholder="Ground floor, east wing"
                onChange={(event) =>
                  handleSuiteChange(suite.id, { location: event.target.value })
                }
              />

              {index === value.suites.length - 1 ? (
                <button
                  type="button"
                  onClick={handleAddSuite}
                  className="font-roboto w-full cursor-pointer rounded-lg border border-dashed border-accent/25 py-2.5 text-[12px] font-semibold tracking-[0.08em] text-accent uppercase transition-colors hover:border-accent hover:bg-accent/5"
                >
                  + Add Suite
                </button>
              ) : null}

              <Dropdown
                label="Category"
                options={CLUBHOUSE_SUITE_ROOM_TYPE_OPTIONS}
                value={suite.roomType}
                placeholder="Select category"
                onChange={(roomType) => handleSuiteChange(suite.id, { roomType })}
              />

              <Input
                label="No. of Persons (Capacity)"
                type="number"
                min={0}
                value={suite.capacity}
                onChange={(event) =>
                  handleSuiteChange(suite.id, { capacity: event.target.value })
                }
              />
            </div>
          ))}

          <ClubhouseAmbienceImagesField
            label="Images"
            slotAspectClass="aspect-square"
            files={value.images}
            onChange={(images) => patch({ images })}
          />

          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="suite-lounge-notes"
              className="font-roboto text-[11px] font-medium tracking-[0.15em] text-section-label uppercase"
            >
              Notes
            </label>
            <textarea
              id="suite-lounge-notes"
              value={value.notes}
              rows={4}
              placeholder="Internal notes for staff..."
              onChange={(event) => patch({ notes: event.target.value })}
              className="font-roboto w-full resize-none rounded-lg border border-accent/25 bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-secondary focus:border-accent"
            />
          </div>
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
