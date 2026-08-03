"use client";

import { useRef, useState } from "react";
import { ModalPortal } from "@/components/common/ModalPortal";
import { MemberGarageUploadOutlineIcon } from "@/components/common/Svgs";
import { memberVehiclesApi } from "@/api/memberVehicles.api";
import { showError, showSuccess } from "@/lib/toast";
import {
  memberRequestModalBackdropClass,
  memberRequestModalCloseClass,
  memberRequestModalOverlayClass,
} from "./shared/memberRequestModal";

// ── Document slots ────────────────────────────────────────────────────────────

const DOCUMENT_SLOTS: { key: string; label: string }[] = [
  { key: "vehicleRegistration",  label: "Vehicle Registration"  },
  { key: "insuranceCertificate", label: "Insurance Certificate" },
  { key: "specsAndInfo",         label: "Specs and Info"        },
  { key: "serviceRecord",        label: "Service Record"        },
  { key: "purchasedInvoice",     label: "Purchased Invoice"     },
  { key: "warrantyCertificate",  label: "Warranty Certificate"  },
];

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png,.webp";
const MAX_SIZE_MB = 10;

type FileMap = Record<string, File | null>;

type UploadDocumentModalProps = {
  open: boolean;
  vehicleId: string;
  onClose: () => void;
  onUploaded: () => void;
};

// ── Single document row ───────────────────────────────────────────────────────

type DocumentRowProps = {
  label: string;
  docKey: string;
  file: File | null;
  uploading: boolean;
  onChange: (key: string, file: File | null) => void;
};

function DocumentRow({ label, docKey, file, uploading, onChange }: DocumentRowProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    if (!selected) return;
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      showError(`${label}: file must be under ${MAX_SIZE_MB} MB`);
      return;
    }
    onChange(docKey, selected);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(docKey, null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-1.5">
      {/* Label */}
      <p className="font-roboto text-[12px] font-semibold text-foreground">
        {label}
      </p>

      {/* File input row */}
      <div
        className={`flex items-center overflow-hidden rounded-xl border transition-colors ${
          file
            ? "border-primary/40 bg-surface"
            : "border-accent/15 bg-surface"
        }`}
      >
        {/* Choose File button */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="font-roboto shrink-0 border-r border-accent/15 px-4 py-3 text-[12px] font-medium text-secondary transition-colors hover:bg-accent/8 hover:text-foreground disabled:opacity-50 whitespace-nowrap"
        >
          Choose File
        </button>

        {/* File name / placeholder */}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2 px-4">
          <span
            className={`font-roboto truncate text-[12px] ${
              file ? "text-foreground" : "text-secondary/50"
            }`}
          >
            {file ? file.name : "No file chosen"}
          </span>

          {file && !uploading && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 text-secondary/50 hover:text-pink transition-colors text-[14px] leading-none"
              aria-label={`Remove ${label}`}
            >
              ✕
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          className="sr-only"
          disabled={uploading}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export function UploadDocumentModal({
  open,
  vehicleId,
  onClose,
  onUploaded,
}: UploadDocumentModalProps) {
  const emptyFiles = (): FileMap =>
    Object.fromEntries(DOCUMENT_SLOTS.map((s) => [s.key, null]));

  const [files, setFiles] = useState<FileMap>(emptyFiles);
  const [uploading, setUploading] = useState(false);

  function handleFileChange(key: string, file: File | null) {
    setFiles((prev) => ({ ...prev, [key]: file }));
  }

  function reset() {
    setFiles(emptyFiles());
    setUploading(false);
  }

  function handleClose() {
    if (uploading) return;
    reset();
    onClose();
  }

  const selectedCount = Object.values(files).filter(Boolean).length;
  const canSubmit = selectedCount > 0 && !uploading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setUploading(true);

    // Only upload slots where the user actually chose a file
    const entries = DOCUMENT_SLOTS.filter((s) => files[s.key] instanceof File);

    // Upload sequentially — parallel uploads cause a race condition where each
    // request reads the same DB state and the last write wins, dropping all others.
    let failCount = 0;
    for (const slot of entries) {
      try {
        await memberVehiclesApi.uploadDocument({
          vehicleId,
          documentKey: slot.key,
          file: files[slot.key]!,
        });
      } catch {
        failCount++;
      }
    }

    setUploading(false);

    const successCount = entries.length - failCount;

    if (failCount === 0) {
      showSuccess(
        entries.length === 1
          ? "Document uploaded successfully"
          : `${entries.length} documents uploaded successfully`,
      );
      reset();
      onUploaded();
      onClose();
    } else if (successCount > 0) {
      showError(`${failCount} of ${entries.length} uploads failed. Please retry the failed ones.`);
      reset();
      onUploaded();
      onClose();
    } else {
      showError("All uploads failed. Please try again.");
    }
  }

  if (!open) return null;

  return (
    <ModalPortal>
      <div className={memberRequestModalOverlayClass} style={{ zIndex: 60 }}>
        <div className={memberRequestModalBackdropClass} onClick={handleClose} />

        <div className="relative z-10 mx-4 w-full max-w-[500px] rounded-2xl border border-accent/15 bg-card shadow-2xl flex flex-col max-h-[90vh]">

          {/* Header */}
          <div className="shrink-0 flex items-start justify-between border-b border-accent/10 px-5 py-5">
            <div>
              <h2 className="font-copperplate text-[17px] uppercase leading-none tracking-[0.04em]">
                <span className="text-foreground-soft">Upload </span>
                <span className="text-primary">Documents</span>
              </h2>
              <p className="font-roboto mt-1 text-[11px] text-secondary">
                Select files for any documents you want to upload. PDF, JPG, PNG — max {MAX_SIZE_MB} MB each.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={uploading}
              className={memberRequestModalCloseClass}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Scrollable document list */}
          <form
            id="upload-docs-form"
            onSubmit={handleSubmit}
            className="Custom__Scrollbar flex-1 overflow-y-auto px-5 py-5 space-y-4"
          >
            {DOCUMENT_SLOTS.map((slot) => (
              <DocumentRow
                key={slot.key}
                docKey={slot.key}
                label={slot.label}
                file={files[slot.key]}
                uploading={uploading}
                onChange={handleFileChange}
              />
            ))}
          </form>

          {/* Footer */}
          <div className="shrink-0 border-t border-accent/10 px-5 py-4 space-y-3">
            {selectedCount > 0 && (
              <p className="font-roboto text-center text-[11px] text-secondary">
                {selectedCount} file{selectedCount > 1 ? "s" : ""} selected
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={uploading}
                className="font-roboto flex-1 rounded-full border border-accent/20 py-2.5 text-[11px] font-semibold tracking-[0.12em] text-secondary uppercase transition-colors hover:border-accent/40 hover:text-foreground disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="upload-docs-form"
                disabled={!canSubmit}
                className="font-roboto flex-1 flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-[11px] font-semibold tracking-[0.12em] text-dark uppercase transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {uploading ? (
                  <>
                    <span className="size-3.5 rounded-full border-2 border-dark/30 border-t-dark animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <MemberGarageUploadOutlineIcon className="size-3.5" color="currentColor" />
                    Upload{selectedCount > 1 ? ` ${selectedCount} Files` : ""}
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </ModalPortal>
  );
}
