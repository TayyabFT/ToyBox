"use client";

import { CaptureCameraIcon, FilterIcon, FlagIcon, SyncIcon } from "./icons";
import { CheckIcon } from "./icons";
import type { RecentUpload, UploadState } from "./types";

type RecentUploadsProps = {
  uploads: RecentUpload[];
  selectedId: string;
  loading?: boolean;
  onSelect: (id: string) => void;
};

const stateConfig: Record<
  UploadState,
  { label: string; className: string; icon: "sync" | "flag" | "check" | "dot" }
> = {
  synced: {
    label: "Synced",
    className: "border-teal/28 bg-teal/8 text-teal",
    icon: "sync",
  },
  flagged: {
    label: "Flagged",
    className: "border-primary/30 bg-primary/10 text-primary",
    icon: "flag",
  },
  pending: {
    label: "Pending",
    className: "border-pink/28 bg-pink/10 text-pink",
    icon: "dot",
  },
  approved: {
    label: "Approved",
    className: "border-teal/28 bg-teal/8 text-teal",
    icon: "check",
  },
};

export function RecentUploads({
  uploads,
  selectedId,
  loading = false,
  onSelect,
}: RecentUploadsProps) {
  return (
    <section className="rounded-2xl border border-accent/10 bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-roboto text-[11px] tracking-[0.14em] text-secondary uppercase">
          Recent Uploads
        </h2>
        <button
          type="button"
          className="font-roboto flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent/20 bg-input-muted px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-secondary uppercase transition-colors hover:border-accent/35 hover:text-primary"
        >
          <FilterIcon className="size-3" />
          Filter
        </button>
      </div>

      {loading && uploads.length === 0 ? (
        <p className="font-roboto py-8 text-center text-sm text-secondary">
          Loading recent uploads...
        </p>
      ) : null}

      {!loading && uploads.length === 0 ? (
        <p className="font-roboto py-8 text-center text-sm text-secondary">
          No recent uploads found.
        </p>
      ) : null}

      <div className="space-y-2">
        {uploads.map((upload) => (
          <UploadRow
            key={upload.id}
            upload={upload}
            selected={upload.id === selectedId}
            onSelect={() => onSelect(upload.id)}
          />
        ))}
      </div>
    </section>
  );
}

function UploadRow({
  upload,
  selected,
  onSelect,
}: {
  upload: RecentUpload;
  selected: boolean;
  onSelect: () => void;
}) {
  const config = stateConfig[upload.state];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
        selected
          ? "border-accent/35 bg-accent/8"
          : "border-accent/15 bg-input-muted hover:border-accent/35"
      }`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-accent/15 bg-elevated text-secondary">
        <CaptureCameraIcon className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-roboto truncate text-[12px] font-medium text-foreground">
          {upload.title}
        </p>
        <p className="font-roboto truncate text-[10px] tracking-[0.04em] text-section-label uppercase">
          {upload.meta}
        </p>
      </div>

      <span
        className={`font-roboto flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.08em] uppercase ${config.className}`}
      >
        {config.icon === "sync" && <SyncIcon className="size-2.5" />}
        {config.icon === "flag" && <FlagIcon className="size-2.5" />}
        {config.icon === "check" && <CheckIcon className="size-2.5" />}
        {config.icon === "dot" && <span className="size-1.5 rounded-full bg-current" />}
        {config.label}
      </span>
    </button>
  );
}
