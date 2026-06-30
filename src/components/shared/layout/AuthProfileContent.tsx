"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/api/auth.api";
import { mapAuthProfile, type AuthProfileView } from "@/lib/authProfile";

type AuthProfileContentProps = {
  open: boolean;
};

function ProfileHeader({ profile }: { profile: AuthProfileView }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-gold-bright to-gold-deep text-sm font-medium uppercase text-dark">
          {profile.initial}
        </span>
        <div className="min-w-0 space-y-0.5 uppercase">
          <h2 className="font-roboto truncate text-sm font-medium tracking-[0.06em] text-foreground">
            {profile.name}
          </h2>
          <p className="font-roboto truncate text-xs tracking-[0.06em] text-secondary">
            {profile.subtitle}
          </p>
        </div>
      </div>
      <span className="size-2 shrink-0 rounded-full bg-teal shadow-[var(--shadow-glow-teal)]" />
    </div>
  );
}

function ProfileStats({ stats }: { stats: AuthProfileView["headerStats"] }) {
  if (stats.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((stat) => (
        <div
          key={`${stat.label}-${stat.value}`}
          className="rounded-xl border border-accent/12 bg-accent/5 px-3 py-2.5"
        >
          <p className="font-roboto text-[9px] tracking-[0.1em] text-secondary uppercase">
            {stat.label}
          </p>
          <p className="mt-1 font-copperplate text-lg leading-none text-foreground">
            {stat.value}
          </p>
          {stat.subtext ? (
            <p className="mt-1 font-roboto text-[9px] tracking-[0.04em] text-secondary">
              {stat.subtext}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ProfileSections({ sections }: { sections: AuthProfileView["sections"] }) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.key} className="space-y-2">
          <h3 className="font-roboto text-[10px] tracking-[0.14em] text-primary uppercase">
            {section.title}
          </h3>
          {section.fields.length > 0 ? (
            <div className="space-y-2 rounded-xl border border-accent/12 bg-accent/5 p-3">
              {section.fields.map((field) => (
                <div
                  key={`${section.key}-${field.label}`}
                  className="flex items-start justify-between gap-3"
                >
                  <span className="font-roboto text-[10px] tracking-[0.06em] text-secondary uppercase">
                    {field.label}
                  </span>
                  <span className="font-roboto max-w-[58%] text-right text-[11px] text-foreground">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function AuthProfileContent({ open }: AuthProfileContentProps) {
  const [profile, setProfile] = useState<AuthProfileView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      try {
        const response = await authApi.getProfile();
        const mapped = mapAuthProfile(response.data);

        if (!cancelled) {
          setProfile(mapped);
        }
      } catch (err) {
        if (!cancelled) {
          setProfile(null);
          setError(
            (err as { message?: string }).message ?? "Failed to load profile",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [open]);

  if (loading) {
    return (
      <p className="font-roboto py-6 text-center text-sm text-secondary">
        Loading profile...
      </p>
    );
  }

  if (error) {
    return (
      <p className="font-roboto py-6 text-center text-sm text-pink">{error}</p>
    );
  }

  if (!profile) {
    return (
      <p className="font-roboto py-6 text-center text-sm text-secondary">
        Profile unavailable.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <ProfileHeader profile={profile} />
      <ProfileStats stats={profile.headerStats} />
      <ProfileSections sections={profile.sections} />
    </div>
  );
}
