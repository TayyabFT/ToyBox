"use client";

import {
  DetailGlyph,
  EditPencil,
  StarFilled,
  type DetailGlyphName,
} from "@/components/common/Svgs";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";

type StaffProfilePageProps = {
  staffId: string;
};

const staffStats = [
  { value: "34", label: "Actions Today", sub: "Across All Modules" },
  { value: "142", label: "Members Managed", sub: "Total Active" },
  { value: "8", label: "Open Tasks", sub: "Concierge + Events" },
  { value: "98%", label: "Uptime This Month", sub: "System Availability" },
];

const accountDetails: {
  icon: DetailGlyphName;
  label: string;
  value: string;
}[] = [
  { icon: "mail", label: "Email", value: "farah@toybox.ae" },
  { icon: "phone", label: "Phone", value: "+14343535353" },
  { icon: "id", label: "ID", value: "OPS-0041" },
  { icon: "location", label: "Location", value: "Dubai, UAE" },
  { icon: "calendar", label: "Joined", value: "Jan 15,2024" },
];

const permissionRows: [string, string][] = [
  ["Members", "Vehicles"],
  ["Events", "Analytics"],
  ["Comms", "Finance"],
];

type Tone = "teal" | "gold" | "red";

const activeSessions: { device: string; meta: string; tone: Tone }[] = [
  { device: "MacBook Pro - Chrome", meta: "Dubai · Right now", tone: "teal" },
  { device: "iPhone 15 - Safari", meta: "Dubai · 3 hours ago", tone: "gold" },
  { device: "iPad - Safari", meta: "Dubai · 2 days ago", tone: "gold" },
];

const activityLog: {
  label: string;
  value: string;
  time: string;
  tone: Tone;
}[] = [
  {
    label: "Updated Profile",
    value: "Mrs. Khoury",
    time: "Today · 14:30",
    tone: "gold",
  },
  {
    label: "Invited New Member",
    value: "Mr. Nakamura",
    time: "Today · 11:30",
    tone: "teal",
  },
  {
    label: "Concierge Resolved",
    value: "Detailing, Al Mansoori",
    time: "Today · 09:56",
    tone: "gold",
  },
  {
    label: "Removed Vehicle",
    value: "Ferrari 458, Khalili",
    time: "Yesterday",
    tone: "red",
  },
];

const dotToneClass: Record<Tone, string> = {
  teal: "bg-teal",
  gold: "bg-primary",
  red: "bg-[#E0685C]",
};

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

export function StaffProfilePage(_props: StaffProfilePageProps) {
  useSetAdminPageSubtitle("Farah Al- Rashid");

  return (
    <div className="space-y-5 p-8">
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
              F
            </span>
          </span>

          <div className="min-w-0 space-y-2.5">
            <h1 className="font-copperplate text-[34px] leading-none tracking-[0.05em] text-[#F2EAD5]">
              Farah Al- Rashid
            </h1>

            <p className="font-roboto text-[12px] font-semibold tracking-[0.16em] text-[#C9A84C] uppercase">
              Operations Manager
            </p>

            <p className="font-roboto text-[11px] tracking-[0.12em] text-secondary uppercase">
              Staff ID · OPS- 0041 · Joined Jan 2024 · Toybox HQ, Dubai
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

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {staffStats.map((stat) => (
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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <SectionCard
            title="Account Details"
            action={
              <button
                type="button"
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
                  <span className="font-roboto text-[13px] font-medium tracking-[0.02em] text-foreground">
                    {detail.value}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Permissions">
            <div>
              {permissionRows.map((pair, index) => (
                <div
                  key={pair.join("-")}
                  className={`grid grid-cols-2 gap-x-6 py-2.5 ${
                    index > 0 ? "border-t border-accent/8" : ""
                  }`}
                >
                  {pair.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center gap-3"
                    >
                      <span className="size-4 shrink-0 rounded-[5px] border border-[#C9A84C]/45 bg-[#C9A84C]/5" />
                      <span className="font-roboto text-[13px] tracking-[0.02em] text-foreground">
                        {permission}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Active Sessions">
            <ul className="divide-y divide-accent/8">
              {activeSessions.map((session) => (
                <li key={session.device} className="flex gap-3 py-3.5">
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${dotToneClass[session.tone]}`}
                  />
                  <div className="space-y-1">
                    <p className="font-roboto text-[13px] font-semibold tracking-[0.02em] text-foreground">
                      {session.device}
                    </p>
                    <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
                      {session.meta}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Admin Activity Log">
            <ul className="divide-y divide-accent/8">
              {activityLog.map((entry) => (
                <li key={entry.value} className="flex gap-3 py-3.5">
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${dotToneClass[entry.tone]}`}
                  />
                  <div className="space-y-1">
                    <p className="font-roboto text-[13px] tracking-[0.02em]">
                      <span className="text-secondary">{entry.label} </span>
                      <span className="font-semibold text-foreground">
                        {entry.value}
                      </span>
                    </p>
                    <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
                      {entry.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
