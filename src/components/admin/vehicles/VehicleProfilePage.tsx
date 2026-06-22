"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { adminVehiclesApi } from "@/api/adminVehicles.api";
import { HealthProgressBar } from "@/components/staff/vehicles/HealthProgressBar";
import { mapAdminVehicleProfile } from "@/lib/adminVehicles";
import { useSetAdminPageSubtitle } from "@/lib/adminPageMeta";
import { showError } from "@/lib/toast";
import type { VehicleProfileDetail } from "./types";

type VehicleProfilePageProps = {
  vehicleId: string;
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

function statusTone(statusKey: string, isOverdue: boolean): string {
  if (isOverdue) {
    return "border-[var(--pink)]/40 bg-[var(--pink)]/[0.08] text-[var(--pink)]";
  }

  const normalized = statusKey.toLowerCase();

  if (normalized.includes("service")) {
    return "border-primary/40 bg-primary/[0.08] text-primary";
  }

  if (normalized.includes("ready") || normalized.includes("stored")) {
    return "border-teal/40 bg-teal/[0.08] text-teal";
  }

  return "border-accent/25 text-secondary";
}

function isImageUrl(url: string): boolean {
  return /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(url);
}

export function VehicleProfilePage({ vehicleId }: VehicleProfilePageProps) {
  const [profile, setProfile] = useState<VehicleProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useSetAdminPageSubtitle(profile?.displayName);

  const loadProfile = useCallback(async () => {
    setLoading(true);

    try {
      const response = await adminVehiclesApi.getVehicleById(vehicleId);
      setProfile(mapAdminVehicleProfile(response.data));
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load vehicle details";

      showError(message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <div className="p-8">
        <p className="font-roboto text-sm text-secondary">
          Loading vehicle details...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-4 p-8">
        <p className="font-roboto text-sm text-secondary">
          Vehicle details could not be loaded.
        </p>
        <Link
          href="/admin/vehicles"
          className="font-roboto inline-flex text-[10px] font-semibold tracking-[0.12em] text-primary uppercase hover:underline"
        >
          Back to vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7 p-8">
      <Link
        href="/admin/vehicles"
        className="font-roboto inline-flex text-[10px] font-semibold tracking-[0.12em] text-secondary uppercase transition-colors hover:text-primary"
      >
        ← Back to vehicles
      </Link>

      <section className="overflow-hidden rounded-2xl border border-accent/12 bg-card">
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[280px_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-accent/10 bg-surface">
            {profile.imageUrl && isImageUrl(profile.imageUrl) ? (
              <Image
                src={profile.imageUrl}
                alt={profile.displayName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center">
                <p className="font-copperplate text-[18px] tracking-[0.04em] text-secondary uppercase">
                  {profile.make}
                  {profile.model ? (
                    <>
                      <br />
                      <span className="text-primary italic">{profile.model}</span>
                    </>
                  ) : null}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-copperplate text-[32px] leading-none tracking-[0.04em] text-foreground uppercase">
                  {profile.displayName}
                </h1>

                {profile.isPriority ? (
                  <span className="font-roboto rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[9px] font-semibold tracking-[0.1em] text-primary uppercase">
                    Priority
                  </span>
                ) : null}
              </div>

              <p className="font-roboto text-[10px] tracking-[0.06em] text-secondary uppercase">
                {profile.year} · {profile.colour}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`font-roboto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase ${statusTone(
                    profile.statusKey,
                    profile.isOverdueService,
                  )}`}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {profile.statusLabel}
                </span>

                <span className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
                  {profile.lastActivity}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <DetailField label="Bay" value={profile.bay} />
              <DetailField label="Storage" value={profile.storageBay} />
              <DetailField label="Mileage" value={profile.mileage} />
              <DetailField label="Plate" value={profile.plate} />
            </div>
          </div>
        </div>

        {profile.isOverdueService ? (
          <div className="border-t border-[var(--pink)]/20 bg-[var(--pink)]/[0.06] px-6 py-3">
            <p className="font-roboto text-[10px] font-semibold tracking-[0.12em] text-[var(--pink)] uppercase">
              Service overdue — review maintenance schedule
            </p>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-accent/12 bg-card p-6">
        <h2 className="mb-5 font-copperplate text-[18px] tracking-[0.04em] text-foreground uppercase">
          Owner & Vehicle Details
        </h2>

        <div className="mb-6 flex items-center gap-3">
          {profile.memberProfileImageUrl ? (
            <Image
              src={profile.memberProfileImageUrl}
              alt={profile.memberName}
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#F0C566] to-[#8B6F2A] font-roboto text-[12px] font-semibold text-dark uppercase">
              {profile.memberInitial}
            </span>
          )}

          <div>
            <p className="font-roboto text-[12px] font-semibold tracking-[0.06em] text-foreground uppercase">
              {profile.memberName}
            </p>
            <p className="font-roboto text-[9px] tracking-[0.06em] text-secondary uppercase">
              Member No. {profile.memberId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <DetailField label="Make" value={profile.make} />
          <DetailField label="Model" value={profile.model || "—"} />
          <DetailField label="Year" value={profile.year} />
          <DetailField label="Colour" value={profile.colour} />
          <DetailField label="Chassis No." value={profile.chassisNo} />
          <DetailField label="Ownership" value={profile.ownershipType} />
          <DetailField label="Last Serviced" value={profile.lastServicedAt} />
          <DetailField label="Fuel Level" value={profile.fuelLevel} />
          <DetailField label="Owner" value={profile.ownerName} />
        </div>
      </section>

      {profile.health.length > 0 ? (
        <section className="rounded-2xl border border-accent/12 bg-card p-6">
          <h2 className="mb-5 font-copperplate text-[18px] tracking-[0.04em] text-foreground uppercase">
            Vehicle Health
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {profile.health.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <HealthProgressBar
                  metric={{
                    label: metric.label,
                    value: metric.value,
                    tone: metric.tone,
                  }}
                />
                <p className="font-roboto text-[10px] leading-relaxed text-secondary">
                  {metric.note}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {profile.documents.length > 0 ? (
        <section className="rounded-2xl border border-accent/12 bg-card p-6">
          <h2 className="mb-5 font-copperplate text-[18px] tracking-[0.04em] text-foreground uppercase">
            Documents
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {profile.documents.map((document) => (
              <a
                key={document.label}
                href={document.url}
                target="_blank"
                rel="noreferrer"
                className="font-roboto rounded-xl border border-accent/12 bg-surface/60 px-4 py-3 text-[11px] font-semibold tracking-[0.06em] text-primary uppercase transition-colors hover:border-primary/40 hover:bg-primary/[0.06]"
              >
                {document.label}
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
