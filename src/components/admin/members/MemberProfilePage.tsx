"use client";

import { useEffect, useState } from "react";
import { StarFilled, VehicleListCarIcon } from "@/components/common/Svgs";
import { membersApi } from "@/api/members.api";
import { mapMemberProfile } from "@/lib/members";
import { showError } from "@/lib/toast";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
import type {
  MemberProfileDetail,
  MemberRecentActivityEntry,
  MemberUpcomingEventEntry,
  MemberVehicleEntry,
} from "./types";

type MemberProfilePageProps = {
  memberId: string;
};

function HeaderBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/35 bg-[#C9A84C]/5 px-3.5 py-1.5">
      <StarFilled className="size-3" />
      <span className="font-roboto text-[10px] font-semibold tracking-[0.12em] text-[#C9A84C] uppercase">
        {label}
      </span>
    </span>
  );
}

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
    <section className="rounded-2xl border border-accent/12 bg-card">
      <div className="flex items-center justify-between p-5">
        <h2 className="font-roboto text-[11px] font-medium tracking-[0.18em] text-secondary uppercase">
          {title}
        </h2>
        {action}
      </div>
      <div className="border-t border-accent/8 p-5">{children}</div>
    </section>
  );
}

function ViewAllButton() {
  return (
    <button
      type="button"
      className="font-roboto cursor-pointer text-[9px] font-semibold tracking-[0.16em] text-primary uppercase transition-colors hover:text-accent"
    >
      View All
    </button>
  );
}

const vehicleStatusClass: Record<string, string> = {
  primary: "border-[#C9A84C]/40 bg-[#C9A84C]/12 text-[#C9A84C]",
  stored: "border-teal/35 bg-teal/8 text-teal",
};

const eventStatusClass: Record<string, string> = {
  registered: "border-[#C9A84C]/40 bg-[#C9A84C]/12 text-[#C9A84C]",
  invited: "border-[#C9A84C]/25 bg-transparent text-muted",
};

function activityDotClass(tone: string): string {
  if (tone === "success") return "bg-teal";
  return "bg-primary";
}

function VehiclesList({ items }: { items: MemberVehicleEntry[] }) {
  if (items.length === 0) {
    return (
      <p className="font-roboto py-4 text-center text-[12px] text-secondary">
        No vehicles registered.
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {items.map((vehicle) => (
        <li
          key={vehicle.id}
          className="flex items-center gap-3 border-b border-[#D4A8470F] px-5 py-2.5"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#D4A84726] bg-[#D4A84714]">
            <VehicleListCarIcon className="h-[9px] w-[18px]" />
          </span>

          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="font-copperplate text-xs tracking-[0.04em] text-foreground">
              {vehicle.name}
            </p>
            <p className="font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
              {vehicle.plate}
            </p>
          </div>

          {vehicle.statusLabel && (
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 font-roboto text-[9px] font-semibold tracking-[0.1em] uppercase ${
                vehicleStatusClass[vehicle.status] ??
                "border-accent/25 text-secondary"
              }`}
            >
              {vehicle.statusLabel}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function UpcomingEventsList({ items }: { items: MemberUpcomingEventEntry[] }) {
  if (items.length === 0) {
    return (
      <p className="font-roboto py-4 text-center text-[12px] text-secondary">
        No upcoming events.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-accent/8">
      {items.map((event) => (
        <li key={event.id} className="flex items-center gap-5 py-3">
          <span className="w-14 shrink-0 font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
            {event.dateLabel}
          </span>

          <p className="min-w-0 flex-1 font-roboto text-[13px] font-medium tracking-[0.02em] text-foreground">
            {event.title}
          </p>

          {event.statusLabel && (
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 font-roboto text-[9px] font-semibold tracking-[0.1em] uppercase ${
                eventStatusClass[event.status] ??
                "border-accent/25 text-secondary"
              }`}
            >
              {event.statusLabel}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function RecentActivityList({ items }: { items: MemberRecentActivityEntry[] }) {
  if (items.length === 0) {
    return (
      <p className="font-roboto py-4 text-center text-[12px] text-secondary">
        No recent activity.
      </p>
    );
  }

  return (
    <ul className="space-y-5">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex gap-3 border-b border-[#D4A8470F] py-2.5"
        >
          <span
            className={`mt-1.5 size-2 shrink-0 rounded-full ${activityDotClass(item.tone)}`}
          />
          <div className="space-y-1">
            <p className="font-roboto text-[13px] tracking-[0.02em]">
              <span className="font-semibold text-foreground">{item.title}</span>
              {item.subtitle && (
                <span className="text-secondary"> · {item.subtitle}</span>
              )}
            </p>
            <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
              {item.timeLabel}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ProfilePageContent({ profile }: { profile: MemberProfileDetail }) {
  useSetAdminPageSubtitle(profile.displayName);

  const memberStats = [
    { value: String(profile.vehicles), label: "Vehicles", sub: "Registered" },
    { value: String(profile.events), label: "Events", sub: "Attended" },
    { value: profile.miles.toLocaleString(), label: "Miles Logged", sub: "On Premises" },
    { value: String(profile.days), label: "Days Active", sub: "Since Joining" },
  ];

  return (
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
              {profile.initial}
            </span>
          </span>

          <div className="min-w-0 space-y-3">
            <h1 className="font-copperplate text-[34px] leading-none tracking-[0.05em] text-[#F2EAD5]">
              {profile.displayName}
            </h1>

            <p className="font-roboto text-[11px] tracking-[0.18em] text-secondary uppercase">
              NO. {profile.memberNumber.slice(0, 8)}
              <span className="px-1.5 text-secondary/60">·</span>
              Since {profile.memberSince}
              <span className="px-1.5 text-secondary/60">·</span>
              <span className="font-semibold text-[#C9A84C]">
                {profile.tierLabel}
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <HeaderBadge label={profile.tierLabel} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {memberStats.map((stat) => (
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
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
        {/* Left: Vehicles + Upcoming Events */}
        <div className="flex flex-col gap-5">
          <SectionCard title="Vehicles" action={<ViewAllButton />}>
            <VehiclesList items={profile.vehiclesSection.items} />
          </SectionCard>

          <SectionCard title="Upcoming Events" action={<ViewAllButton />}>
            <UpcomingEventsList items={profile.upcomingEvents} />
          </SectionCard>
        </div>

        {/* Right: Recent Activity — stretches to match left column height */}
        <div className="flex flex-col max-h-max">
          <section className="flex flex-1 flex-col rounded-2xl border border-accent/12 bg-card max-h-max">
            <div className="flex items-center justify-between p-5">
              <h2 className="font-roboto text-[11px] font-medium tracking-[0.18em] text-secondary uppercase">
                Recent Activity
              </h2>
            </div>
            <div className="flex-1 max-h-[300px] overflow-y-auto Custom__Scrollbar border-t border-accent/8 p-5">
              <RecentActivityList items={profile.recentActivity} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function MemberProfilePage({ memberId }: MemberProfilePageProps) {
  const [profile, setProfile] = useState<MemberProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const response = await membersApi.getMemberById(memberId);
        const mapped = mapMemberProfile(response.data);

        if (!cancelled) {
          setProfile(mapped);
        }
      } catch (error) {
        const message =
          (error as { message?: string }).message ?? "Failed to load member";

        if (!cancelled) {
          showError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [memberId]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="font-roboto text-[12px] tracking-[0.1em] text-secondary uppercase">
          Loading…
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="font-roboto text-[12px] tracking-[0.1em] text-secondary uppercase">
          Member not found.
        </p>
      </div>
    );
  }

  return <ProfilePageContent profile={profile} />;
}
