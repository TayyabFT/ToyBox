"use client";

import { useState } from "react";
import { memberParkingApi, type MemberParkingSlotRaw } from "@/api/memberParking.api";
import { RequestFieldLabel, RequestRadioDot } from "../shared/requestFormUi";
import {
  LEVEL_OPTIONS,
  SLOT_TYPE_OPTIONS,
  ZONE_OPTIONS,
  getSlotTypeLabel,
  toIsoString,
} from "./parkingOptions";
import type { ParkingVehicleOption } from "./ParkingModal";
import type { ParkingFindSlotFormState, ParkingSlotResult } from "./types";

type ParkingFindSlotStepProps = {
  vehicles: ParkingVehicleOption[];
  activeVehicleId: string;
  onVehicleChange: (id: string) => void;
  form: ParkingFindSlotFormState;
  onChange: (patch: Partial<ParkingFindSlotFormState>) => void;
  selectedSlot: ParkingSlotResult | null;
  onSlotSelect: (slot: ParkingSlotResult | null) => void;
};

// ── Chip strip ─────────────────────────────────────────────────────────────

function ChipStrip({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`font-roboto rounded-xl px-3 py-1.5 text-[12px] font-medium transition-colors ${
              active
                ? "bg-primary text-dark"
                : "garage-form-chip border border-accent/10 text-foreground-soft hover:border-accent/25"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Date + time row ────────────────────────────────────────────────────────
// Both inputs are fully visible and directly interactive.
// We use a custom CSS approach to hide the browser's default chrome while
// keeping the input fully clickable and functional.

function DateTimeRow({
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  date: string;
  time: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
}) {
  // Format date as "20-Jul-2026" for display inside the input via CSS
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const displayDate = (() => {
    if (!date) return "";
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}-${months[Number(mm) - 1]}-${yyyy}`;
  })();

  return (
    <div className="flex items-center gap-0 rounded-xl border border-accent/10 bg-input-muted overflow-hidden">
      {/* ── Date pill ── */}
      <div className="relative flex flex-1 items-center">
        {/* Visible styled label — pointer-events none so clicks pass through to input */}
        <span className="pointer-events-none absolute left-4 font-roboto text-[13px] font-medium text-foreground z-10">
          {displayDate || "Select date"}
        </span>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="parking-datetime-input w-full rounded-l-xl px-4 py-3"
        />
      </div>

      {/* ── Divider ── */}
      <span className="h-8 w-px shrink-0 bg-accent/15" />

      {/* ── Time pill ── */}
      <div className="relative flex items-center">
        {/* Visible styled label */}
        <span className="pointer-events-none absolute left-4 font-roboto text-[13px] font-medium text-foreground z-10 whitespace-nowrap">
          {time || "00:00"}
        </span>
        <input
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="parking-datetime-input w-32 rounded-r-xl px-4 py-3"
        />
      </div>
    </div>
  );
}

// ── Map raw API slot to display model ─────────────────────────────────────

function mapSlot(raw: MemberParkingSlotRaw): ParkingSlotResult | null {
  if (!raw.id) return null;
  const status = (raw.status ?? "available").toLowerCase();
  return {
    id: String(raw.id),
    slotCode: raw.slotCode ?? raw.label ?? "—",
    label: raw.label ?? raw.slotCode ?? "—",
    level: raw.level ?? "—",
    zone: raw.zone ?? "—",
    slotType: raw.slotType ?? "standard",
    slotTypeLabel: getSlotTypeLabel(raw.slotType ?? "standard"),
    openTime: raw.openTime ?? "00:00",
    closeTime: raw.closeTime ?? "23:59",
    status,
    statusLabel: status === "available" ? "Available" : status.charAt(0).toUpperCase() + status.slice(1),
  };
}

function extractSlots(data: unknown): MemberParkingSlotRaw[] {
  if (Array.isArray(data)) return data as MemberParkingSlotRaw[];
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    for (const key of ["slots", "items", "records", "data"]) {
      if (Array.isArray(d[key])) return d[key] as MemberParkingSlotRaw[];
    }
  }
  return [];
}

// ── Slot result row ────────────────────────────────────────────────────────

function SlotRow({
  slot,
  selected,
  onSelect,
}: {
  slot: ParkingSlotResult;
  selected: boolean;
  onSelect: () => void;
}) {
  const isAvailable = slot.status === "available";

  return (
    <button
      type="button"
      onClick={isAvailable ? onSelect : undefined}
      disabled={!isAvailable}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-4 text-left transition-colors ${
        selected
          ? "border-primary/60 bg-primary/6"
          : isAvailable
            ? "border-accent/10 bg-input-muted hover:border-accent/25"
            : "border-accent/8 bg-input-muted/50 opacity-50 cursor-not-allowed"
      }`}
    >
      <span className="shrink-0 self-center">
        <RequestRadioDot selected={selected} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-roboto text-[13px] font-semibold leading-5 text-foreground">
          {slot.slotCode}
        </p>
        <p className="font-roboto mt-0.5 text-[11px] leading-4 text-secondary">
          Level {slot.level} · Zone {slot.zone} · {slot.slotTypeLabel}
        </p>
        <p className="font-roboto mt-0.5 text-[11px] leading-4 text-secondary">
          {slot.openTime} – {slot.closeTime}
        </p>
      </div>

      <span
        className={`font-roboto shrink-0 self-start pt-[1px] text-[11px] font-semibold ${
          isAvailable ? "text-teal" : "text-secondary"
        }`}
      >
        {slot.statusLabel}
      </span>
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function ParkingFindSlotStep({
  vehicles,
  activeVehicleId,
  onVehicleChange,
  form,
  onChange,
  selectedSlot,
  onSlotSelect,
}: ParkingFindSlotStepProps) {
  const [slots, setSlots] = useState<ParkingSlotResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch() {
    if (!form.fromDate || !form.fromTime || !form.toDate || !form.toTime) return;

    setIsSearching(true);
    setSearchError(null);
    onSlotSelect(null);

    try {
      const from = toIsoString(form.fromDate, form.fromTime);
      const to = toIsoString(form.toDate, form.toTime);

      const res = await memberParkingApi.getSlots({
        from,
        to,
        level: form.level !== "any" ? form.level : undefined,
        zone: form.zone !== "any" ? form.zone : undefined,
        slotType: form.slotType !== "any" ? form.slotType : undefined,
        selectableOnly: form.selectableOnly,
      });

      const raw = extractSlots(
        (res as { data?: unknown }).data ?? res,
      );
      const mapped = raw.map(mapSlot).filter((s): s is ParkingSlotResult => s !== null);
      setSlots(mapped);
      setHasSearched(true);
    } catch (err) {
      setSearchError(
        (err as { message?: string }).message ?? "Failed to search slots. Please try again.",
      );
    } finally {
      setIsSearching(false);
    }
  }

  const canSearch = Boolean(form.fromDate && form.fromTime && form.toDate && form.toTime);

  return (
    <div className="space-y-5">
      {/* ── Vehicle ────────────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <RequestFieldLabel>Vehicle</RequestFieldLabel>
        <div className="flex flex-wrap gap-2">
          {vehicles.map((v) => {
            const active = v.id === activeVehicleId;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onVehicleChange(v.id)}
                className={`font-roboto rounded-xl px-4 py-2 text-[13px] font-semibold transition-colors ${
                  active
                    ? "bg-primary text-dark"
                    : "garage-form-chip border border-accent/10 text-foreground-soft hover:border-accent/25"
                }`}
              >
                {v.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Parking Window ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <RequestFieldLabel>Parking Window</RequestFieldLabel>

        <div className="space-y-2.5">
          <div>
            <p className="font-roboto mb-1.5 text-[12px] text-secondary">From</p>
            <DateTimeRow
              date={form.fromDate}
              time={form.fromTime}
              onDateChange={(v) => onChange({ fromDate: v })}
              onTimeChange={(v) => onChange({ fromTime: v })}
            />
          </div>

          <div>
            <p className="font-roboto mb-1.5 text-[12px] text-secondary">To</p>
            <DateTimeRow
              date={form.toDate}
              time={form.toTime}
              onDateChange={(v) => onChange({ toDate: v })}
              onTimeChange={(v) => onChange({ toTime: v })}
            />
          </div>
        </div>
      </div>

      {/* ── Level ──────────────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <RequestFieldLabel>Level</RequestFieldLabel>
        <ChipStrip
          options={LEVEL_OPTIONS}
          value={form.level}
          onChange={(v) => onChange({ level: v })}
        />
      </div>

      {/* ── Zone ───────────────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <RequestFieldLabel>Zone</RequestFieldLabel>
        <ChipStrip
          options={ZONE_OPTIONS}
          value={form.zone}
          onChange={(v) => onChange({ zone: v })}
        />
      </div>

      {/* ── Slot Type ──────────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <RequestFieldLabel>Slot Type</RequestFieldLabel>
        <ChipStrip
          options={SLOT_TYPE_OPTIONS}
          value={form.slotType}
          onChange={(v) => onChange({ slotType: v })}
        />
      </div>

      {/* ── Selectable only toggle ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span className="font-roboto text-[13px] text-foreground-soft">
          Selectable slots only
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={form.selectableOnly}
          onClick={() => onChange({ selectableOnly: !form.selectableOnly })}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
            form.selectableOnly ? "bg-primary" : "bg-accent/20"
          }`}
        >
          <span
            className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
              form.selectableOnly ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* ── Search button ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleSearch}
        disabled={!canSearch || isSearching}
        className="font-roboto w-full rounded-full border border-primary/40 bg-transparent py-3 text-[12px] font-bold tracking-[0.08em] text-primary transition-colors hover:bg-primary/8 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSearching ? "Searching..." : "Search Slots"}
      </button>

      {/* ── Search error ──────────────────────────────────────────────── */}
      {searchError ? (
        <p className="font-roboto text-center text-[12px] text-pink">{searchError}</p>
      ) : null}

      {/* ── Slot results ──────────────────────────────────────────────── */}
      {hasSearched && !isSearching ? (
        <div className="space-y-2.5">
          <RequestFieldLabel>Available Slots</RequestFieldLabel>

          {slots.length === 0 ? (
            <p className="font-roboto py-4 text-center text-[13px] text-secondary">
              No slots found for this window. Try adjusting your filters.
            </p>
          ) : (
            <div className="space-y-2.5">
              {slots.map((slot) => (
                <SlotRow
                  key={slot.id}
                  slot={slot}
                  selected={selectedSlot?.id === slot.id}
                  onSelect={() => onSlotSelect(slot)}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
