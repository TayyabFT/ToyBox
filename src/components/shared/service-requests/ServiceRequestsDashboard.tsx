"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  filterDetailingJobs,
  filterMaintenanceJobs,
  filterTransportJobs,
} from "@/lib/serviceRequests";
import { showError } from "@/lib/toast";
import { ActiveJobDetailPanel } from "./ActiveJobDetailPanel";
import { DetailingSection } from "./DetailingSection";
import { activeJobDetail } from "./mockData";
import { MaintenanceSection } from "./MaintenanceSection";
import { ServiceRequestsGreeting } from "./ServiceRequestsGreeting";
import { ServiceRequestsStatsRow } from "./ServiceRequestsStatsRow";
import { TransportSection } from "./TransportSection";
import type {
  DetailingJob,
  MaintenanceJob,
  SectionMeta,
  ServiceRequestFilter,
  ServiceRequestStat,
  TransportJob,
} from "./types";

type SectionConfig<T> = {
  load: () => Promise<{ jobs: T[]; count: number }>;
  buildMeta: (jobs: T[], count: number) => SectionMeta;
};

type ServiceRequestsDashboardProps = {
  basePath: string;
  transport: SectionConfig<TransportJob>;
  maintenance: SectionConfig<MaintenanceJob>;
  detailing: SectionConfig<DetailingJob>;
  loadStats: () => Promise<ServiceRequestStat[]>;
};

const PREVIEW_COUNT = 2;

export function ServiceRequestsDashboard({
  basePath,
  transport,
  maintenance,
  detailing,
  loadStats,
}: ServiceRequestsDashboardProps) {
  const [activeFilter, setActiveFilter] = useState<ServiceRequestFilter>("all");

  const [transportJobs, setTransportJobs] = useState<TransportJob[]>([]);
  const [transportCount, setTransportCount] = useState(0);
  const [transportLoading, setTransportLoading] = useState(true);

  const [maintenanceJobs, setMaintenanceJobs] = useState<MaintenanceJob[]>([]);
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [maintenanceLoading, setMaintenanceLoading] = useState(true);

  const [detailingJobs, setDetailingJobs] = useState<DetailingJob[]>([]);
  const [detailingCount, setDetailingCount] = useState(0);
  const [detailingLoading, setDetailingLoading] = useState(true);

  const loadTransportRequests = useCallback(async () => {
    setTransportLoading(true);

    try {
      const { jobs, count } = await transport.load();

      setTransportJobs(jobs);
      setTransportCount(count);
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load transport requests";

      showError(message);
      setTransportJobs([]);
      setTransportCount(0);
    } finally {
      setTransportLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMaintenanceRequests = useCallback(async () => {
    setMaintenanceLoading(true);

    try {
      const { jobs, count } = await maintenance.load();

      setMaintenanceJobs(jobs);
      setMaintenanceCount(count);
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load maintenance requests";

      showError(message);
      setMaintenanceJobs([]);
      setMaintenanceCount(0);
    } finally {
      setMaintenanceLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDetailingBookings = useCallback(async () => {
    setDetailingLoading(true);

    try {
      const { jobs, count } = await detailing.load();

      setDetailingJobs(jobs);
      setDetailingCount(count);
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load detailing bookings";

      showError(message);
      setDetailingJobs([]);
      setDetailingCount(0);
    } finally {
      setDetailingLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadTransportRequests();
    loadMaintenanceRequests();
    loadDetailingBookings();
  }, [loadTransportRequests, loadMaintenanceRequests, loadDetailingBookings]);

  const filteredTransport = useMemo(
    () => filterTransportJobs(transportJobs, activeFilter),
    [activeFilter, transportJobs],
  );
  const filteredMaintenance = useMemo(
    () => filterMaintenanceJobs(maintenanceJobs, activeFilter),
    [activeFilter, maintenanceJobs],
  );
  const filteredDetailing = useMemo(
    () => filterDetailingJobs(detailingJobs, activeFilter),
    [activeFilter, detailingJobs],
  );

  const previewTransport = filteredTransport.slice(0, PREVIEW_COUNT);
  const previewMaintenance = filteredMaintenance.slice(0, PREVIEW_COUNT);
  const previewDetailing = filteredDetailing.slice(0, PREVIEW_COUNT);

  const transportMeta = transport.buildMeta(transportJobs, transportCount);
  const maintenanceMeta = maintenance.buildMeta(maintenanceJobs, maintenanceCount);
  const detailingMeta = detailing.buildMeta(detailingJobs, detailingCount);

  const showActiveJob =
    activeFilter === "all" ||
    activeFilter === "transport" ||
    activeFilter === "urgent";

  const showTransportSection =
    activeFilter === "all" || activeFilter === "transport";

  const showMaintenanceSection =
    activeFilter === "all" || activeFilter === "maintenance";

  const showDetailingSection =
    activeFilter === "all" || activeFilter === "detailing";

  return (
    <div className="space-y-8 p-8">
      <ServiceRequestsGreeting
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <ServiceRequestsStatsRow loadStats={loadStats} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {showTransportSection ? (
          <TransportSection
            meta={transportMeta}
            jobs={previewTransport}
            seeAllHref={`${basePath}/service-requests/transport`}
            loading={transportLoading}
          />
        ) : null}
        {showMaintenanceSection ? (
          <MaintenanceSection
            meta={maintenanceMeta}
            jobs={previewMaintenance}
            seeAllHref={`${basePath}/service-requests/maintenance`}
            loading={maintenanceLoading}
          />
        ) : null}
        {showDetailingSection ? (
          <DetailingSection
            meta={detailingMeta}
            jobs={previewDetailing}
            seeAllHref={`${basePath}/service-requests/detailing`}
            loading={detailingLoading}
          />
        ) : null}
        {showActiveJob && <ActiveJobDetailPanel detail={activeJobDetail} />}
      </div>
    </div>
  );
}
