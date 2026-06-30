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
  overviewActionButtonClass,
  overviewPanelClass,
} from "@/components/admin/overview";
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
            value={statsLoading ? "—" : stat.value}
            footnote={stat.footnote}
            valueTone={stat.valueTone}
            iconTone={stat.iconTone}
            trend={statsLoading ? undefined : stat.trend}
            icon={statIcons[index]}
          />
        ))}
      </div>

      <div ref={activeBaysRef} className="scroll-mt-6 pt-2">
        <OverviewOutsideHeader
          titleSplit={{ before: "Active", after: "Bays" }}
          title=""
          subtitle={baysSubtitle}
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {baysLoading ? (
            <p className="font-roboto col-span-full py-10 text-center text-[11px] tracking-[0.06em] text-[#6B665E] uppercase">
              Loading active bays...
            </p>
          ) : activeBays.length > 0 ? (
            activeBays.map((bay) => (
              <ActiveBayCard key={bay.id} bay={bay} />
            ))
          ) : (
            <p className="font-roboto col-span-full py-10 text-center text-[11px] tracking-[0.06em] text-[#6B665E] uppercase">
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
          <button type="button" className={overviewActionButtonClass}>
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
