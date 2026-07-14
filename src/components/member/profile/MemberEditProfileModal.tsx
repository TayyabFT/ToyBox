"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/common";
import { MemberRequestModalFrame } from "@/components/member/garage/shared/MemberRequestModalFrame";
import {
  memberRequestModalPrimaryButtonFullClass,
  memberRequestModalSecondaryButtonClass,
} from "@/components/member/garage/shared/memberRequestModal";
import type { MemberProfileEditFormState } from "@/lib/memberProfile";

type MemberEditProfileModalProps = {
  open: boolean;
  initialValues: MemberProfileEditFormState;
  saving?: boolean;
  onClose: () => void;
  onSave: (values: MemberProfileEditFormState) => void;
};

export function MemberEditProfileModal({
  open,
  initialValues,
  saving = false,
  onClose,
  onSave,
}: MemberEditProfileModalProps) {
  const [form, setForm] = useState<MemberProfileEditFormState>(initialValues);

  useEffect(() => {
    if (open) {
      setForm(initialValues);
    }
  }, [initialValues, open]);

  function updateField<K extends keyof MemberProfileEditFormState>(
    key: K,
    value: MemberProfileEditFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <MemberRequestModalFrame
      open={open}
      onClose={onClose}
      titleBefore="Edit "
      titleAfter="Details"
      headerSubtitle="Update your profile information"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className={`${memberRequestModalSecondaryButtonClass} w-full flex-none`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(form)}
            disabled={saving}
            className={memberRequestModalPrimaryButtonFullClass}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            value={form.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
          />
          <Input
            label="Last Name"
            value={form.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
          />
        </div>

        <Input
          label="Display Handle"
          value={form.displayHandle}
          placeholder="alexm"
          onChange={(event) => updateField("displayHandle", event.target.value)}
        />

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />

        <Input
          label="Job Title"
          value={form.jobTitle}
          onChange={(event) => updateField("jobTitle", event.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr]">
          <Input
            label="Country Code"
            value={form.mobileCountryCode}
            placeholder="+971"
            onChange={(event) =>
              updateField("mobileCountryCode", event.target.value)
            }
          />
          <Input
            label="Mobile"
            type="tel"
            value={form.mobile}
            onChange={(event) => updateField("mobile", event.target.value)}
          />
        </div>

        <Input
          label="Residence"
          value={form.residence}
          onChange={(event) => updateField("residence", event.target.value)}
        />

        <div className="flex w-full flex-col gap-1">
          <label
            htmlFor="member-profile-address"
            className="font-roboto text-[11px] font-medium tracking-[0.15em] text-[#6E6455] uppercase"
          >
            Address
          </label>
          <textarea
            id="member-profile-address"
            value={form.address}
            rows={3}
            onChange={(event) => updateField("address", event.target.value)}
            className="font-roboto w-full resize-none rounded-lg border border-[#D4A84740] bg-[#11100C] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#7D7460] focus:border-[#C9A84C]"
          />
        </div>

        <Input
          label="Cover Image URL"
          value={form.coverImageUrl}
          placeholder="https://"
          onChange={(event) => updateField("coverImageUrl", event.target.value)}
        />
      </div>
    </MemberRequestModalFrame>
  );
}
