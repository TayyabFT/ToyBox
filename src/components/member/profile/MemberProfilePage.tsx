"use client";

import { useCallback, useEffect, useState } from "react";
import { authApi } from "@/api/auth.api";
import { EditPencil, StarFilled } from "@/components/common/Svgs";
import {
  buildMemberProfileUpdatePayload,
  mapAuthProfileToEditForm,
  mapMemberProfileData,
  type MemberProfileEditFormState,
} from "@/lib/memberProfile";
import { showError, showSuccess } from "@/lib/toast";
import type { AuthProfileData } from "@/types/api";
import { MemberEditProfileModal } from "./MemberEditProfileModal";
import { memberProfileMock } from "./mockData";
import { MemberProfileSettingsGrid } from "./MemberProfileSettingsGrid";
import type { MemberProfileData } from "./types";

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "A";
}

const EMPTY_EDIT_FORM: MemberProfileEditFormState = {
  firstName: "",
  lastName: "",
  displayHandle: "",
  email: "",
  jobTitle: "",
  mobile: "",
  mobileCountryCode: "",
  residence: "",
  address: "",
  coverImageUrl: "",
};

export function MemberProfilePage() {
  const [data, setData] = useState<MemberProfileData>(memberProfileMock);
  const [profileRaw, setProfileRaw] = useState<AuthProfileData | null>(null);
  const [editForm, setEditForm] =
    useState<MemberProfileEditFormState>(EMPTY_EDIT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.getProfile();
      setProfileRaw(response.data);
      setData(mapMemberProfileData(response.data));
      setEditForm(mapAuthProfileToEditForm(response.data));
    } catch (err) {
      setError(
        (err as { message?: string }).message ?? "Failed to load profile",
      );
      setProfileRaw(null);
      setData(memberProfileMock);
      setEditForm(EMPTY_EDIT_FORM);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  function handleOpenEdit() {
    if (profileRaw) {
      setEditForm(mapAuthProfileToEditForm(profileRaw));
    }

    setEditOpen(true);
  }

  async function handleSaveProfile(values: MemberProfileEditFormState) {
    setSaving(true);

    try {
      const response = await authApi.updateProfile(
        buildMemberProfileUpdatePayload(values),
      );

      setProfileRaw(response.data);
      setData(mapMemberProfileData(response.data));
      setEditForm(mapAuthProfileToEditForm(response.data));
      showSuccess("Profile updated successfully.");
      setEditOpen(false);
    } catch (err) {
      showError(
        (err as { message?: string }).message ?? "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="space-y-7 p-8">
        {error ? (
          <p className="font-roboto rounded-xl border border-pink/20 bg-pink/5 px-4 py-3 text-[12px] text-pink">
            {error}
          </p>
        ) : null}

        <section
          className="relative overflow-hidden rounded-2xl border border-accent/15 px-9 py-9"
          style={{
            background:
              "radial-gradient(90% 130% at 38% -15%, rgba(212,168,71,0.22) 0%, rgba(140,105,45,0.10) 38%, rgba(10,8,6,0) 68%), #0a0806",
          }}
        >
          <button
            type="button"
            onClick={handleOpenEdit}
            disabled={loading || !profileRaw}
            className="font-roboto absolute right-6 top-6 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#C9A84C]/40 px-3.5 py-1.5 text-[9px] font-semibold tracking-[0.12em] text-[#C9A84C] uppercase transition-colors hover:bg-[#C9A84C]/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <EditPencil className="size-3" />
            Edit Details
          </button>

          <div className="flex items-center gap-6">
            {data.profileImageUrl ? (
              <img
                src={data.profileImageUrl}
                alt={data.name}
                className="size-24 shrink-0 rounded-full border-2 border-[#C9A84C] object-cover shadow-[0_0_34px_rgba(201,168,76,0.30)]"
              />
            ) : (
              <span className="flex size-24 shrink-0 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-[#0d0b08] shadow-[0_0_34px_rgba(201,168,76,0.30)]">
                <span className="font-copperplate text-[34px] text-[#C9A84C]">
                  {getInitial(data.name)}
                </span>
              </span>
            )}

            <div className="min-w-0 space-y-2.5">
              <h1 className="font-copperplate text-[30px] leading-none tracking-[0.03em] text-[#F2EAD5]">
                {loading ? "Loading..." : data.name}
              </h1>

              <p className="font-roboto text-[11px] tracking-[0.1em] text-secondary uppercase">
                {data.handle} · {data.memberNumber}
              </p>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/8 px-3.5 py-1.5">
                <StarFilled className="size-3" />
                <span className="font-roboto text-[10px] font-semibold tracking-[0.12em] text-[#C9A84C] uppercase">
                  {data.tier}
                </span>
              </span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {data.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-accent/12 bg-card px-5 py-4"
            >
              <p className="font-copperplate text-[28px] leading-none text-foreground">
                {loading ? "—" : stat.value}
              </p>
              <p className="font-roboto mt-2.5 text-[10px] tracking-[0.14em] text-secondary uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        <MemberProfileSettingsGrid sections={data.settingsSections} />
      </div>

      <MemberEditProfileModal
        open={editOpen}
        initialValues={editForm}
        saving={saving}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveProfile}
      />
    </>
  );
}
