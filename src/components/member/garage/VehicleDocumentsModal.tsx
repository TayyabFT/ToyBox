"use client";

import { useEffect, useState } from "react";
import {
  MemberGarageChevronRight,
  MemberGarageUploadOutlineIcon,
  MemberVehicleDocumentFileIcon,
} from "@/components/common/Svgs";
import {
  memberRequestModalBackdropClass,
  memberRequestModalBodyClass,
  memberRequestModalCloseClass,
  memberRequestModalOverlayClass,
  memberRequestModalPanelClass,
} from "./shared/memberRequestModal";
import type {
  MemberVehicleDocument,
  MemberVehicleDocumentBadgeTone,
  MemberVehicleDocumentIconTone,
} from "./types";

const iconToneStyles: Record<
  MemberVehicleDocumentIconTone,
  { box: string; color: string; showCheck?: boolean }
> = {
  red: {
    box: "border-pink/25 bg-pink/10",
    color: "#F472B6",
  },
  blue: {
    box: "border-info/25 bg-info/10",
    color: "#60A5FA",
  },
  orange: {
    box: "border-primary/25 bg-primary/10",
    color: "#D4A847",
  },
  green: {
    box: "border-teal/25 bg-teal/10",
    color: "#2DD4BF",
  },
  greenCheck: {
    box: "border-teal/25 bg-teal/10",
    color: "#2DD4BF",
    showCheck: true,
  },
};

const badgeToneClass: Record<MemberVehicleDocumentBadgeTone, string> = {
  valid: "border-teal/30 bg-teal/10 text-teal",
  expiring: "border-primary/30 bg-primary/10 text-primary",
  expired: "border-pink/30 bg-pink/10 text-pink",
};

type VehicleDocumentsModalProps = {
  open: boolean;
  onClose: () => void;
  documents: MemberVehicleDocument[];
};

function isImageUrl(url: string): boolean {
  const extension = url.split("?")[0]?.split(".").pop()?.toLowerCase();

  return ["jpg", "jpeg", "png", "webp", "gif"].includes(extension ?? "");
}

type DocumentRowProps = {
  document: MemberVehicleDocument;
  isSelected: boolean;
  onSelect: () => void;
};

function DocumentRow({ document, isSelected, onSelect }: DocumentRowProps) {
  const iconStyle = iconToneStyles[document.iconTone];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={isSelected}
      className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
        isSelected
          ? "border-primary/40 bg-primary/8"
          : "border-accent/10 bg-dark hover:border-primary/30 hover:bg-primary/5"
      }`}
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${iconStyle.box}`}
      >
        <MemberVehicleDocumentFileIcon
          color={iconStyle.color}
          showCheck={iconStyle.showCheck}
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="font-roboto block truncate text-[13px] font-semibold text-foreground">
          {document.title}
        </span>
        <span className="font-roboto mt-0.5 block truncate text-[10px] text-secondary/75">
          {document.subtitle}
        </span>
      </span>

      {document.badge ? (
        <span
          className={`font-roboto shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.08em] uppercase ${badgeToneClass[document.badge.tone]}`}
        >
          {document.badge.label}
        </span>
      ) : null}

      <MemberGarageChevronRight
        className={`size-3 shrink-0 text-secondary/60 transition-transform duration-200 group-hover:text-primary ${
          isSelected ? "rotate-90 text-primary" : ""
        }`}
        color="currentColor"
      />
    </button>
  );
}

function DocumentPreview({ document }: { document: MemberVehicleDocument }) {
  const isImage = isImageUrl(document.url);

  return (
    <div className="overflow-hidden rounded-xl border border-accent/10 bg-black/30">
      {isImage ? (
        <img
          src={document.url}
          alt={document.title}
          className="max-h-[min(42vh,360px)] w-full object-contain"
        />
      ) : (
        <iframe
          src={document.url}
          title={document.title}
          className="h-[min(42vh,360px)] w-full bg-dark"
        />
      )}
    </div>
  );
}

export function VehicleDocumentsModal({
  open,
  onClose,
  documents,
}: VehicleDocumentsModalProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedKey(null);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className={memberRequestModalOverlayClass}>
      <div className={memberRequestModalBackdropClass} onClick={onClose} />

      <div className={`${memberRequestModalPanelClass} max-w-[640px]`}>
        <div className="relative shrink-0 border-b border-accent/10 px-6 pb-5 pt-6">
          <button
            type="button"
            onClick={onClose}
            className={memberRequestModalCloseClass}
            aria-label="Close"
          >
            ✕
          </button>

          <div className="flex flex-col gap-4 pr-10 sm:flex-row sm:items-start sm:justify-between">
            <h2 className="font-copperplate text-[20px] leading-none tracking-[0.04em] uppercase">
              <span className="text-foreground-soft">Vehicle </span>
              <span className="text-primary">Documents</span>
            </h2>

            <button
              type="button"
              className="font-roboto flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-full border border-primary/40 px-4 py-2 text-[10px] font-semibold tracking-[0.14em] text-primary uppercase transition-colors hover:border-primary hover:bg-primary/8"
            >
              <MemberGarageUploadOutlineIcon className="size-3.5" color="currentColor" />
              Upload Document
            </button>
          </div>
        </div>

        <div className={`${memberRequestModalBodyClass} space-y-2.5`}>
          {documents.length > 0 ? (
            documents.map((document) => {
              const isSelected = selectedKey === document.key;

              return (
                <div key={document.key} className="space-y-2">
                  <DocumentRow
                    document={document}
                    isSelected={isSelected}
                    onSelect={() =>
                      setSelectedKey((current) =>
                        current === document.key ? null : document.key,
                      )
                    }
                  />

                  {isSelected ? <DocumentPreview document={document} /> : null}
                </div>
              );
            })
          ) : (
            <p className="font-roboto py-8 text-center text-sm text-secondary">
              No documents uploaded for this vehicle yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
