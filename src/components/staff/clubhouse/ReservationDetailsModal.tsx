"use client";

import type { ClubhouseReservation } from "./types";
import { isActionableReservation, isPendingReservation } from "./types";

type ReservationDetailsModalProps = {
  open: boolean;
  reservation: ClubhouseReservation | null;
  loading?: boolean;
  actionLoading?: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onApprove?: () => void;
  onMessageMember?: () => void;
};

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-accent/15 bg-input-muted px-4 py-3.5">
      <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
        {label}
      </p>
      <p className="font-roboto mt-1.5 text-[13px] text-foreground">{value}</p>
    </div>
  );
}

function FooterButton({
  children,
  onClick,
  disabled,
  variant = "default",
}: {
  children: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "danger" | "primary-gold" | "primary-teal";
}) {
  const className =
    variant === "danger"
      ? "border-accent/20 bg-input-muted text-red-400 hover:border-red-500/30 hover:bg-red-950/10"
      : variant === "primary-gold"
        ? "border-transparent bg-gradient-to-r from-gold-bright to-primary font-bold text-dark hover:opacity-95"
        : variant === "primary-teal"
          ? "border-transparent bg-teal font-bold text-dark hover:opacity-95"
          : "border-accent/20 bg-input-muted text-foreground hover:border-accent/35 hover:text-primary";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`font-roboto flex-1 cursor-pointer rounded-xl border px-4 py-3 text-[10px] tracking-[0.12em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

export function ReservationDetailsModal({
  open,
  reservation,
  loading = false,
  actionLoading = false,
  onClose,
  onEdit,
  onCancel,
  onApprove,
  onMessageMember,
}: ReservationDetailsModalProps) {
  if (!open) {
    return null;
  }

  const pending = reservation ? isPendingReservation(reservation.status) : false;
  const prep = reservation?.status === "prep";
  const confirmed = reservation?.status === "confirmed";
  const actionable = reservation ? isActionableReservation(reservation.status) : false;
  const busy = loading || actionLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={busy ? undefined : onClose}
      />

      <div className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-[24px] border border-accent/25 bg-card shadow-[var(--shadow-modal)]">
        <div className="flex items-start justify-between gap-4 border-b border-accent/10 px-6 pb-5 pt-6">
          <div className="space-y-2">
            <p className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
              Reservation Details
            </p>
            <h2 className="font-copperplate text-[24px] uppercase leading-none text-foreground">
              {reservation?.venueTitle ?? "Reservation"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close reservation details"
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

        <div className="Custom__Scrollbar max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
          {loading || !reservation ? (
            <p className="font-roboto py-8 text-center text-sm text-secondary">
              Loading reservation details...
            </p>
          ) : (
            <>
              <div className="flex items-center gap-4 rounded-xl border border-accent/15 bg-input-muted px-4 py-4">
                <span
                  className={`font-roboto flex size-12 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold uppercase ${reservation.avatarClass}`}
                >
                  {reservation.memberInitial}
                </span>
                <div className="min-w-0">
                  <p className="font-roboto text-[14px] font-semibold tracking-[0.04em] text-foreground">
                    {reservation.memberName}
                  </p>
                  <p className="font-roboto mt-1 text-[11px] tracking-[0.03em] text-secondary">
                    {reservation.memberNumber} · {reservation.memberTier}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <DetailCell label="Zone" value={reservation.zone} />
                <DetailCell label="Guests" value={`${reservation.pax} pax`} />
                <DetailCell label="Date & Time" value={reservation.dateTime} />
                <DetailCell label="Occasion" value={reservation.occasion} />
              </div>

              <div className="space-y-2">
                <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
                  Special Requests
                </p>
                <p className="font-roboto rounded-xl border border-accent/15 bg-input-muted px-4 py-3.5 text-[13px] leading-relaxed text-foreground">
                  {reservation.specialRequests}
                </p>
              </div>

              {reservation.arrivalNote ? (
                <div className="space-y-2">
                  <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
                    Arrival Note
                  </p>
                  <p className="font-roboto rounded-xl border border-accent/15 bg-input-muted px-4 py-3.5 text-[13px] leading-relaxed text-foreground">
                    {reservation.arrivalNote}
                  </p>
                </div>
              ) : null}

              {pending ? (
                <div className="rounded-xl border border-primary/20 bg-primary/8 px-4 py-3.5">
                  <p className="font-roboto text-[12px] font-semibold tracking-[0.08em] text-primary uppercase">
                    Pending
                  </p>
                </div>
              ) : prep ? (
                <div className="rounded-xl border border-accent/20 bg-accent/8 px-4 py-3.5">
                  <p className="font-roboto text-[12px] font-semibold tracking-[0.08em] text-accent uppercase">
                    Prep
                  </p>
                </div>
              ) : confirmed ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-teal/20 bg-teal/8 px-4 py-3.5">
                  <p className="font-roboto text-[12px] font-semibold tracking-[0.08em] text-teal uppercase">
                    Confirmed
                  </p>
                  {reservation.confirmedBy && reservation.confirmedAt ? (
                    <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
                      by {reservation.confirmedBy} · {reservation.confirmedAt}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-xl border border-secondary/20 bg-secondary/8 px-4 py-3.5">
                  <p className="font-roboto text-[12px] font-semibold tracking-[0.08em] text-secondary uppercase">
                    Cancelled
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {actionable && reservation ? (
          <div className="flex gap-3 border-t border-accent/10 px-6 py-5">
            <FooterButton disabled={busy} onClick={onEdit}>
              Edit
            </FooterButton>
            <FooterButton disabled={busy} variant="danger" onClick={onCancel}>
              Cancel
            </FooterButton>
            {pending ? (
              <FooterButton
                disabled={busy}
                variant="primary-teal"
                onClick={onApprove}
              >
                {actionLoading ? "Processing..." : "Approve"}
              </FooterButton>
            ) : confirmed ? (
              <FooterButton
                disabled={busy}
                variant="primary-gold"
                onClick={onMessageMember}
              >
                Message member
              </FooterButton>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
