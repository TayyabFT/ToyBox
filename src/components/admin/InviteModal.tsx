"use client";

import { useEffect, useState } from "react";
import { Dropdown, Input } from "@/components/common";
import { useTheme } from "@/components/common/ThemeProvider";
import {
  DEFAULT_MEMBER_DESIGNATION,
  DEFAULT_VALIDITY_MONTHS,
  MEMBER_DESIGNATION_OPTIONS,
  validityMonthDropdownOptions,
} from "@/lib/invitations";
import { showToast } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendInvite } from "@/store/slices/adminSlice";
import type { InviteRole, MemberDesignation } from "@/types/api";

const LIGHT_PANEL_STYLE = {
  backgroundColor: "#D0C8BC",
} as const;

const LIGHT_CTA_STYLE = {
  backgroundColor: "#D0C8BC",
  backgroundImage: "linear-gradient(90deg, #8A7D6A 0%, #D0C8BC 100%)",
  color: "#1A1816",
  boxShadow: "none",
} as const;

type FieldErrors = {
  fullName?: string;
  email?: string;
  designation?: string;
  jobTitle?: string;
  validityMonths?: string;
};

function validateInvite(
  role: InviteRole,
  fullName: string,
  email: string,
  designation: string,
  jobTitle: string,
  validityMonths: string,
): FieldErrors {
  const errors: FieldErrors = {};

  if (!fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (role === "member" && !designation) {
    errors.designation = "Designation is required";
  }

  if (role === "staff" && !jobTitle.trim()) {
    errors.jobTitle = "Job title is required";
  }

  if (!validityMonths) {
    errors.validityMonths = "Validity is required";
  }

  return errors;
}

export function InviteModal({
  open,
  onClose,
  lockedRole,
}: {
  open: boolean;
  onClose: () => void;
  lockedRole?: InviteRole;
}) {
  const dispatch = useAppDispatch();
  const { inviteLoading } = useAppSelector((state) => state.admin);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const role = lockedRole ?? "member";
  const isMember = role === "member";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState<string>(
    DEFAULT_MEMBER_DESIGNATION,
  );
  const [jobTitle, setJobTitle] = useState("");
  const [validityMonths, setValidityMonths] = useState<string>(
    String(DEFAULT_VALIDITY_MONTHS),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!open) return;

    setFullName("");
    setEmail("");
    setDesignation(DEFAULT_MEMBER_DESIGNATION);
    setJobTitle("");
    setValidityMonths(String(DEFAULT_VALIDITY_MONTHS));
    setFieldErrors({});
  }, [open, role]);

  function handleClose() {
    onClose();
  }

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSendInvite() {
    const errors = validateInvite(
      role,
      fullName,
      email,
      designation,
      jobTitle,
      validityMonths,
    );

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const payload = {
      role,
      fullName: fullName.trim(),
      email: email.trim(),
      validityMonths: Number(validityMonths),
      ...(isMember
        ? { designation: designation as MemberDesignation }
        : { jobTitle: jobTitle.trim() }),
    };

    const result = await dispatch(sendInvite(payload));

    if (sendInvite.fulfilled.match(result)) {
      showToast.success({
        title: "Invitation Sent",
        message: result.payload.message || "Invite delivered successfully",
      });
      handleClose();
      return;
    }

    showToast.error({
      title: "Invite Failed",
      message: (result.payload as string) || "Failed to send invite",
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close invite modal"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className="admin-modal-panel relative z-10 w-full max-w-md rounded-2xl border border-accent/25 p-8 shadow-[var(--shadow-modal)]"
        style={isLight ? LIGHT_PANEL_STYLE : undefined}
      >
        <p className="font-roboto text-[10px] tracking-[0.18em] text-section-label uppercase">
          {isMember ? "Member Directory" : "Staff Directory"}
        </p>

        <h2 className="mt-2 font-copperplate text-[28px] leading-none tracking-[0.04em] text-accent uppercase">
          {isMember ? "Invite Member" : "Invite Staff"}
        </h2>

        <div className="mt-6 border-t border-accent/25" />

        <div className="mt-6 flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="e.g. Layla Hassan"
            value={fullName}
            error={fieldErrors.fullName}
            onChange={(event) => {
              setFullName(event.target.value);
              clearFieldError("fullName");
            }}
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="name@example.com"
            value={email}
            error={fieldErrors.email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearFieldError("email");
            }}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {isMember ? (
              <Dropdown
                label="Designation"
                options={MEMBER_DESIGNATION_OPTIONS}
                value={designation}
                placeholder="Select designation"
                error={fieldErrors.designation}
                onChange={(value) => {
                  setDesignation(value);
                  clearFieldError("designation");
                }}
              />
            ) : (
              <Input
                label="Job Title"
                type="text"
                name="jobTitle"
                placeholder="e.g. Concierge"
                value={jobTitle}
                error={fieldErrors.jobTitle}
                onChange={(event) => {
                  setJobTitle(event.target.value);
                  clearFieldError("jobTitle");
                }}
              />
            )}

            <Dropdown
              label="Validity"
              options={validityMonthDropdownOptions}
              value={validityMonths}
              placeholder="Select validity"
              error={fieldErrors.validityMonths}
              onChange={(value) => {
                setValidityMonths(value);
                clearFieldError("validityMonths");
              }}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={inviteLoading}
            className="font-roboto cursor-pointer rounded-full border border-accent/25 px-6 py-3 text-[10px] font-semibold tracking-[0.16em] text-foreground uppercase transition-colors hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSendInvite}
            disabled={inviteLoading}
            className="admin-gold-cta font-roboto cursor-pointer rounded-full px-6 py-3 text-[10px] font-semibold tracking-[0.16em] uppercase disabled:cursor-not-allowed disabled:opacity-60"
            style={isLight ? LIGHT_CTA_STYLE : undefined}
          >
            {inviteLoading ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
