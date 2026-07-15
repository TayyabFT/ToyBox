"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ClockIcon,
  PackageBox,
  StatMembersIcon,
  VehicleFlag,
  Workshop,
} from "@/components/common/Svgs";
import { adminWorkshopApi } from "@/api/adminWorkshop.api";
import {
  OverviewOutsideHeader,
  overviewPanelClass,
} from "@/components/admin/overview";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import {
  createEmptyWorkshopStats,
  mapWorkshopBays,
  mapWorkshopDashboardStats,
  mapWorkshopQueueItems,
} from "@/lib/workshop";
import { showError } from "@/lib/toast";
import { ActiveBayCard } from "./ActiveBayCard";
import { ServiceQueueTable } from "./ServiceQueueTable";
import type {
  ActiveBayItem,
  ServiceQueueItem,
  WorkshopStatItem,
} from "./types";
import { WorkshopAlertBar } from "./WorkshopAlertBar";
import { WorkshopPageHeader } from "./WorkshopPageHeader";
import { WorkshopStatCard } from "./WorkshopStatCard";

const statIcons = [
  <Workshop key="jobs" />,
  <VehicleFlag key="overdue" color="currentColor" className="size-4" />,
  <PackageBox key="parts" className="size-4" />,
  <ClockIcon key="turnaround" color="currentColor" className="size-4" />,
  <StatMembersIcon key="engineers" className="size-4" />,
];

function ActiveBayCardSkeleton() {
  return (
    <div className="flex min-h-[220px] flex-col rounded-xl border border-[var(--overview-border)] bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <ShimmerBlock className="h-2.5 w-14" />
        <ShimmerBlock className="h-4 w-16 rounded-full" />
      </div>
      <div className="mb-3 space-y-1.5">
        <ShimmerBlock className="h-3.5 w-32" />
        <ShimmerBlock className="h-2.5 w-40" />
      </div>
      <ShimmerBlock className="mb-4 h-8 w-full flex-1" />
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--overview-border)] pt-3.5">
        <ShimmerBlock className="h-2.5 w-24" />
        <ShimmerBlock className="h-2.5 w-14" />
      </div>
    </div>
  );
}

export function WorkshopPage() {
  const activeBaysRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<WorkshopStatItem[]>(() =>
    createEmptyWorkshopStats(),
  );
  const [activeBays, setActiveBays] = useState<ActiveBayItem[]>([]);
  const [serviceQueue, setServiceQueue] = useState<ServiceQueueItem[]>([]);
  const [queueTotal, setQueueTotal] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [baysLoading, setBaysLoading] = useState(true);
  const [queueLoading, setQueueLoading] = useState(true);

  const loadWorkshopData = useCallback(async () => {
    setStatsLoading(true);
    setBaysLoading(true);
    setQueueLoading(true);

    try {
      const [statsResponse, baysResponse, queueResponse] = await Promise.all([
        adminWorkshopApi.getDashboardStats(),
        adminWorkshopApi.getDashboardBays(),
        adminWorkshopApi.getDashboardQueue({ page: 1, limit: 20 }),
      ]);

      setStats(mapWorkshopDashboardStats(statsResponse.data));
      setActiveBays(mapWorkshopBays(baysResponse.data.bays));
      setServiceQueue(mapWorkshopQueueItems(queueResponse.data.items));
      setQueueTotal(queueResponse.data.total);
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load workshop data";

      showError(message);
      setStats(createEmptyWorkshopStats());
      setActiveBays([]);
      setServiceQueue([]);
      setQueueTotal(0);
    } finally {
      setStatsLoading(false);
      setBaysLoading(false);
      setQueueLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWorkshopData();
  }, [loadWorkshopData]);

  function scrollToActiveBays() {
    activeBaysRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const baysSubtitle = baysLoading
    ? "Loading..."
    : `${activeBays.length} item${activeBays.length === 1 ? "" : "s"} · sorted by time`;

  const queueSubtitle = queueLoading
    ? "Loading..."
    : `Scheduled · ${queueTotal} item${queueTotal === 1 ? "" : "s"}`;

  return (
    <div className="space-y-6 p-8">
      <WorkshopPageHeader />

      <WorkshopAlertBar
        count={3}
        items={[
          { highlight: "Ferrari 296", detail: "overdue 12 days" },
          {
            highlight: "Mr. Al Mansoori",
            detail: "arriving 14:30 · suite pending",
          },
          { highlight: "Auction Day", detail: "headcount by 12:00" },
        ]}
        actionLabel="Review all"
        onReviewAll={scrollToActiveBays}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {stats.map((stat, index) => (
          <WorkshopStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            footnote={stat.footnote}
            valueTone={stat.valueTone}
            iconTone={stat.iconTone}
            trend={statsLoading ? undefined : stat.trend}
            icon={statIcons[index]}
            valueLoading={statsLoading}
          />
        ))}
      </div>

      <div ref={activeBaysRef} className="scroll-mt-6 pt-2">
        <OverviewOutsideHeader
          titleSplit={{ before: "Active", after: "Bays" }}
          title=""
          subtitle={baysSubtitle}
        />
        <div
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          aria-busy={baysLoading}
        >
          {baysLoading ? (
            Array.from({ length: 3 }, (_, index) => (
              <ActiveBayCardSkeleton key={index} />
            ))
          ) : activeBays.length > 0 ? (
            activeBays.map((bay) => (
              <ActiveBayCard key={bay.id} bay={bay} />
            ))
          ) : (
            <p className="font-roboto col-span-full py-10 text-center text-[11px] tracking-[0.06em] text-secondary uppercase">
              No active bays
            </p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div className="[&>div]:mb-0">
            <OverviewOutsideHeader
              titleSplit={{ before: "Service", after: "Queue" }}
              title=""
              subtitle={queueSubtitle}
            />
          </div>
          <button
            type="button"
            className="admin-gold-cta font-roboto shrink-0 cursor-pointer rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase"
          >
            Open Scheduler →
          </button>
        </div>

        <section className={overviewPanelClass}>
          <ServiceQueueTable rows={serviceQueue} loading={queueLoading} />
        </section>
      </div>
    </div>
  );
}
