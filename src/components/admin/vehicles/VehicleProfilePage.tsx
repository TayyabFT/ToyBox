"use client";

import { VehicleListCarIcon } from "@/components/common/Svgs";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";

type VehicleProfilePageProps = {
  vehicleId: string;
};

const headerPills = [
  { label: "Ready", tone: "teal" as const },
  { label: "DXB · M1", tone: "outline" as const },
  { label: "VIN · SCAEF2ZAPUX12345", tone: "outline" as const },
];

const specifications: { label: string; value: string }[] = [
  { label: "Year", value: "2023" },
  { label: "Colour", value: "Midnight sapphire" },
  { label: "Engine", value: "6.75L V12 Bi-turbo" },
  { label: "Miles", value: "3,240" },
  { label: "Plate", value: "DXB · M1" },
  { label: "VIN", value: "SCAEF2ZA9PUX12485" },
];

const bayDetails: { label: string; value: string }[] = [
  { label: "Stored since", value: "Dec 18, 2024" },
  { label: "Days stored", value: "181 days" },
  { label: "Last inspected by", value: "Farah Al-Rashid" },
];

type Tone = "teal" | "gold" | "red";

const serviceHistory: {
  label: string;
  value: string;
  meta: string;
  tone: Tone;
}[] = [
  {
    label: "Routine Inspection Passed -",
    value: "all clear",
    meta: "Today · 06:30 · Farah Al-Rashid",
    tone: "gold",
  },
  {
    label: "Detailing Completed -",
    value: "full exterior + interior",
    meta: "Jun 10, 2026 · Workshop Team",
    tone: "teal",
  },
  {
    label: "Concierge Request Resolved -",
    value: "Tyre pressure check",
    meta: "May 28, 2026 · Ahmad Karimi",
    tone: "gold",
  },
  {
    label: "Vehicle Collected By Owner -",
    value: "weekend drive",
    meta: "May 12, 2026 · Front Gate",
    tone: "teal",
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

function ViewAllButton() {
  return (
    <button
      type="button"
      className="font-roboto cursor-pointer rounded-full border border-accent/15 px-3 py-1 text-[9px] font-semibold tracking-[0.16em] text-primary uppercase transition-colors hover:border-primary/40"
    >
      View All
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3.5">
      <span className="font-roboto text-[13px] tracking-[0.02em] text-secondary">
        {label}
      </span>
      <span className="font-roboto text-[13px] font-medium tracking-[0.02em] text-foreground">
        {value}
      </span>
    </li>
  );
}

const pillToneClass = {
  teal: "border-teal/35 bg-teal/8 text-teal",
  outline: "border-accent/20 text-muted",
};

export function VehicleProfilePage(_props: VehicleProfilePageProps) {
  useSetAdminPageSubtitle("Ghost Black Badge");

  return (
    <div className="space-y-5 p-8">
      <section
        className="relative overflow-hidden rounded-2xl border border-accent/15 px-9 py-9"
        style={{
          background:
            "radial-gradient(90% 130% at 42% -15%, rgba(212,168,71,0.20) 0%, rgba(140,105,45,0.10) 38%, rgba(10,8,6,0) 68%), #0a0806",
        }}
      >
        <div className="flex items-center gap-6">
          <span className="flex size-24 shrink-0 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-[#0d0b08] shadow-[0_0_34px_rgba(201,168,76,0.30)]">
            <VehicleListCarIcon className="h-[22px] w-[44px]" />
          </span>

          <div className="min-w-0 space-y-2.5">
            <p className="font-roboto text-[12px] font-medium tracking-[0.22em] text-secondary uppercase">
              Rolls-Royce
            </p>

            <h1 className="font-copperplate text-[34px] leading-none tracking-[0.05em]">
              <span className="text-[#F2EAD5]">Ghost </span>
              <span className="text-[#C9A84C]">Black Badge</span>
            </h1>

            <p className="font-roboto text-[11px] tracking-[0.12em] text-secondary uppercase">
              2023 · Midnight Sapphire · Bay 04A - Level 04
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {headerPills.map((pill) => (
                <span
                  key={pill.label}
                  className={`inline-flex items-center rounded-full border px-3.5 py-1.5 font-roboto text-[10px] font-semibold tracking-[0.12em] uppercase ${pillToneClass[pill.tone]}`}
                >
                  {pill.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Owner">
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#C9A84C]/70 bg-[#0d0b08] font-copperplate text-[18px] text-[#C9A84C]">
            A
          </span>
          <div className="space-y-1">
            <p className="font-copperplate text-[18px] tracking-[0.04em] text-foreground">
              Alex Mitchell
            </p>
            <p className="font-roboto text-[11px] tracking-[0.08em] text-secondary uppercase">
              No. 000010743 · Private · Since Dec 2024 · 4 Vehicles Registered
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectionCard title="Specifications" action={<ViewAllButton />}>
          <ul className="divide-y divide-accent/8">
            {specifications.map((spec) => (
              <InfoRow key={spec.label} label={spec.label} value={spec.value} />
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Bay Assignment">
          <div className="flex items-center gap-4 pb-4">
            <div className="flex size-[52px] shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-b from-[#F0C566] to-[#8B6F2A] text-dark">
              <span className="font-copperplate text-[16px] leading-none">
                04A
              </span>
              <span className="mt-0.5 font-roboto text-[7px] font-semibold tracking-[0.1em]">
                LEVEL 4
              </span>
            </div>

            <div className="space-y-1">
              <p className="font-roboto text-[14px] font-semibold tracking-[0.02em] text-foreground">
                Bay 04A - Level 04
              </p>
              <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
                Occupied · Climate Controlled
              </p>
              <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
                Inspected 06:14 Today
              </p>
            </div>
          </div>

          <ul className="divide-y divide-accent/8 border-t border-accent/8">
            {bayDetails.map((detail) => (
              <InfoRow
                key={detail.label}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Service & Activity History">
        <ul className="divide-y divide-accent/8">
          {serviceHistory.map((entry) => (
            <li key={entry.label} className="flex gap-3 py-3.5">
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
                  {entry.meta}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
