"use client";

import { useEffect, useState } from "react";

type MessageMemberModalProps = {
  open: boolean;
  memberName?: string;
  timeSlot?: string;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (initialMessage: string) => void | Promise<void>;
};

const fieldBorder = "border-accent/18";
const fieldClass =
  "font-roboto w-full rounded-xl border border-accent/18 bg-input-muted px-4 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-accent/60 disabled:cursor-not-allowed disabled:opacity-60";

export function MessageMemberModal({
  open,
  memberName,
  timeSlot,
  submitting = false,
  onClose,
  onSubmit,
}: MessageMemberModalProps) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setMessage(
      timeSlot
        ? `Hi — confirming your table for ${timeSlot}.`
        : "Hi — confirming your Club House reservation.",
    );
  }, [open, timeSlot]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative z-10 w-full max-w-[480px] overflow-hidden rounded-[28px] border ${fieldBorder} bg-card shadow-[var(--shadow-modal)]`}
      >
        <div className={`border-b ${fieldBorder} px-6 pb-5 pt-6`}>
          <p className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
            Concierge
          </p>
          <h2 className="mt-2 font-copperplate text-[22px] uppercase text-foreground">
            Message Member
          </h2>
          {memberName ? (
            <p className="mt-2 font-roboto text-sm text-secondary">{memberName}</p>
          ) : null}
        </div>

        <div className="space-y-2 px-6 py-5">
          <label className="font-roboto block text-[10px] tracking-[0.12em] text-secondary uppercase">
            Initial Message
          </label>
          <textarea
            value={message}
            disabled={submitting}
            rows={4}
            onChange={(event) => setMessage(event.target.value)}
            className={`${fieldClass} resize-none`}
          />
        </div>

        <div
          className={`flex justify-end gap-3 border-t ${fieldBorder} px-6 py-5`}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className={`font-roboto cursor-pointer rounded-xl border ${fieldBorder} bg-input-muted px-5 py-3 text-[11px] font-semibold tracking-[0.12em] text-foreground uppercase transition-colors hover:border-accent/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60`}
          >
            Close
          </button>
          <button
            type="button"
            disabled={submitting || !message.trim()}
            onClick={() => void onSubmit(message.trim())}
            className="font-roboto cursor-pointer rounded-xl bg-gradient-to-r from-gold-bright to-primary px-5 py-3 text-[11px] font-bold tracking-[0.12em] text-dark uppercase disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}
