"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ACCEPTED_VEHICLE_IMAGE_TYPES,
  MAX_VEHICLE_IMAGES,
  MAX_VEHICLE_IMAGE_BYTES,
} from "./types";

type AddVehicleImageUploadFieldProps = {
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
};

function isAcceptedImage(file: File): boolean {
  return ACCEPTED_VEHICLE_IMAGE_TYPES.includes(
    file.type as (typeof ACCEPTED_VEHICLE_IMAGE_TYPES)[number],
  );
}

export function AddVehicleImageUploadField({
  files,
  onChange,
  error,
}: AddVehicleImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localWarning, setLocalWarning] = useState<string>();

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFiles(selected: FileList | null) {
    if (!selected || selected.length === 0) return;

    const incoming = Array.from(selected);
    const rejectedType = incoming.some((file) => !isAcceptedImage(file));
    const rejectedSize = incoming.some(
      (file) => file.size > MAX_VEHICLE_IMAGE_BYTES,
    );

    const accepted = incoming.filter(
      (file) => isAcceptedImage(file) && file.size <= MAX_VEHICLE_IMAGE_BYTES,
    );

    const merged = [...files, ...accepted].slice(0, MAX_VEHICLE_IMAGES);
    const droppedForLimit = files.length + accepted.length > MAX_VEHICLE_IMAGES;

    if (rejectedType) {
      setLocalWarning("Only JPEG, PNG, WEBP, and GIF images are allowed");
    } else if (rejectedSize) {
      setLocalWarning("Each image must be 1MB or smaller");
    } else if (droppedForLimit) {
      setLocalWarning(`You can upload up to ${MAX_VEHICLE_IMAGES} images`);
    } else {
      setLocalWarning(undefined);
    }

    onChange(merged);
  }

  function removeAt(index: number) {
    setLocalWarning(undefined);
    onChange(files.filter((_, i) => i !== index));
  }

  const canAddMore = files.length < MAX_VEHICLE_IMAGES;
  const displayError = error ?? localWarning;

  return (
    <div className="space-y-2">
      <label className="font-roboto block text-[11px] tracking-[0.04em] text-foreground">
        Vehicle Images
      </label>

      {canAddMore && (
        <button
          type="button"
          onClick={openPicker}
          className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-input-muted px-4 py-8 text-center transition-colors hover:border-primary/35 ${
            displayError ? "border-red-500" : "border-accent/20"
          }`}
        >
          <span className="flex size-10 items-center justify-center rounded-full border border-accent/25 bg-accent/8 text-accent">
            <svg
              width="18"
              height="18"
              viewBox="0 0 28 28"
              fill="none"
              aria-hidden
            >
              <path
                d="M24.5 17.5V22.1667C24.5 22.7855 24.2542 23.379 23.8166 23.8166C23.379 24.2542 22.7855 24.5 22.1667 24.5H5.83333C5.21449 24.5 4.621 24.2542 4.18342 23.8166C3.74583 23.379 3.5 22.7855 3.5 22.1667V17.5"
                stroke="currentColor"
                strokeWidth="1.63333"
              />
              <path
                d="M8.1665 11.6666L13.9998 17.5L19.8332 11.6666"
                stroke="currentColor"
                strokeWidth="1.63333"
              />
              <path d="M14 17.5V3.5" stroke="currentColor" strokeWidth="1.63333" />
            </svg>
          </span>
          <span className="font-roboto mt-3 text-sm font-medium text-foreground">
            Click to upload images
          </span>
          <span className="font-roboto mt-1.5 text-[10px] tracking-[0.1em] text-secondary/70 uppercase">
            Jpeg · Png · Webp · Gif — Up to {MAX_VEHICLE_IMAGES}, 1MB each
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_VEHICLE_IMAGE_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative aspect-square overflow-hidden rounded-lg border border-accent/15 bg-input-muted"
            >
              {previews[index] && (
                <img
                  src={previews[index]}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remove ${file.name}`}
                className="absolute right-1 top-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-black/70 text-[11px] leading-none text-white transition-colors hover:bg-black/90"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {displayError ? (
        <p className="font-roboto text-[10px] text-red-500">{displayError}</p>
      ) : null}
    </div>
  );
}
