"use client";

import { useRef } from "react";
import { CameraRollIcon, FilesAppIcon, UploadFromDeviceIcon } from "./icons";

type UploadFromDeviceProps = {
  actionLoading?: boolean;
  onUpload: (file: File) => void;
};

export function UploadFromDevice({
  actionLoading = false,
  onUpload,
}: UploadFromDeviceProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    if (actionLoading) return;
    inputRef.current?.click();
  }

  return (
    <section className="rounded-2xl border border-accent/10 bg-card p-5">
      <h2 className="mb-4 font-roboto text-[11px] tracking-[0.14em] text-secondary uppercase">
        Upload from Device
      </h2>

      <button
        type="button"
        disabled={actionLoading}
        onClick={openPicker}
        className="photo-upload-drop-zone mb-4 flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-accent/20 px-4 py-10 text-center transition-colors hover:border-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <UploadFromDeviceIcon className="photo-upload-icon-accent size-7" />
        <span className="font-roboto text-sm font-medium text-foreground mt-5">
          Drop photos here or tap to browse
        </span>
        <span className="font-roboto text-[10px] tracking-[0.1em] text-section-label uppercase mt-2">
          JPG · PNG · Max 20 MB Each
        </span>
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={actionLoading}
          onClick={openPicker}
          className="font-roboto flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-accent/20 bg-surface py-2.5 text-[10px] font-semibold tracking-[0.1em] text-secondary uppercase transition-colors hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CameraRollIcon className="photo-upload-icon-muted size-2.5" />
          Camera Roll
        </button>
        <button
          type="button"
          disabled={actionLoading}
          onClick={openPicker}
          className="font-roboto flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-accent/20 bg-surface py-2.5 text-[10px] font-semibold tracking-[0.1em] text-secondary uppercase transition-colors hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FilesAppIcon className="photo-upload-icon-muted size-2.5" />
          Import from PC
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            onUpload(file);
          }

          event.target.value = "";
        }}
      />
    </section>
  );
}
