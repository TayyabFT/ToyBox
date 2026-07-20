"use client";

import {
  CaptureCameraIcon,
  CheckIcon,
  DeleteIcon,
  FlagIcon,
  ImportIcon,
  UploadFileArrowIcon,
} from "./icons";
import { PlusSmall } from "@/components/common/Svgs";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import type { PendingSummary, TodayCapture } from "./types";

function CaptureTileSkeleton() {
  return <ShimmerBlock className="aspect-square w-full rounded-xl" />;
}

type TodaysCapturesProps = {
  captures: TodayCapture[];
  summary: PendingSummary;
  selectedId: string;
  loading?: boolean;
  actionLoading?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUploadAll: () => void;
  onUploadNow: () => void;
  onAddPhoto: () => void;
  onUploadFile: () => void;
};

export function TodaysCaptures({
  captures,
  summary,
  selectedId,
  loading = false,
  actionLoading = false,
  onSelect,
  onDelete,
  onUploadAll,
  onUploadNow,
  onAddPhoto,
  onUploadFile,
}: TodaysCapturesProps) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-copperplate text-[15px] tracking-[0.04em] uppercase">
            <span className="text-foreground">Today&apos;s </span>
            <span className="text-primary">Captures</span>
          </h2>
          <p className="font-roboto text-[10px] tracking-[0.1em] text-section-label uppercase">
            {summary.totalPhotos} Photos · {summary.pendingCount} Pending Upload
          </p>
        </div>

        <button
          type="button"
          disabled={actionLoading || summary.pendingCount === 0}
          onClick={() => void onUploadAll()}
          className="photo-upload-outline-btn font-roboto cursor-pointer rounded-full border px-5 py-2 text-[10px] font-semibold tracking-[0.1em] uppercase transition-colors hover:border-primary/35 hover:bg-accent/8 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Upload All
        </button>
      </div>

      {loading ? (
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          aria-busy="true"
          aria-live="polite"
        >
          {Array.from({ length: 8 }, (_, index) => (
            <CaptureTileSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {captures.map((capture) => (
            <CaptureTile
              key={capture.id}
              capture={capture}
              selected={capture.id === selectedId}
              onSelect={() => onSelect(capture.id)}
              onDelete={() => void onDelete(capture.id)}
              deleteDisabled={actionLoading}
            />
          ))}

          <AddPhotoTile
            disabled={actionLoading}
            onClick={onAddPhoto}
          />
          <UploadFileTile onClick={onUploadFile} />
        </div>
      )}

    <div className="photo-upload-pending-banner mt-7 flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-primary">
            <ImportIcon className="size-6" />
          </span>
          <div className="space-y-0.5">
            <p className="font-roboto text-[13px] font-medium text-foreground">
              {summary.pendingCount} photos pending upload
            </p>
            <p className="font-roboto text-[11px] tracking-[0.06em] text-section-label uppercase">
              Will sync when on network · {summary.totalSizeMb} total
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={actionLoading || summary.pendingCount === 0}
          onClick={() => void onUploadNow()}
          className="photo-upload-pending-banner-btn font-roboto shrink-0 cursor-pointer rounded-full border px-5 py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Upload Now
        </button>
      </div>
    </section>
  );
}

function CaptureTile({
  capture,
  selected,
  onSelect,
  onDelete,
  deleteDisabled = false,
}: {
  capture: TodayCapture;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  deleteDisabled?: boolean;
}) {
  const isFlagged = capture.status === "flagged";
  const isPending = capture.status === "pending";
  const showDelete = Boolean(capture.thumbnailUrl) || isPending;

  return (
    <div
      className={`photo-upload-capture-tile group relative aspect-square overflow-hidden rounded-xl border transition-colors ${
        selected
          ? "border-primary/50 ring-1 ring-primary/25"
          : isFlagged
            ? "border-primary/40"
            : "border-accent/12 hover:border-primary/25"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex h-full w-full flex-col justify-between p-2.5 text-left"
      >
        {capture.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capture.thumbnailUrl}
            alt={capture.label}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        <span className="relative flex size-7 items-center justify-center rounded-lg border border-accent/18 bg-surface/60 text-secondary">
          <CaptureCameraIcon className="size-3.5" />
        </span>

        <div className="relative space-y-1">
          <p className="font-roboto text-[10px] font-semibold text-foreground">
            {capture.label}
          </p>
          {isFlagged ? (
            <span className="font-roboto flex items-center gap-1 text-[9px] tracking-[0.06em] text-primary uppercase">
              <FlagIcon className="size-2.5" />
              {capture.time}
            </span>
          ) : isPending ? (
            <span className="font-roboto flex items-center gap-1 rounded-md border border-pink/28 bg-pink/10 px-1.5 py-0.5 text-[9px] tracking-[0.06em] text-pink uppercase">
              {capture.time}
            </span>
          ) : (
            <span className="font-roboto flex items-center gap-1 text-[9px] tracking-[0.06em] text-teal uppercase">
              {capture.time} · Uploaded
              <CheckIcon className="size-2.5" />
            </span>
          )}
        </div>
      </button>

      {showDelete ? (
        <button
          type="button"
          aria-label={`Delete ${capture.label}`}
          disabled={deleteDisabled}
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          className="absolute right-2 top-2 z-10 flex size-7 cursor-pointer items-center justify-center rounded-lg border border-pink/35 bg-dark/85 text-pink opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <DeleteIcon className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

function AddPhotoTile({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="photo-upload-dashed-tile flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-colors hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="font-roboto text-[10px] tracking-[0.08em] uppercase flex flex-col items-center justify-center">
        <p className="photo-upload-dashed-tile-accent text-3xl">+</p>
        Add Photo
      </span>
    </button>
  );  
}

function UploadFileTile({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="photo-upload-dashed-tile flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-colors hover:border-primary/35 hover:text-primary"
    >
      <span className="font-roboto text-[10px] tracking-[0.08em] uppercase flex flex-col items-center justify-center gap-1.5">
        <UploadFileArrowIcon className="photo-upload-dashed-tile-accent size-7" />
        Upload File
      </span>
    </button>
  );
}
