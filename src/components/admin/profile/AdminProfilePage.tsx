"use client";

import { useEffect, useRef, useState } from "react";
import {
  DetailGlyph,
  EditPencil,
  StarFilled,
  type DetailGlyphName,
} from "@/components/common/Svgs";
import { adminProfileApi } from "@/api/adminProfile.api";
import { showError, showSuccess } from "@/lib/toast";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
import type {
  AdminProfileActivityItemRaw,
  AdminProfileData,
  AdminProfileOverviewData,
  AdminSessionRaw,
} from "@/types/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "A";
}

function formatPhone(
  mobile?: string,
  countryCode?: string,
): string {
  const m = mobile?.trim();
  if (!m) return "—";
  const cc = countryCode?.trim() ?? "";
  return cc ? `${cc} ${m}` : m;
}

function formatLocation(location?: string, residence?: string): string {
  return location?.trim() || residence?.trim() || "—";
}

function statValue(
  stat: { value?: number; unit?: string } | undefined,
): string {
  if (!stat || stat.value === undefined || stat.value === null) return "—";
  if (stat.unit === "percent") return `${stat.value}%`;
  return String(stat.value);
}

function sessionDotClass(session: AdminSessionRaw): string {
  if (session.isCurrent && session.status === "active") return "bg-teal";
  if (session.status === "recent") return "bg-primary";
  return "bg-secondary";
}

function activityDotClass(tone?: string): string {
  if (tone === "success") return "bg-teal";
  if (tone === "error") return "bg-[#E0685C]";
  return "bg-primary";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-accent/12 bg-card p-5">
      <div className="flex min-h-[26px] items-center justify-between pb-3">
        <h2 className="font-roboto text-[11px] font-medium tracking-[0.18em] text-secondary uppercase">
          {title}
        </h2>
        {action}
      </div>
      <div className="border-t border-accent/8 pt-3">{children}</div>
    </section>
  );
}

// ─── Edit Mobile Modal ────────────────────────────────────────────────────────

function EditMobileModal({
  currentMobile,
  onSave,
  onClose,
  saving,
}: {
  currentMobile: string;
  onSave: (mobile: string) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [value, setValue] = useState(currentMobile === "—" ? "" : currentMobile);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-accent/20 bg-card p-6 shadow-2xl">
        <h3 className="font-roboto text-[11px] font-semibold tracking-[0.16em] text-secondary uppercase">
          Edit Phone Number
        </h3>

        <p className="mt-1 font-roboto text-[12px] tracking-[0.04em] text-muted">
          Only your phone number can be updated here.
        </p>

        <div className="mt-5">
          <label className="font-roboto mb-2 block text-[10px] tracking-[0.14em] text-secondary uppercase">
            Mobile Number
          </label>
          <input
            ref={inputRef}
            type="tel"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="+971 50 000 0000"
            className="w-full rounded-xl border border-accent/20 bg-surface px-4 py-3 font-roboto text-[13px] tracking-[0.02em] text-foreground placeholder:text-muted focus:border-[#C9A84C]/50 focus:outline-none"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="font-roboto flex-1 cursor-pointer rounded-xl border border-accent/20 py-2.5 text-[10px] font-semibold tracking-[0.12em] text-secondary uppercase transition-colors hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(value.trim())}
            disabled={saving}
            className="font-roboto flex-1 cursor-pointer rounded-xl border border-[#C9A84C]/50 bg-[#C9A84C]/10 py-2.5 text-[10px] font-semibold tracking-[0.12em] text-[#C9A84C] uppercase transition-colors hover:bg-[#C9A84C]/18 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type PageData = {
  overview: AdminProfileOverviewData;
  profile: AdminProfileData;
  sessions: AdminSessionRaw[];
  activity: AdminProfileActivityItemRaw[];
};

function ProfilePageContent({
  data,
  onMobileUpdated,
}: {
  data: PageData;
  onMobileUpdated: (mobile: string) => void;
}) {
  const { overview, profile, sessions, activity } = data;
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useSetAdminPageSubtitle(profile.name ?? "Profile");

  const profileStats = [
    {
      label: overview.actionsToday?.label ?? "ACTIONS TODAY",
      value: statValue(overview.actionsToday),
      sub: overview.actionsToday?.subLabel ?? "Across All Modules",
    },
    {
      label: overview.membersManaged?.label ?? "MEMBERS MANAGED",
      value: statValue(overview.membersManaged),
      sub: overview.membersManaged?.subLabel ?? "Total Active",
    },
    {
      label: overview.openTasks?.label ?? "OPEN TASKS",
      value: statValue(overview.openTasks),
      sub: overview.openTasks?.subLabel ?? "Concierge + Events",
    },
    {
      label: overview.uptimeThisMonth?.label ?? "UPTIME THIS MONTH",
      value: statValue(overview.uptimeThisMonth),
      sub: overview.uptimeThisMonth?.subLabel ?? "System Availability",
    },
  ];

  const accountDetails: { icon: DetailGlyphName; label: string; value: string }[] = [
    { icon: "mail", label: "Email", value: profile.email?.trim() || "—" },
    { icon: "phone", label: "Phone", value: formatPhone(profile.mobile, profile.mobileCountryCode) },
    { icon: "id", label: "Admin ID", value: profile.staffId?.trim() || "—" },
    { icon: "location", label: "Location", value: formatLocation(profile.location, profile.residence) },
    { icon: "calendar", label: "Joined", value: profile.joinedLabel?.trim() || "—" },
  ];

  async function handleSaveMobile(mobile: string) {
    setSaving(true);

    try {
      await adminProfileApi.updateProfile({ mobile });
      onMobileUpdated(mobile);
      showSuccess("Phone number updated.");
      setEditOpen(false);
    } catch (error) {
      showError(
        (error as { message?: string }).message ?? "Failed to update phone number",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {editOpen && (
        <EditMobileModal
          currentMobile={formatPhone(profile.mobile, profile.mobileCountryCode)}
          onSave={handleSaveMobile}
          onClose={() => setEditOpen(false)}
          saving={saving}
        />
      )}

      <div className="space-y-5 p-8">
        {/* Hero header */}
        <section
          className="relative overflow-hidden rounded-2xl border border-accent/15 px-9 py-9"
          style={{
            background:
              "radial-gradient(90% 130% at 38% -15%, rgba(212,168,71,0.22) 0%, rgba(140,105,45,0.10) 38%, rgba(10,8,6,0) 68%), #0a0806",
          }}
        >
          <div className="flex items-center gap-6">
            <span className="flex size-24 shrink-0 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-[#0d0b08] shadow-[0_0_34px_rgba(201,168,76,0.30)]">
              <span className="font-copperplate text-[34px] text-[#C9A84C]">
                {getInitial(profile.name ?? "A")}
              </span>
            </span>

            <div className="min-w-0 space-y-2.5">
              <h1 className="font-copperplate text-[34px] leading-none tracking-[0.05em] text-[#F2EAD5]">
                {profile.name ?? "—"}
              </h1>

              <p className="font-roboto text-[12px] font-semibold tracking-[0.16em] text-[#C9A84C] uppercase">
                {profile.jobTitle ?? "Administrator"}
              </p>

              <p className="font-roboto text-[11px] tracking-[0.12em] text-secondary uppercase">
                {profile.staffId && `Staff ID · ${profile.staffId}`}
                {profile.staffId && profile.joinedLabel && (
                  <span className="px-1.5 text-secondary/60">·</span>
                )}
                {profile.joinedLabel && `Joined ${profile.joinedLabel}`}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/8 px-3.5 py-1.5">
                  <StarFilled className="size-3" />
                  <span className="font-roboto text-[10px] font-semibold tracking-[0.12em] text-[#C9A84C] uppercase">
                    Admin
                  </span>
                </span>

                <span className="inline-flex items-center rounded-full border border-[#C9A84C]/22 px-3.5 py-1.5">
                  <span className="font-roboto text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">
                    Operations
                  </span>
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/35 bg-teal/8 px-3.5 py-1.5">
                  <span className="size-1.5 rounded-full bg-teal" />
                  <span className="font-roboto text-[10px] font-semibold tracking-[0.12em] text-teal uppercase">
                    Active Now
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {profileStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-accent/12 bg-card px-5 py-4"
            >
              <p className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
                {stat.label}
              </p>
              <p className="mt-2 font-copperplate text-[30px] leading-none tracking-[0.06em] text-foreground">
                {stat.value}
              </p>
              <p className="mt-2 font-roboto text-[11px] tracking-[0.04em] text-secondary">
                {stat.sub}
              </p>
            </div>
          ))}
        </section>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-5">
            <SectionCard
              title="Account Details"
              action={
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="font-roboto inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#C9A84C]/40 px-3.5 py-1.5 text-[9px] font-semibold tracking-[0.12em] text-[#C9A84C] uppercase transition-colors hover:bg-[#C9A84C]/10"
                >
                  <EditPencil className="size-3" />
                  Edit Details
                </button>
              }
            >
              <ul className="divide-y divide-accent/8">
                {accountDetails.map((detail) => (
                  <li
                    key={detail.label}
                    className="flex items-center justify-between gap-4 py-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/10">
                        <DetailGlyph icon={detail.icon} />
                      </span>
                      <span className="font-roboto text-[13px] tracking-[0.02em] text-secondary">
                        {detail.label}
                      </span>
                    </div>
                    <span className="font-roboto text-right text-[13px] font-medium tracking-[0.02em] text-foreground">
                      {detail.value}
                    </span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <SectionCard title="Active Sessions">
              {sessions.length === 0 ? (
                <p className="font-roboto py-4 text-center text-[12px] text-secondary">
                  No active sessions.
                </p>
              ) : (
                <ul className="divide-y divide-accent/8">
                  {sessions.map((session) => (
                    <li key={session.id} className="flex gap-3 py-3.5">
                      <span
                        className={`mt-1.5 size-2 shrink-0 rounded-full ${sessionDotClass(session)}`}
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="font-roboto text-[13px] font-semibold tracking-[0.02em] text-foreground">
                          {session.deviceLabel ?? "Unknown Device"}
                        </p>
                        <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
                          {[session.location, session.timeLabel]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        {session.userName && session.userType !== "admin" && (
                          <p className="font-roboto text-[10px] tracking-[0.06em] text-muted uppercase">
                            {session.userName}
                          </p>
                        )}
                      </div>
                      {session.isCurrent && (
                        <span className="shrink-0 self-center rounded-full border border-teal/30 bg-teal/8 px-2.5 py-1 font-roboto text-[9px] font-semibold tracking-[0.1em] text-teal uppercase">
                          Current
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            <SectionCard title="Admin Activity Log">
              {activity.length === 0 ? (
                <p className="font-roboto py-4 text-center text-[12px] text-secondary">
                  No recent activity.
                </p>
              ) : (
                <ul className="divide-y divide-accent/8">
                  {activity.map((entry, index) => (
                    <li
                      key={entry.id ?? index}
                      className="flex gap-3 py-3.5"
                    >
                      <span
                        className={`mt-1.5 size-2 shrink-0 rounded-full ${activityDotClass(entry.tone)}`}
                      />
                      <div className="space-y-1">
                        <p className="font-roboto text-[13px] font-semibold tracking-[0.02em] text-foreground">
                          {entry.title ?? entry.description ?? entry.body ?? "—"}
                        </p>
                        {entry.timeLabel && (
                          <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
                            {entry.timeLabel}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function AdminProfilePage() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const [overviewRes, profileRes, sessionsRes, activityRes] =
          await Promise.all([
            adminProfileApi.getOverview(),
            adminProfileApi.getProfile(),
            adminProfileApi.getSessions(),
            adminProfileApi.getActivity(),
          ]);

        if (!cancelled) {
          setPageData({
            overview: overviewRes.data ?? {},
            profile: profileRes.data ?? {},
            sessions: sessionsRes.data?.sessions ?? [],
            activity: activityRes.data?.items ?? [],
          });
        }
      } catch (error) {
        if (!cancelled) {
          showError(
            (error as { message?: string }).message ??
              "Failed to load profile",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="font-roboto text-[12px] tracking-[0.1em] text-secondary uppercase">
          Loading…
        </p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="font-roboto text-[12px] tracking-[0.1em] text-secondary uppercase">
          Profile unavailable.
        </p>
      </div>
    );
  }

  return (
    <ProfilePageContent
      data={pageData}
      onMobileUpdated={(mobile) =>
        setPageData((prev) =>
          prev
            ? { ...prev, profile: { ...prev.profile, mobile } }
            : prev,
        )
      }
    />
  );
}
