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
import { useTheme } from "@/components/common/ThemeProvider";

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "A";
}

const EMPTY_EDIT_FORM: MemberProfileEditFormState = {
  firstName: "",
  lastName: "",
  displayHandle: "",
  email: "",
  mobile: "",
  mobileCountryCode: "",
  residence: "",
  coverImageUrl: "",
};

export function MemberProfilePage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
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
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 sm:space-y-7">
        {error ? (
          <p className="font-roboto rounded-xl border border-pink/20 bg-pink/5 px-4 py-3 text-[12px] text-pink">
            {error}
          </p>
        ) : null}

        <section
          className="relative overflow-hidden rounded-2xl border px-5 py-6 sm:px-9 sm:py-9"
          style={isLight ? {
            background: "radial-gradient(90% 130% at 38% -15%, rgba(138,125,106,0.14) 0%, rgba(90,83,73,0.06) 38%, transparent 68%), var(--card)",
            borderColor: "rgba(26,24,22,0.08)",
          } : {
            background: "radial-gradient(90% 130% at 38% -15%, rgba(212,168,71,0.22) 0%, rgba(140,105,45,0.10) 38%, rgba(10,8,6,0) 68%), #0a0806",
            borderColor: "rgba(201,168,76,0.15)",
          }}
        >
          <button
            type="button"
            onClick={handleOpenEdit}
            disabled={loading || !profileRaw}
            className="font-roboto absolute right-4 top-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-semibold tracking-[0.12em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:right-6 sm:top-6 sm:px-3.5"
            style={isLight ? {
              borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)",
              color: "var(--accent)",
            } : {
              borderColor: "rgba(201,168,76,0.40)",
              color: "var(--primary)",
            }}
          >
            <EditPencil className="size-3" />
            <span className="hidden xs:inline">Edit Details</span>
            <span className="xs:hidden">Edit</span>
          </button>

          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
            {data.profileImageUrl ? (
              <img
                src={data.profileImageUrl}
                alt={data.name}
                className="size-20 shrink-0 rounded-full border-2 object-cover sm:size-24"
                style={isLight ? {
                  borderColor: "var(--accent)",
                  boxShadow: "0 0 16px color-mix(in srgb, var(--accent) 20%, transparent)",
                } : {
                  borderColor: "var(--primary)",
                  boxShadow: "0 0 34px rgba(201,168,76,0.30)",
                }}
              />
            ) : (
              <span
                className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 sm:size-24"
                style={isLight ? {
                  borderColor: "var(--accent)",
                  background: "color-mix(in srgb, var(--accent) 12%, var(--card))",
                  boxShadow: "none",
                } : {
                  borderColor: "var(--primary)",
                  background: "#0d0b08",
                  boxShadow: "0 0 34px rgba(201,168,76,0.30)",
                }}
              >
                <span
                  className="font-copperplate text-[28px] sm:text-[34px]"
                  style={{ color: "var(--primary)" }}
                >
                  {getInitial(data.name)}
                </span>
              </span>
            )}

            <div className="min-w-0 space-y-2 sm:space-y-2.5">
              <h1
                className="font-copperplate text-[22px] leading-none tracking-[0.03em] sm:text-[30px]"
                style={{ color: isLight ? "var(--foreground)" : "#F2EAD5" }}
              >
                {loading ? "Loading..." : data.name}
              </h1>

              <p className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase sm:text-[11px]">
                {data.handle} · {data.memberNumber}
              </p>

              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5"
                style={isLight ? {
                  borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)",
                  background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                } : {
                  borderColor: "rgba(201,168,76,0.40)",
                  background: "rgba(201,168,76,0.08)",
                }}
              >
                <span style={{ color: "var(--primary)" }} className="flex items-center">
                  <StarFilled className="size-3" />
                </span>
                <span
                  className="font-roboto text-[10px] font-semibold tracking-[0.12em] uppercase"
                  style={{ color: "var(--primary)" }}
                >
                  {data.tier}
                </span>
              </span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {data.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-accent/12 bg-card px-4 py-4 sm:px-5"
            >
              <p className="font-copperplate text-[24px] leading-none text-foreground sm:text-[28px]">
                {loading ? "—" : stat.value}
              </p>
              <p className="font-roboto mt-2 text-[9px] tracking-[0.14em] text-secondary uppercase sm:mt-2.5 sm:text-[10px]">
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
