"use client";

import { StarFilled, VehicleListCarIcon } from "@/components/common/Svgs";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";

type MemberProfilePageProps = {
  memberId: string;
};

const memberStats = [
  { value: "12", label: "Vehicles", sub: "Registered" },
  { value: "47", label: "Events", sub: "Attended" },
  { value: "8,420", label: "Miles Logged", sub: "On Premises" },
  { value: "142", label: "Days Active", sub: "Since Joining" },
];

type VehicleStatus = "primary" | "stored";

const memberVehicles: {
  name: string;
  plate: string;
  status: VehicleStatus;
}[] = [
  { name: "Bugatti Chiron", plate: "AUH · 001", status: "primary" },
  { name: "Rolls-Royce Phantom", plate: "DXB · M1", status: "stored" },
  { name: "Lamborghini Revuelto", plate: "SHJ · 007", status: "stored" },
];

type EventStatus = "registered" | "invited";

const upcomingEvents: {
  date: string;
  name: string;
  status: EventStatus;
}[] = [
  { date: "Jun 22", name: "Supercar Sunday", status: "registered" },
  { date: "Jun 04", name: "Members Dinner - Clubhouse", status: "invited" },
  { date: "Jun 19", name: "Track Day - Dubai Autodrome", status: "registered" },
];

type ActivityTone = "teal" | "gold";

const recentActivity: {
  label: string;
  value: string;
  time: string;
  tone: ActivityTone;
}[] = [
  {
    label: "Checked In :",
    value: "Main Gate",
    time: "Today · 14:30",
    tone: "teal",
  },
  {
    label: "Attended",
    value: "Track Day - Yas Marina",
    time: "2 days ago",
    tone: "gold",
  },
  {
    label: "Concierge Request",
    value: "Detailing, Chiron",
    time: "4 days ago",
    tone: "gold",
  },
];

const staffNotes = [
  "Founding member- prefers private bay #3 for the Bugatti. Requests detailing ahead of every track event.",
  "Daughter's birthday in September - flag for gifts/experience package.",
];

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

const vehicleStatusClass: Record<VehicleStatus, string> = {
  primary: "border-[#C9A84C]/40 bg-[#C9A84C]/12 text-[#C9A84C]",
  stored: "border-teal/35 bg-teal/8 text-teal",
};

const eventStatusClass: Record<EventStatus, string> = {
  registered: "border-[#C9A84C]/40 bg-[#C9A84C]/12 text-[#C9A84C]",
  invited: "border-[#C9A84C]/25 bg-transparent text-muted",
};

export function MemberProfilePage(_props: MemberProfilePageProps) {
  useSetAdminPageSubtitle("Mr. AL Mansoori");

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
              M
            </span>
          </span>

          <div className="min-w-0 space-y-3">
            <h1 className="font-copperplate text-[34px] leading-none tracking-[0.05em] text-[#F2EAD5]">
              Mr. AL Mansoori
            </h1>

            <p className="font-roboto text-[11px] tracking-[0.18em] text-secondary uppercase">
              NO.0001074 <span className="px-1.5 text-secondary/60">·</span>{" "}
              Member Since Dec 2024{" "}
              <span className="px-1.5 text-secondary/60">·</span>{" "}
              <span className="font-semibold text-[#C9A84C]">Founding</span>
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <HeaderBadge label="Founding Member" />
              <HeaderBadge label="Private" />
            </div>
          </div>
        </div>
      </section>

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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <SectionCard title="Vehicles" action={<ViewAllButton />}>
            <ul className="space-y-2.5">
              {memberVehicles.map((vehicle) => (
                <li
                  key={vehicle.name}
                  className="flex items-center gap-3 py-2.5 border-b border-[#D4A8470F] px-5"
                >
                  <span className="flex size-9 rounded-lg shrink-0 items-center justify-center border border-[#D4A84726] bg-[#D4A84714]">
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

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 font-roboto text-[9px] font-semibold tracking-[0.1em] uppercase ${vehicleStatusClass[vehicle.status]}`}
                  >
                    {vehicle.status}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Upcoming Events" action={<ViewAllButton />}>
            <ul className="divide-y divide-accent/8">
              {upcomingEvents.map((event) => (
                <li key={event.name} className="flex items-center gap-5 py-3">
                  <span className="w-14 shrink-0 font-roboto text-[10px] tracking-[0.1em] text-secondary uppercase">
                    {event.date}
                  </span>

                  <p className="min-w-0 flex-1 font-roboto text-[13px] font-medium tracking-[0.02em] text-foreground">
                    {event.name}
                  </p>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 font-roboto text-[9px] font-semibold tracking-[0.1em] uppercase ${eventStatusClass[event.status]}`}
                  >
                    {event.status}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Recent Activity">
            <ul className="space-y-5">
              {recentActivity.map((item) => (
                <li key={item.value} className="flex gap-3 border-b border-[#D4A8470F] py-2.5">
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${
                      item.tone === "teal" ? "bg-teal" : "bg-primary"
                    }`}
                  />
                  <div className="space-y-1">
                    <p className="font-roboto text-[13px] tracking-[0.02em]">
                      <span className="text-secondary">{item.label} </span>
                      <span className="font-semibold text-foreground">
                        {item.value}
                      </span>
                    </p>
                    <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
                      {item.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Staff Notes"
            action={
              <button
                type="button"
                className="font-roboto inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#C9A84C]/40 px-3 py-1 text-[9px] font-semibold tracking-[0.12em] text-[#C9A84C] uppercase transition-colors hover:bg-[#C9A84C]/10"
              >
                + Add Notes
              </button>
            }
          >
            <div className="space-y-4">
              {staffNotes.map((note) => (
                <p
                  key={note}
                  className="font-roboto text-[13px] leading-relaxed text-muted"
                >
                  {note}
                </p>
              ))}

              <p className="border-t border-accent/8 pt-4 font-roboto text-[11px] tracking-[0.04em] text-secondary">
                Last updated by Farah Al-Rashid · Jun 12, 2026
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
