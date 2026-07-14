"use client";

import { useEffect, useState } from "react";
import { PageLoadingShimmer } from "@/components/common/PageLoadingShimmer";
import { VehicleListCarIcon } from "@/components/common/Svgs";
import { adminVehiclesApi } from "@/api/adminVehicles.api";
import { mapAdminVehicleDetailsScreen } from "@/lib/adminVehicleDetails";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
import { showError } from "@/lib/toast";
import type {
  VehicleActivityHistoryItem,
  VehicleDetailsScreenDisplay,
} from "./types";

type VehicleProfilePageProps = {
  vehicleId: string;
};

type Tone = VehicleActivityHistoryItem["tone"];

const dotToneClass: Record<Tone, string> = {
  teal: "bg-teal",
  gold: "bg-accent",
  red: "bg-pink",
};

const pillToneClass = {
  teal: "border-teal/35 bg-teal/8 text-teal",
  outline: "border-accent/20 text-muted",
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

function statusPillTone(statusKey: string): "teal" | "outline" {
  if (statusKey === "ready" || statusKey === "stored") {
    return "teal";
  }

  return "outline";
}

function formatLevelLabel(levelCode: string): string {
  if (levelCode === "—") return levelCode;
  return levelCode.replace(/^LEVEL\s+/i, "LEVEL ");
}

function splitVehicleTitle(displayName: string, model: string) {
  if (model === "—" || displayName === "—") {
    return { primary: displayName, accent: "" };
  }

  const normalizedDisplay = displayName.toLowerCase();
  const normalizedModel = model.toLowerCase();
  const modelIndex = normalizedDisplay.lastIndexOf(normalizedModel);

  if (modelIndex === -1) {
    return { primary: displayName, accent: "" };
  }

  return {
    primary: displayName.slice(0, modelIndex).trim(),
    accent: displayName.slice(modelIndex).trim(),
  };
}

function ProfilePageContent({ detail }: { detail: VehicleDetailsScreenDisplay }) {
  useSetAdminPageSubtitle(detail.displayName);

  const titleParts = splitVehicleTitle(detail.displayName, detail.model);

  const headerPills = [
    { label: detail.statusLabel, tone: statusPillTone(detail.statusKey) },
    ...(detail.plate !== "—"
      ? [{ label: detail.plate, tone: "outline" as const }]
      : []),
    ...(detail.vin !== "—"
      ? [{ label: `VIN · ${detail.vin}`, tone: "outline" as const }]
      : []),
  ];

  const ownerInitial =
    detail.ownerInitial !== "N/A" && detail.ownerInitial !== "—"
      ? detail.ownerInitial
      : detail.ownerName.charAt(0).toUpperCase();

  return (
    <div className="space-y-5 p-8">
      <section className="admin-entity-hero relative overflow-hidden rounded-2xl border border-accent/15 px-9 py-9">
        <div className="flex items-center gap-6">
          <span className="admin-entity-hero-avatar flex size-24 shrink-0 items-center justify-center rounded-full border-2 text-accent">
            <VehicleListCarIcon className="h-[22px] w-[44px]" color="currentColor" />
          </span>

          <div className="min-w-0 space-y-2.5">
            {detail.make !== "—" && (
              <p className="font-roboto text-[12px] font-medium tracking-[0.22em] text-secondary uppercase">
                {detail.make}
              </p>
            )}

            <h1 className="font-copperplate text-[34px] leading-none tracking-[0.05em]">
              {titleParts.primary && (
                <span className="admin-entity-hero-title">{titleParts.primary} </span>
              )}
              {titleParts.accent ? (
                <span className="admin-entity-hero-accent">{titleParts.accent}</span>
              ) : (
                !titleParts.primary && (
                  <span className="admin-entity-hero-title">{detail.displayName}</span>
                )
              )}
            </h1>

            {detail.subtitle !== "—" && (
              <p className="font-roboto text-[11px] tracking-[0.12em] text-secondary uppercase">
                {detail.subtitle}
              </p>
            )}

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
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-accent/70 bg-dark font-copperplate text-[18px] text-accent">
            {ownerInitial}
          </span>
          <div className="space-y-1">
            <p className="font-copperplate text-[18px] tracking-[0.04em] text-foreground">
              {detail.ownerName}
            </p>
            <p className="font-roboto text-[11px] tracking-[0.08em] text-secondary uppercase">
              {detail.ownerInfoLabel}
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectionCard title="Specifications">
          <ul className="divide-y divide-accent/8">
            {detail.specifications.map((spec) => (
              <InfoRow key={spec.label} label={spec.label} value={spec.value} />
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Bay Assignment">
          <div className="flex items-center gap-4 pb-4">
            <div className="admin-gold-avatar flex size-[52px] shrink-0 flex-col items-center justify-center rounded-xl">
              <span className="font-copperplate text-[16px] leading-none">
                {detail.bayCode}
              </span>
              {detail.levelCode !== "—" && (
                <span className="mt-0.5 font-roboto text-[7px] font-semibold tracking-[0.1em]">
                  {formatLevelLabel(detail.levelCode)}
                </span>
              )}
            </div>

            <div className="space-y-1">
              {detail.bayTitle !== "—" && (
                <p className="font-roboto text-[14px] font-semibold tracking-[0.02em] text-foreground">
                  {detail.bayTitle}
                </p>
              )}
              {detail.storedStatus !== "—" && (
                <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
                  {detail.storedStatus}
                </p>
              )}
              {detail.inspectionStatus !== "—" && (
                <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
                  {detail.inspectionStatus}
                </p>
              )}
            </div>
          </div>

          <ul className="divide-y divide-accent/8 border-t border-accent/8">
            {detail.bayDetails.map((item) => (
              <InfoRow key={item.label} label={item.label} value={item.value} />
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Service & Activity History">
        {detail.activityHistory.length === 0 ? (
          <p className="font-roboto text-[13px] tracking-[0.02em] text-secondary">
            No activity recorded yet.
          </p>
        ) : (
          <ul className="divide-y divide-accent/8">
            {detail.activityHistory.map((entry) => (
              <li key={entry.id} className="flex gap-3 py-3.5">
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${dotToneClass[entry.tone]}`}
                />
                <div className="space-y-1">
                  <p className="font-roboto text-[13px] tracking-[0.02em]">
                    {entry.value ? (
                      <>
                        <span className="text-secondary">{entry.label} </span>
                        <span className="font-semibold text-foreground">
                          {entry.value}
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold text-foreground">
                        {entry.label}
                      </span>
                    )}
                  </p>
                  <p className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
                    {entry.meta}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}

export function VehicleProfilePage({ vehicleId }: VehicleProfilePageProps) {
  const [detail, setDetail] = useState<VehicleDetailsScreenDisplay | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const response = await adminVehiclesApi.getVehicleDetails(vehicleId);
        const mapped = mapAdminVehicleDetailsScreen(response.data);

        if (!cancelled) {
          setDetail(mapped);
        }
      } catch (error) {
        const message =
          (error as { message?: string }).message ?? "Failed to load vehicle";

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
  }, [vehicleId]);

  if (loading) {
    return <PageLoadingShimmer />;
  }

  if (!detail) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="font-roboto text-[12px] tracking-[0.1em] text-secondary uppercase">
          Vehicle not found.
        </p>
      </div>
    );
  }

  return <ProfilePageContent detail={detail} />;
}
