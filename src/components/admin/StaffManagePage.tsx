"use client";

import { useState } from "react";
import { InviteModal } from "@/components/admin/InviteModal";
import { ResendOtpModal } from "@/components/admin/ResendOtpModal";
import { SectionHeader } from "@/components/ui";

export function StaffManagePage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [resendOpen, setResendOpen] = useState(false);

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-3">
        <p className="font-roboto text-xs tracking-[0.14em] text-primary uppercase">
          Manage
        </p>
        <h1 className="font-copperplate text-[32px] leading-tight text-foreground">
          Staff Access
        </h1>
        <p className="font-roboto max-w-xl text-sm text-secondary">
          Invite new staff members and manage club access credentials.
        </p>
      </div>

      <section className="max-w-2xl rounded-2xl border border-accent/12 bg-surface p-5">
        <SectionHeader title="Invitations" />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="font-roboto cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold tracking-[0.12em] text-dark uppercase"
          >
            Invite
          </button>

          <button
            type="button"
            onClick={() => setResendOpen(true)}
            className="font-roboto cursor-pointer rounded-lg border border-accent/25 px-5 py-2.5 text-sm font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:border-primary/40"
          >
            Resend OTP
          </button>
        </div>
      </section>

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        lockedRole="staff"
      />
      <ResendOtpModal open={resendOpen} onClose={() => setResendOpen(false)} />
    </div>
  );
}
