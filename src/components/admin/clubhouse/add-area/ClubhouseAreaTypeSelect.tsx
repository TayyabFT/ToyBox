"use client";

import { Dropdown } from "@/components/common";
import { CLUBHOUSE_AREA_TYPE_OPTIONS } from "./constants";
import { ClubhouseModalShell } from "./ClubhouseModalShell";
import type { ClubhouseAreaType } from "./types";

type ClubhouseAreaTypeSelectProps = {
  open: boolean;
  value: ClubhouseAreaType | "";
  onClose: () => void;
  onChange: (value: ClubhouseAreaType) => void;
};

export function ClubhouseAreaTypeSelect({
  open,
  value,
  onClose,
  onChange,
}: ClubhouseAreaTypeSelectProps) {
  return (
    <ClubhouseModalShell open={open} onClose={onClose}>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-copperplate text-[18px] tracking-[0.06em] text-white uppercase">
            Add Area
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[#7D7460] transition-colors hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <Dropdown
          label="Select Area Type"
          options={CLUBHOUSE_AREA_TYPE_OPTIONS}
          value={value}
          placeholder="Select area type"
          onChange={(nextValue) => onChange(nextValue as ClubhouseAreaType)}
        />
      </div>
    </ClubhouseModalShell>
  );
}
