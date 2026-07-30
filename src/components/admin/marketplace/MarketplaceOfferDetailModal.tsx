"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/common/Input";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import type { MarketplaceOfferAction } from "@/types/api";
import { MarketplaceOfferStatusBadge } from "./MarketplaceStatusBadge";
import type { MarketplaceOfferItem } from "./types";

type OfferFormAction = Extract<
  MarketplaceOfferAction,
  "reject" | "counter" | "reject_payment"
>;

type MarketplaceOfferDetailModalProps = {
  open: boolean;
  offer: MarketplaceOfferItem | null;
  loading?: boolean;
  submitting?: boolean;
  initialAction?: OfferFormAction | null;
  onClose: () => void;
  onAction: (payload: {
    action: MarketplaceOfferAction;
    counterOfferPrice?: number;
    remarks?: string;
  }) => void;
};

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MarketplaceOfferDetailModal({
  open,
  offer,
  loading = false,
  submitting = false,
  initialAction = null,
  onClose,
  onAction,
}: MarketplaceOfferDetailModalProps) {
  const [pendingAction, setPendingAction] = useState<OfferFormAction | null>(
    null,
  );
  const [counterOfferPrice, setCounterOfferPrice] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setPendingAction(initialAction);
    setError("");
    setRemarks("");
    setCounterOfferPrice(
      offer?.counterOfferPrice
        ? String(offer.counterOfferPrice)
        : offer?.offerPrice
          ? String(offer.offerPrice)
          : "",
    );
  }, [open, offer, initialAction]);

  if (!open) return null;

  const hasActions =
    offer &&
    (offer.canApprove ||
      offer.canReject ||
      offer.canCounter ||
      offer.canApprovePayment ||
      offer.canRejectPayment);

  function startAction(action: OfferFormAction) {
    setPendingAction(action);
    setError("");
  }

  function handleConfirmForm() {
    if (!pendingAction) return;

    if (pendingAction === "counter") {
      const price = Number(counterOfferPrice);

      if (!counterOfferPrice.trim() || Number.isNaN(price) || price <= 0) {
        setError("Enter a valid counter offer price.");
        return;
      }

      onAction({
        action: pendingAction,
        counterOfferPrice: price,
        remarks: remarks.trim() || undefined,
      });
      return;
    }

    onAction({
      action: pendingAction,
      remarks: remarks.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (submitting) return;
          onClose();
        }}
      />

      <div className="admin-modal-panel relative z-10 flex max-h-[92vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[28px] border border-accent/20 shadow-[var(--shadow-modal)]">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-accent/10 px-6 py-5">
          <div className="space-y-1">
            <h2 className="font-copperplate text-[18px] tracking-[0.06em] text-foreground uppercase">
              Offer Detail
            </h2>
            <p className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
              {offer ? `Offer #${offer.id}` : "Loading..."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close offer detail"
            className="font-roboto flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-accent/20 bg-input-muted text-secondary transition-colors hover:border-accent/35 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="Custom__Scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {loading || !offer ? (
            <div className="space-y-4" aria-busy="true">
              <ShimmerBlock className="h-5 w-40" />
              <ShimmerBlock className="h-24 w-full rounded-xl" />
              <ShimmerBlock className="h-24 w-full rounded-xl" />
              <ShimmerBlock className="h-12 w-full rounded-xl" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <MarketplaceOfferStatusBadge
                  label={offer.statusLabel}
                  tone={offer.statusTone}
                />
                <p className="font-roboto text-[10px] tracking-[0.08em] text-secondary uppercase">
                  {formatDate(offer.createdAt)}
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-accent/12 bg-input-muted/40">
                {offer.vehicleImageUrl ? (
                  <img
                    src={offer.vehicleImageUrl}
                    alt={offer.vehicleTitle}
                    className="h-40 w-full object-cover"
                  />
                ) : null}
                <div className="space-y-2 p-4">
                  <p className="font-roboto text-[9px] tracking-[0.14em] text-secondary uppercase">
                    Vehicle
                  </p>
                  <h3 className="font-copperplate text-[15px] tracking-[0.04em] text-foreground uppercase">
                    {offer.vehicleTitle}
                  </h3>
                  {offer.vehicleSubtitle ? (
                    <p className="font-roboto text-[11px] text-secondary uppercase">
                      {offer.vehicleSubtitle}
                    </p>
                  ) : null}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <DetailCell label="List Price" value={offer.vehiclePriceLabel} />
                    <DetailCell
                      label="Year"
                      value={offer.vehicleYear ? String(offer.vehicleYear) : "—"}
                    />
                    <DetailCell label="Color" value={offer.vehicleColor || "—"} />
                    <DetailCell
                      label="Mileage"
                      value={offer.vehicleMileageLabel || "—"}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailCard
                  title="Member"
                  rows={[
                    ["Name", offer.memberName],
                    ["Email", offer.memberEmail || "—"],
                    ["Tier", offer.memberTier || "—"],
                  ]}
                />
                <DetailCard
                  title="Offer"
                  rows={[
                    ["Offer Price", offer.offerPriceLabel],
                    [
                      "Counter",
                      offer.counterOfferPriceLabel || "—",
                    ],
                    ["Updated", formatDate(offer.updatedAt)],
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-accent/12 px-4 py-3">
                <p className="font-roboto text-[9px] tracking-[0.14em] text-secondary uppercase">
                  Remarks
                </p>
                <p className="font-roboto mt-2 text-sm leading-relaxed text-foreground">
                  {offer.remarks || "No remarks"}
                </p>
              </div>

              {pendingAction ? (
                <div className="space-y-4 rounded-2xl border border-accent/20 bg-input-muted/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-roboto text-[10px] font-semibold tracking-[0.12em] text-foreground uppercase">
                      {pendingAction === "counter"
                        ? "Counter Offer"
                        : pendingAction === "reject_payment"
                          ? "Reject Payment"
                          : "Reject Offer"}
                    </p>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => setPendingAction(null)}
                      className="font-roboto cursor-pointer text-[10px] tracking-[0.1em] text-secondary uppercase hover:text-foreground disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>

                  {pendingAction === "counter" ? (
                    <Input
                      label="Counter Offer Price"
                      type="number"
                      min={0}
                      value={counterOfferPrice}
                      onChange={(event) =>
                        setCounterOfferPrice(event.target.value)
                      }
                      placeholder="e.g. 450000"
                    />
                  ) : null}

                  <div className="space-y-2">
                    <label className="font-roboto block text-[11px] tracking-[0.04em] text-foreground">
                      Remarks
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(event) => setRemarks(event.target.value)}
                      rows={3}
                      className="font-roboto w-full resize-none rounded-xl border border-accent/15 bg-input-muted px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-secondary/80 focus:border-accent/35"
                      placeholder="Optional note"
                    />
                  </div>

                  {error ? (
                    <p className="font-roboto text-[11px] text-pink">{error}</p>
                  ) : null}

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleConfirmForm}
                    className="admin-gold-cta font-roboto w-full cursor-pointer rounded-2xl py-3.5 text-sm font-bold tracking-[0.08em] uppercase disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "Submitting..."
                      : pendingAction === "counter"
                        ? "Send Counter"
                        : pendingAction === "reject_payment"
                          ? "Reject Payment"
                          : "Reject Offer"}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>

        {!loading && offer && hasActions && !pendingAction ? (
          <div className="flex shrink-0 flex-wrap gap-2 border-t border-accent/10 px-6 py-5">
            {offer.canApprove ? (
              <button
                type="button"
                disabled={submitting}
                onClick={() => onAction({ action: "approve" })}
                className="admin-gold-cta font-roboto cursor-pointer rounded-2xl px-4 py-3 text-[10px] font-bold tracking-[0.1em] uppercase disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "..." : "Approve"}
              </button>
            ) : null}

            {offer.canCounter ? (
              <button
                type="button"
                disabled={submitting}
                onClick={() => startAction("counter")}
                className="font-roboto cursor-pointer rounded-2xl border border-accent/30 bg-card px-4 py-3 text-[10px] font-bold tracking-[0.1em] text-foreground uppercase transition-colors hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Counter
              </button>
            ) : null}

            {offer.canReject ? (
              <button
                type="button"
                disabled={submitting}
                onClick={() => startAction("reject")}
                className="font-roboto cursor-pointer rounded-2xl border border-pink/35 bg-pink/8 px-4 py-3 text-[10px] font-bold tracking-[0.1em] text-pink uppercase disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reject
              </button>
            ) : null}

            {offer.canApprovePayment ? (
              <button
                type="button"
                disabled={submitting}
                onClick={() => onAction({ action: "approve_payment" })}
                className="admin-gold-cta font-roboto cursor-pointer rounded-2xl px-4 py-3 text-[10px] font-bold tracking-[0.1em] uppercase disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "..." : "Approve Payment"}
              </button>
            ) : null}

            {offer.canRejectPayment ? (
              <button
                type="button"
                disabled={submitting}
                onClick={() => startAction("reject_payment")}
                className="font-roboto cursor-pointer rounded-2xl border border-pink/35 bg-pink/8 px-4 py-3 text-[10px] font-bold tracking-[0.1em] text-pink uppercase disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reject Payment
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
        {label}
      </p>
      <p className="font-roboto mt-1 text-[12px] text-foreground">{value}</p>
    </div>
  );
}

function DetailCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, string]>;
}) {
  return (
    <div className="rounded-2xl border border-accent/12 px-4 py-3">
      <p className="font-roboto text-[9px] tracking-[0.14em] text-secondary uppercase">
        {title}
      </p>
      <div className="mt-3 space-y-2.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-3">
            <span className="font-roboto text-[10px] tracking-[0.08em] text-secondary uppercase">
              {label}
            </span>
            <span className="font-roboto text-right text-[12px] text-foreground">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
