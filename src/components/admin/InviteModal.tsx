"use client";

import { useEffect, useState } from "react";
import { Dropdown, Input } from "@/components/common";
import { useTheme } from "@/components/common/ThemeProvider";
import { showToast } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendInvite } from "@/store/slices/adminSlice";
import type { InviteRole } from "@/types/api";

const LIGHT_PANEL_STYLE = {
  backgroundColor: "#D0C8BC",
} as const;

const LIGHT_CTA_STYLE = {
  backgroundColor: "#D0C8BC",
  backgroundImage: "linear-gradient(90deg, #8A7D6A 0%, #D0C8BC 100%)",
  color: "#1A1816",
  boxShadow: "none",
} as const;

const roleOptions = [
  { label: "Member", value: "member" },
  { label: "Staff", value: "staff" },
];

type FieldErrors = {
  role?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

const validateInvite = (
  role: string,
  email: string,
  firstName: string,
  lastName: string,
): FieldErrors => {
  const errors: FieldErrors = {};

  if (!role) {
    errors.role = "Role is required";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  return errors;
};

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

  const [role, setRole] = useState(lockedRole ?? "");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (open && lockedRole) {
      setRole(lockedRole);
    }
  }, [open, lockedRole]);

  function resetForm() {
    setRole(lockedRole ?? "");
    setEmail("");
    setFirstName("");
    setLastName("");
    setFieldErrors({});
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSendInvite() {
    const errors = validateInvite(role, email, firstName, lastName);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const result = await dispatch(
      sendInvite({
        role: role as InviteRole,
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      }),
    );

    if (sendInvite.fulfilled.match(result)) {
      console.log("Invite Response:", result.payload);
      showToast.success({
        title: "Invitation Sent",
        message: result.payload.message || "Invite delivered successfully",
      });
      resetForm();
      onClose();
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="admin-modal-panel relative z-10 w-full max-w-md rounded-2xl border border-accent/25 p-6 shadow-[var(--shadow-modal)]"
        style={isLight ? LIGHT_PANEL_STYLE : undefined}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg tracking-[0.06em] text-foreground uppercase">
            Send Invite
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer text-secondary transition-colors hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Dropdown
            label="Role"
            options={roleOptions}
            value={role}
            placeholder="Select role"
            error={fieldErrors.role}
            disabled={Boolean(lockedRole)}
            onChange={(value) => {
              setRole(value);
              if (fieldErrors.role) {
                setFieldErrors((prev) => ({ ...prev, role: undefined }));
              }
            }}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Enter email"
            value={email}
            error={fieldErrors.email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
          />

          <Input
            label="First Name"
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={firstName}
            error={fieldErrors.firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (fieldErrors.firstName) {
                setFieldErrors((prev) => ({ ...prev, firstName: undefined }));
              }
            }}
          />

          <Input
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={lastName}
            error={fieldErrors.lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (fieldErrors.lastName) {
                setFieldErrors((prev) => ({ ...prev, lastName: undefined }));
              }
            }}
          />

          <button
            type="button"
            onClick={handleSendInvite}
            disabled={inviteLoading}
            className="admin-gold-cta mt-2 w-full cursor-pointer rounded-lg py-3 text-sm font-roboto font-semibold tracking-[0.15em] uppercase disabled:opacity-60"
            style={isLight ? LIGHT_CTA_STYLE : undefined}
          >
            {inviteLoading ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
