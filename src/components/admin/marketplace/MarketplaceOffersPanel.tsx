"use client";

import { useMemo, useState } from "react";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { MarketplaceOfferStatusBadge } from "./MarketplaceStatusBadge";
import type { MarketplaceOfferItem } from "./types";

type MarketplaceOffersPanelProps = {
  offers: MarketplaceOfferItem[];
  loading?: boolean;
  actionLoadingId?: string | null;
  onOpenOffer: (offer: MarketplaceOfferItem) => void;
  onApprove: (offer: MarketplaceOfferItem) => void;
  onReject: (offer: MarketplaceOfferItem) => void;
  onCounter: (offer: MarketplaceOfferItem) => void;
  onApprovePayment: (offer: MarketplaceOfferItem) => void;
  onRejectPayment: (offer: MarketplaceOfferItem) => void;
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "payment", label: "Payment" },
  { key: "purchased", label: "Purchased" },
  { key: "rejected", label: "Rejected" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export function MarketplaceOffersPanel({
  offers,
  loading = false,
  actionLoadingId = null,
  onOpenOffer,
  onApprove,
  onReject,
  onCounter,
  onApprovePayment,
  onRejectPayment,
}: MarketplaceOffersPanelProps) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const rows = useMemo(() => {
    if (filter === "all") return offers;
    return offers.filter((offer) => offer.statusTone === filter);
  }, [filter, offers]);

  return (
    <section
      className="rounded-2xl border border-accent/12 bg-card p-5"
      aria-busy={loading}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="font-copperplate text-[16px] tracking-[0.06em] text-foreground uppercase">
            Marketplace <span className="text-accent">Offers</span>
          </h2>
          <p className="font-roboto text-[9px] tracking-[0.14em] text-secondary uppercase">
            Click row for detail · Approve · Reject · Counter · Payment
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => {
            const active = filter === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`font-roboto cursor-pointer rounded-full px-3 py-1.5 text-[9px] font-semibold tracking-[0.1em] uppercase ${
                  active
                    ? "admin-gold-cta"
                    : "border border-accent/25 text-secondary"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr className="border-b border-accent/10">
              {["Vehicle", "Member", "Offer"].map((label) => (
                <th
                  key={label}
                  className="font-roboto px-3 pb-3 text-left text-[9px] font-medium tracking-[0.12em] text-secondary uppercase"
                >
                  {label}
                </th>
              ))}
              <th className="font-roboto px-3 pb-3 text-center text-[9px] font-medium tracking-[0.12em] text-secondary uppercase">
                Status
              </th>
              <th className="font-roboto px-3 pb-3 text-left text-[9px] font-medium tracking-[0.12em] text-secondary uppercase">
                Remarks
              </th>
              <th className="font-roboto sticky right-0 bg-card px-3 pb-3 text-right text-[9px] font-medium tracking-[0.12em] text-secondary uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={index} className="border-b border-accent/6 last:border-b-0">
                  <td colSpan={6} className="px-3 py-4">
                    <ShimmerBlock className="h-12 w-full rounded-xl" />
                  </td>
                </tr>
              ))
            ) : rows.length > 0 ? (
              rows.map((offer) => {
                const busy = actionLoadingId === offer.id;

                return (
                  <tr
                    key={offer.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpenOffer(offer)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onOpenOffer(offer);
                      }
                    }}
                    className="cursor-pointer border-b border-accent/6 transition-colors last:border-b-0 hover:bg-accent/3"
                  >
                    <td className="min-w-0 px-3 py-4">
                      <p className="font-roboto truncate text-[13px] font-semibold text-foreground">
                        {offer.vehicleTitle}
                      </p>
                      <p className="font-roboto text-[10px] text-secondary uppercase">
                        List {offer.vehiclePriceLabel}
                      </p>
                    </td>

                    <td className="min-w-0 px-3 py-4">
                      <p className="font-roboto truncate text-[12px] text-foreground">
                        {offer.memberName}
                      </p>
                      <p className="font-roboto text-[10px] text-secondary uppercase">
                        {offer.memberTier || "—"}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <p className="font-roboto text-[12px] font-semibold text-accent">
                        {offer.offerPriceLabel}
                      </p>
                      {offer.counterOfferPriceLabel ? (
                        <p className="font-roboto text-[10px] text-primary uppercase">
                          Counter {offer.counterOfferPriceLabel}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-3 py-4 text-center">
                      <div className="flex justify-center">
                        <MarketplaceOfferStatusBadge
                          label={offer.statusLabel}
                          tone={offer.statusTone}
                        />
                      </div>
                    </td>

                    <td className="px-3 py-4">
                      <p className="font-roboto line-clamp-2 text-[11px] italic text-secondary">
                        {offer.remarks || "—"}
                      </p>
                    </td>

                    <td
                      className="sticky right-0 bg-card px-3 py-4 text-right"
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                    >
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {offer.canApprove ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => onApprove(offer)}
                            className="admin-gold-cta font-roboto cursor-pointer rounded-full px-3.5 py-2 text-[9px] font-bold tracking-[0.1em] uppercase disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Approve
                          </button>
                        ) : null}

                        {offer.canCounter ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => onCounter(offer)}
                            className="font-roboto cursor-pointer rounded-full border border-accent/30 bg-card px-3.5 py-2 text-[9px] font-bold tracking-[0.1em] text-foreground uppercase transition-colors hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Counter
                          </button>
                        ) : null}

                        {offer.canReject ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => onReject(offer)}
                            className="font-roboto cursor-pointer rounded-full border border-pink/35 bg-pink/8 px-3.5 py-2 text-[9px] font-bold tracking-[0.1em] text-pink uppercase disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Reject
                          </button>
                        ) : null}

                        {offer.canApprovePayment ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => onApprovePayment(offer)}
                            className="admin-gold-cta font-roboto cursor-pointer rounded-full px-3.5 py-2 text-[9px] font-bold tracking-[0.1em] uppercase disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Approve Payment
                          </button>
                        ) : null}

                        {offer.canRejectPayment ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => onRejectPayment(offer)}
                            className="font-roboto cursor-pointer rounded-full border border-pink/35 bg-pink/8 px-3.5 py-2 text-[9px] font-bold tracking-[0.1em] text-pink uppercase disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Reject Payment
                          </button>
                        ) : null}

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onOpenOffer(offer)}
                          className="font-roboto cursor-pointer rounded-full border border-accent/25 px-3.5 py-2 text-[9px] font-bold tracking-[0.1em] text-secondary uppercase hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="font-roboto px-3 py-10 text-center text-sm text-secondary"
                >
                  No marketplace offers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
