"use client";

import { useRef } from "react";
import { CloudUpload } from "@/components/common/Svgs";
import { CameraRollIcon, FilesAppIcon } from "./icons";

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
        className="mb-4 flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-accent/20 bg-dark px-4 py-10 text-center transition-colors hover:border-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex size-11 items-center justify-center rounded-xl border border-accent/15 bg-surface/60">
          <CloudUpload className="size-5" color="var(--muted)" />
        </span>
        <span className="font-roboto text-[12px] font-medium text-foreground">
          Drop photos here or tap to browse
        </span>
        <span className="font-roboto text-[10px] tracking-[0.1em] text-section-label uppercase">
          JPG · PNG · Max 20 MB Each
        </span>
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={actionLoading}
          onClick={openPicker}
          className="font-roboto flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-accent/20 bg-surface py-2.5 text-[10px] font-semibold tracking-[0.1em] text-secondary uppercase transition-colors hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CameraRollIcon className="size-3.5" />
          Camera Roll
        </button>
        <button
          type="button"
          disabled={actionLoading}
          onClick={openPicker}
          className="font-roboto flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-accent/20 bg-surface py-2.5 text-[10px] font-semibold tracking-[0.1em] text-secondary uppercase transition-colors hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FilesAppIcon className="size-3.5" />
          Import from Files
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
