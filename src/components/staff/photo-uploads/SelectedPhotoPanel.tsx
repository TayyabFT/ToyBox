"use client";

import { CaptureCameraIcon, EditIcon, FlagIcon, ImportIcon } from "./icons";
import type { SelectedPhoto, SelectedPhotoDraft } from "./types";

type SelectedPhotoPanelProps = {
  photo: SelectedPhoto | null;
  draft: SelectedPhotoDraft | null;
  loading?: boolean;
  actionLoading?: boolean;
  isEditing?: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onDraftChange: (updates: Partial<SelectedPhotoDraft>) => void;
  onUpload: () => void;
  onSave: () => void;
};

export function SelectedPhotoPanel({
  photo,
  draft,
  loading = false,
  actionLoading = false,
  isEditing = false,
  onStartEdit,
  onCancelEdit,
  onDraftChange,
  onUpload,
  onSave,
}: SelectedPhotoPanelProps) {
  if (loading && !photo) {
    return (
      <section className="rounded-2xl border border-accent/10 bg-card p-5">
        <p className="font-roboto py-16 text-center text-sm text-secondary">
          Loading selected photo...
        </p>
      </section>
    );
  }

  if (!photo || !draft) {
    return (
      <section className="rounded-2xl border border-accent/10 bg-card p-5">
        <p className="font-roboto py-16 text-center text-sm text-secondary">
          Select a capture to view details.
        </p>
      </section>
    );
  }

  const statusLabel =
    photo.status === "flagged"
      ? "Issue Flag"
      : photo.status === "approved"
        ? "Approved"
        : "Pending";

  const statusClass =
    photo.status === "flagged"
      ? "border-pink/28 bg-pink/10 text-pink"
      : photo.status === "approved"
        ? "border-teal/28 bg-teal/8 text-teal"
        : "border-primary/35 bg-primary/10 text-primary";

  return (
    <section className="rounded-2xl border border-accent/10 bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-roboto text-[11px] tracking-[0.14em] text-secondary uppercase">
          Selected Photo
        </h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              type="button"
              disabled={actionLoading}
              onClick={onCancelEdit}
              className="font-roboto cursor-pointer rounded-lg border border-accent/20 bg-surface px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-secondary uppercase transition-colors hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              disabled={actionLoading}
              onClick={onStartEdit}
              className="font-roboto flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent/20 bg-surface px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <EditIcon className="size-3" />
              Edit
            </button>
          )}
          <span
            className={`font-roboto rounded-lg border px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-accent/12 bg-dark">
        <span className="font-roboto absolute right-3 top-3 rounded-md border border-accent/18 bg-surface/70 px-2 py-1 text-[9px] font-semibold tracking-[0.1em] text-secondary uppercase">
          {photo.index}
        </span>

        {photo.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-xl border border-accent/18 bg-surface/50 text-secondary">
              <CaptureCameraIcon className="size-6" />
            </span>
            <p className="font-roboto text-[10px] tracking-[0.12em] text-section-label uppercase">
              {photo.title}
            </p>
          </div>
        )}
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <InfoBox value={photo.time} />
        <InfoBox value={photo.size} />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <InfoBox value={photo.fileId} />
        {photo.isIssueFlagged ? (
          <div className="flex items-center justify-center gap-1.5 rounded-lg border border-pink/28 bg-pink/10 px-3 py-2.5 font-roboto text-[10px] font-semibold tracking-[0.1em] text-pink uppercase">
            <FlagIcon className="size-3" />
            Issue Flag
          </div>
        ) : (
          <InfoBox value={statusLabel} />
        )}
      </div>

      <div className="mb-4 space-y-2">
        <p className="font-roboto text-[10px] tracking-[0.12em] text-section-label uppercase">
          Category Tags
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {photo.categoryTags.map((tag) => (
            <span
              key={tag}
              className="font-roboto rounded-md border border-accent/18 bg-surface px-2.5 py-1 text-[9px] font-semibold tracking-[0.08em] text-secondary uppercase"
            >
              {tag}
            </span>
          ))}
          {photo.isIssueFlagged ? (
            <span className="font-roboto flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-[9px] font-semibold tracking-[0.08em] text-primary uppercase">
              <FlagIcon className="size-2.5" />
              Flagged
            </span>
          ) : null}
        </div>
      </div>

      <div className="mb-5 space-y-2">
        <p className="font-roboto text-[10px] tracking-[0.12em] text-section-label uppercase">
          Caption / Note
        </p>
        {isEditing ? (
          <textarea
            value={draft.caption}
            disabled={actionLoading}
            onChange={(event) => onDraftChange({ caption: event.target.value })}
            className="font-roboto min-h-[96px] w-full rounded-xl border border-accent/12 bg-dark px-4 py-3 text-[12px] leading-relaxed text-foreground outline-none focus:border-primary/35"
          />
        ) : (
          <div className="rounded-xl border border-accent/12 bg-dark px-4 py-3">
            <p className="font-roboto text-[12px] leading-relaxed text-foreground">
              {photo.caption || "—"}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={actionLoading}
          onClick={() => void onUpload()}
          className="font-roboto flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-accent/20 bg-surface py-2.5 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase transition-colors hover:border-primary/35 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ImportIcon className="size-3.5" />
          Upload
        </button>
        <button
          type="button"
          disabled={actionLoading}
          onClick={() => void onSave()}
          className="font-roboto flex-1 cursor-pointer rounded-lg bg-gradient-to-r from-gold-bright to-primary py-2.5 text-[10px] font-semibold tracking-[0.1em] text-dark uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isEditing ? "Save Changes" : "Save & Link"}
        </button>
      </div>
    </section>
  );
}

function InfoBox({ value }: { value: string }) {
  return (
    <div className="rounded-lg border border-accent/12 bg-dark px-3 py-2.5 text-center font-roboto text-[10px] tracking-[0.06em] text-foreground uppercase">
      {value}
    </div>
  );
}
