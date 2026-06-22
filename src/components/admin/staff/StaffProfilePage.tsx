"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MemberStarStat } from "@/components/common/Svgs";
import { staffApi } from "@/api/staff.api";
import { mapStaffProfile } from "@/lib/staff";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
import { showError } from "@/lib/toast";
import type { StaffProfileDetail } from "./types";

type StaffProfilePageProps = {
  staffId: string;
};

type DetailFieldProps = {
  label: string;
  value: string;
};

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="space-y-1.5">
      <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
        {label}
      </p>
      <p className="font-roboto text-[12px] leading-relaxed text-foreground break-words">
        {value}
      </p>
    </div>
  );
}

function statusTone(status: string): string {
  if (status === "active") {
    return "border-teal/40 text-teal";
  }

  if (status === "pending_activation") {
    return "border-primary/40 text-primary";
  }

  return "border-accent/25 text-secondary";
}

export function StaffProfilePage({ staffId }: StaffProfilePageProps) {
  const [profile, setProfile] = useState<StaffProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useSetAdminPageSubtitle(profile?.displayName);

  const loadProfile = useCallback(async () => {
    setLoading(true);

    try {
      const response = await staffApi.getStaffById(staffId);
      setProfile(mapStaffProfile(response.data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load staff profile";

      showError(message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <div className="p-8">
        <p className="font-roboto text-sm text-secondary">Loading staff profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-4 p-8">
        <p className="font-roboto text-sm text-secondary">
          Staff profile could not be loaded.
        </p>
        <Link
          href="/admin/staff"
          className="font-roboto inline-flex text-[10px] font-semibold tracking-[0.12em] text-primary uppercase hover:underline"
        >
          Back to staff
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7 p-8">
      <Link
        href="/admin/staff"
        className="font-roboto inline-flex text-[10px] font-semibold tracking-[0.12em] text-secondary uppercase transition-colors hover:text-primary"
      >
        ← Back to staff
      </Link>

      <section className="rounded-2xl border border-accent/12 bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            {profile.profileImageUrl ? (
              <Image
                src={profile.profileImageUrl}
                alt={profile.displayName}
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#F0C566] to-[#8B6F2A] font-copperplate text-[22px] text-dark shadow-[0_0_24px_rgba(201,168,76,0.32)]">
                {profile.initial}
              </span>
            )}

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-copperplate text-[32px] leading-none tracking-[0.04em] text-foreground uppercase">
                  {profile.displayName}
                </h1>

                <span className="flex items-center gap-1 rounded-full border border-accent/25 px-2.5 py-1">
                  <MemberStarStat color="var(--primary)" className="size-3" />
                  <span className="font-roboto text-[9px] font-medium tracking-[0.1em] text-primary uppercase">
                    {profile.jobTitle}
                  </span>
                </span>
              </div>

              <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary lowercase">
                {profile.email}
              </p>

              <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
                Last seen ·{" "}
                <span className="font-medium text-foreground">{profile.lastSeen}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-accent/8 bg-surface/60 px-5 py-4">
            <span className="font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
              Account Status
            </span>
            <span
              className={`font-roboto rounded-full border px-3 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase ${statusTone(
                profile.accountStatus,
              )}`}
            >
              {profile.accountStatusLabel}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-accent/12 bg-card p-6">
        <h2 className="mb-5 font-copperplate text-[18px] tracking-[0.04em] text-foreground uppercase">
          Staff Details
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <DetailField label="Staff ID" value={profile.id} />
          <DetailField label="First Name" value={profile.firstName} />
          <DetailField label="Last Name" value={profile.lastName} />
          <DetailField label="Email" value={profile.email} />
          <DetailField label="Job Title" value={profile.jobTitle} />
          <DetailField label="Role" value={profile.role} />
          <DetailField label="Account Status" value={profile.accountStatusLabel} />
          <DetailField label="Mobile Country Code" value={profile.mobileCountryCode} />
          <DetailField label="Mobile" value={profile.mobile} />
          <DetailField label="Last Seen" value={profile.lastSeen} />
          <DetailField label="Invited At" value={profile.invitedAt} />
          <DetailField label="Invitation Accepted At" value={profile.invitationAcceptedAt} />
          <DetailField label="Created At" value={profile.createdAt} />
          <DetailField label="Updated At" value={profile.updatedAt} />
        </div>
      </section>
    </div>
  );
}
