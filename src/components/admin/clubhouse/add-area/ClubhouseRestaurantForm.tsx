"use client";

import { Dropdown, Input } from "@/components/common";
import {
  CLUBHOUSE_CUISINE_TYPE_OPTIONS,
  CLUBHOUSE_RESTAURANT_NAME_OPTIONS,
  CLUBHOUSE_RESTAURANT_TYPE_OPTIONS,
} from "./constants";
import { ClubhouseAddAreaFormActions } from "./ClubhouseAddAreaFormActions";
import { ClubhouseAddAreaFormHeader } from "./ClubhouseAddAreaFormHeader";
import { ClubhouseAmbienceImagesField } from "./ClubhouseAmbienceImagesField";
import { ClubhouseModalShell } from "./ClubhouseModalShell";
import type { ClubhouseRestaurantFormState } from "./types";

type ClubhouseRestaurantFormProps = {
  open: boolean;
  value: ClubhouseRestaurantFormState;
  saving?: boolean;
  onClose: () => void;
  onChange: (patch: Partial<ClubhouseRestaurantFormState>) => void;
  onSave: () => void;
};

export function ClubhouseRestaurantForm({
  open,
  value,
  saving = false,
  onClose,
  onChange,
  onSave,
}: ClubhouseRestaurantFormProps) {
  return (
    <ClubhouseModalShell open={open} onClose={onClose} maxWidthClass="max-w-[560px]">
      <div className="max-h-[90vh] overflow-y-auto Custom__Scrollbar p-6">
        <ClubhouseAddAreaFormHeader
          areaLabel="Restaurant"
          subtitle="Clubhouse Restaurant"
          onClose={onClose}
        />

        <div className="space-y-5">
          <Dropdown
            label="Restaurant Name"
            options={CLUBHOUSE_RESTAURANT_NAME_OPTIONS}
            value={value.restaurantName}
            placeholder="Select restaurant"
            onChange={(restaurantName) => onChange({ restaurantName })}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Opening Time"
              value={value.openingTime}
              placeholder="12:00 PM"
              onChange={(event) => onChange({ openingTime: event.target.value })}
            />
            <Input
              label="Closing Time"
              value={value.closingTime}
              placeholder="3:30 PM"
              onChange={(event) => onChange({ closingTime: event.target.value })}
            />
          </div>

          <Input
            label="No. of Tables"
            type="number"
            min={0}
            value={value.tableCount}
            onChange={(event) => onChange({ tableCount: event.target.value })}
          />

          <Input
            label="No. of Persons (Capacity)"
            type="number"
            min={0}
            value={value.capacity}
            onChange={(event) => onChange({ capacity: event.target.value })}
          />

          <Dropdown
            label="Cuisine Type"
            options={CLUBHOUSE_CUISINE_TYPE_OPTIONS}
            value={value.cuisineType}
            placeholder="Select cuisine type"
            onChange={(cuisineType) => onChange({ cuisineType })}
          />

          <Dropdown
            label="Category"
            options={CLUBHOUSE_RESTAURANT_TYPE_OPTIONS}
            value={value.restaurantType}
            placeholder="Select category"
            onChange={(restaurantType) => onChange({ restaurantType })}
          />

          <ClubhouseAmbienceImagesField
            files={value.ambienceImages}
            onChange={(ambienceImages) => onChange({ ambienceImages })}
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
