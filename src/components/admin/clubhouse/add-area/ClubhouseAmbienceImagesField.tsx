"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  ACCEPTED_CLUBHOUSE_IMAGE_TYPES,
  MAX_CLUBHOUSE_AMBIENCE_IMAGES,
} from "./constants";

type ClubhouseAmbienceImagesFieldProps = {
  files: (File | null)[];
  onChange: (files: (File | null)[]) => void;
  label?: string;
  slotAspectClass?: string;
};

function isAcceptedImage(file: File): boolean {
  return ACCEPTED_CLUBHOUSE_IMAGE_TYPES.includes(
    file.type as (typeof ACCEPTED_CLUBHOUSE_IMAGE_TYPES)[number],
  );
}

function normalizeSlots(files: (File | null)[]): (File | null)[] {
  return Array.from({ length: MAX_CLUBHOUSE_AMBIENCE_IMAGES }, (_, index) => {
    return files[index] ?? null;
  });
}

export function ClubhouseAmbienceImagesField({
  files,
  onChange,
  label = "Ambience Images",
  slotAspectClass = "aspect-[3/4]",
}: ClubhouseAmbienceImagesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const activeSlotRef = useRef<number | null>(null);
  const slots = normalizeSlots(files);

  const previews = useMemo(
    () =>
      slots.map((file) => (file ? URL.createObjectURL(file) : null)),
    [slots],
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  function openPicker(slotIndex: number) {
    activeSlotRef.current = slotIndex;
    inputRef.current?.click();
  }

  function updateSlot(slotIndex: number, file: File | null) {
    const next = normalizeSlots(files);
    next[slotIndex] = file;
    onChange(next);
  }

  function handleFiles(selected: FileList | null) {
    if (!selected?.length || activeSlotRef.current == null) return;

    const file = selected[0];
    if (!file || !isAcceptedImage(file)) return;

    updateSlot(activeSlotRef.current, file);
    activeSlotRef.current = null;
  }

  return (
    <div className="space-y-2.5">
      <p className="font-roboto text-[11px] font-medium tracking-[0.15em] text-section-label uppercase">
        {label}
      </p>

      <div className="grid grid-cols-3 gap-3">
        {slots.map((file, index) => {
          const preview = previews[index];

          return (
            <button
              key={index}
              type="button"
              onClick={() => (file ? updateSlot(index, null) : openPicker(index))}
              className={`group relative flex ${slotAspectClass} cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-accent/25 bg-surface transition-colors hover:border-accent/70`}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt={file?.name ?? `Ambience ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-dark/50 text-[10px] font-medium tracking-[0.12em] text-white uppercase opacity-0 transition-opacity group-hover:opacity-100">
                    Remove
                  </span>
                </>
              ) : (
                <span className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
                  Upload
                </span>
              )}
            </button>
          );
        })}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_CLUBHOUSE_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}
