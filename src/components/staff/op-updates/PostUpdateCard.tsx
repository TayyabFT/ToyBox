"use client";

import { RocketIcon, SmallFlagIcon } from "./icons";
import type { LinkedOption, PostCategory } from "./types";
import { OPERATIONAL_UPDATE_LINKED_REFERENCE_MAX } from "@/lib/staffOperationalUpdates";

type PostUpdateCardProps = {
  value: string;
  activeCategory: PostCategory;
  isFlagged: boolean;
  authorInitial: string;
  vehicleOptions: LinkedOption[];
  memberOptions: LinkedOption[];
  selectedVehicleId: string;
  selectedMemberId: string;
  linkedJobReference: string;
  optionsLoading?: boolean;
  posting?: boolean;
  onChange: (value: string) => void;
  onCategoryChange: (category: PostCategory) => void;
  onToggleFlag: () => void;
  onVehicleChange: (value: string) => void;
  onMemberChange: (value: string) => void;
  onLinkedJobReferenceChange: (value: string) => void;
  onPost: () => void;
};

const CATEGORY_OPTIONS: { id: PostCategory; label: string }[] = [
  { id: "general", label: "General" },
  { id: "vehicle", label: "+ Vehicle" },
  { id: "member", label: "+ Member" },
];

export function PostUpdateCard({
  value,
  activeCategory,
  isFlagged,
  authorInitial,
  vehicleOptions,
  memberOptions,
  selectedVehicleId,
  selectedMemberId,
  linkedJobReference,
  optionsLoading = false,
  posting = false,
  onChange,
  onCategoryChange,
  onToggleFlag,
  onVehicleChange,
  onMemberChange,
  onLinkedJobReferenceChange,
  onPost,
}: PostUpdateCardProps) {
  return (
    <section className="rounded-2xl border border-accent/10 bg-card p-5">
      <h2 className="font-roboto mb-4 text-[11px] tracking-[0.14em] text-secondary uppercase">
        Post an Update
      </h2>

      <div className="rounded-xl border border-accent/10 bg-surface p-4">
        <div className="mb-3 flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-roboto text-sm font-bold text-primary">
            {authorInitial}
          </span>

          <div className="min-w-0 flex-1 space-y-3">
            <textarea
              value={value}
              onChange={(event) => onChange(event.target.value)}
              rows={3}
              disabled={posting}
              placeholder="Write an operational update, flag an issue, or log a task note..."
              className="font-roboto w-full resize-none bg-transparent text-[13px] leading-relaxed text-foreground outline-none placeholder:text-secondary/70 disabled:opacity-60"
            />

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {activeCategory === "vehicle" ? (
                <select
                  value={selectedVehicleId}
                  onChange={(event) => onVehicleChange(event.target.value)}
                  disabled={optionsLoading || posting}
                  className="font-roboto w-full rounded-xl border border-accent/15 bg-input-muted px-3 py-2 text-[12px] text-foreground outline-none transition-colors focus:border-accent/35 disabled:opacity-60"
                >
                  <option value="">Select vehicle</option>
                  {vehicleOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}

              {activeCategory === "member" ? (
                <select
                  value={selectedMemberId}
                  onChange={(event) => onMemberChange(event.target.value)}
                  disabled={optionsLoading || posting}
                  className="font-roboto w-full rounded-xl border border-accent/15 bg-input-muted px-3 py-2 text-[12px] text-foreground outline-none transition-colors focus:border-accent/35 disabled:opacity-60"
                >
                  <option value="">Select member</option>
                  {memberOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}

              <input
                value={linkedJobReference}
                onChange={(event) => onLinkedJobReferenceChange(event.target.value)}
                disabled={posting}
                maxLength={OPERATIONAL_UPDATE_LINKED_REFERENCE_MAX}
                placeholder="Linked job reference (e.g. INS-0441)"
                className="font-roboto w-full rounded-xl border border-accent/15 bg-input-muted px-3 py-2 text-[12px] text-foreground outline-none transition-colors placeholder:text-secondary/70 focus:border-accent/35 disabled:opacity-60 sm:col-span-2"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-accent/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_OPTIONS.map((option) => {
              const isActive = activeCategory === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onCategoryChange(option.id)}
                  disabled={posting}
                  className={`font-roboto cursor-pointer rounded-full border px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase transition-colors ${
                    isActive
                      ? "border-primary/35 bg-primary/10 text-primary"
                      : "border-accent/15 bg-card text-secondary hover:border-primary/25 hover:text-primary"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={onToggleFlag}
              disabled={posting}
              className={`font-roboto flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase transition-colors ${
                isFlagged
                  ? "border-pink/35 bg-pink/10 text-pink"
                  : "border-accent/15 bg-card text-secondary hover:border-pink/30 hover:text-pink"
              }`}
            >
              <SmallFlagIcon className="size-3" />
              Flag Issue
            </button>
          </div>

          <button
            type="button"
            onClick={onPost}
            disabled={!value.trim() || posting}
            className="font-roboto flex cursor-pointer items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-gold-bright to-primary px-5 py-2.5 text-[11px] !font-bold tracking-[0.14em] text-dark uppercase transition-opacity disabled:cursor-not-allowed disabled:opacity-45 sm:self-center"
          >
            <RocketIcon className="size-3.5" />
            {posting ? "Posting..." : "Post Update"}
          </button>
        </div>
      </div>
    </section>
  );
}
