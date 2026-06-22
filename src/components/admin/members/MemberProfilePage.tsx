"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MemberStarStat } from "@/components/common/Svgs";
import { membersApi } from "@/api/members.api";
import { mapMemberProfile } from "@/lib/members";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
import { showError } from "@/lib/toast";
import type { MemberProfileDetail } from "./types";

type MemberProfilePageProps = {
  memberId: string;
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

type StatItemProps = {
  value: number;
  label: string;
  showDivider?: boolean;
};

function StatItem({ value, label, showDivider = true }: StatItemProps) {
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center py-1 ${
        showDivider ? "border-r border-accent/10" : ""
      }`}
    >
      <p className="font-copperplate text-[28px] leading-none text-primary">
        {value.toLocaleString()}
      </p>
      <p className="mt-1.5 font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
        {label}
      </p>
    </div>
  );
}

export function MemberProfilePage({ memberId }: MemberProfilePageProps) {
  const [profile, setProfile] = useState<MemberProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useSetAdminPageSubtitle(profile?.displayName);

  const loadProfile = useCallback(async () => {
    setLoading(true);

    try {
      const response = await membersApi.getMemberById(memberId);
      setProfile(mapMemberProfile(response.data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load member profile";

      showError(message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <div className="p-8">
        <p className="font-roboto text-sm text-secondary">Loading member profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-4 p-8">
        <p className="font-roboto text-sm text-secondary">
          Member profile could not be loaded.
        </p>
        <Link
          href="/admin/members"
          className="font-roboto inline-flex text-[10px] font-semibold tracking-[0.12em] text-primary uppercase hover:underline"
        >
          Back to members
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7 p-8">
      <Link
        href="/admin/members"
        className="font-roboto inline-flex text-[10px] font-semibold tracking-[0.12em] text-secondary uppercase transition-colors hover:text-primary"
      >
        ← Back to members
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
                    {profile.tierLabel}
                  </span>
                </span>
              </div>

              <p className="font-roboto text-[10px] tracking-[0.06em] text-secondary uppercase">
                {profile.memberSinceLabel}
              </p>

              <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
                Last seen ·{" "}
                <span className="font-medium text-foreground">{profile.lastSeen}</span>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-accent/8 bg-surface/60 px-1 py-3 lg:min-w-[420px]">
            <div className="flex">
              <StatItem value={profile.vehicles} label="Vehicles" />
              <StatItem value={profile.events} label="Events" />
              <StatItem value={profile.miles} label="Miles" />
              <StatItem value={profile.days} label="Days" showDivider={false} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-accent/12 bg-card p-6">
        <h2 className="mb-5 font-copperplate text-[18px] tracking-[0.04em] text-foreground uppercase">
          Member Details
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <DetailField label="Member ID" value={profile.id} />
          <DetailField label="Member Number" value={profile.memberNumber} />
          <DetailField label="Member Number Label" value={profile.memberNumberLabel} />
          <DetailField label="First Name" value={profile.firstName} />
          <DetailField label="Last Name" value={profile.lastName} />
          <DetailField label="Email" value={profile.email} />
          <DetailField label="Mobile Country Code" value={profile.mobileCountryCode} />
          <DetailField label="Mobile" value={profile.mobile} />
          <DetailField label="Residence" value={profile.residence} />
          <DetailField label="Display Handle" value={profile.displayHandle} />
          <DetailField label="Membership Tier" value={profile.membershipTier} />
          <DetailField label="Tier Label" value={profile.tierLabel} />
          <DetailField label="Member Since" value={profile.memberSince} />
          <DetailField label="Account Status" value={profile.accountStatus} />
          <DetailField label="On Premises" value={profile.onPremises} />
          <DetailField label="Membership Valid Until" value={profile.membershipValidUntil} />
          <DetailField
            label="Membership Validity Months"
            value={profile.membershipValidityMonths}
          />
          <DetailField label="Invited At" value={profile.invitedAt} />
          <DetailField label="Invitation Accepted At" value={profile.invitationAcceptedAt} />
          <DetailField label="Privacy Settings" value={profile.privacySettings} />
        </div>
      </section>
    </div>
  );
}
