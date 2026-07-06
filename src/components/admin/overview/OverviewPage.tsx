"use client";

import { useEffect, useRef, useState } from "react";
import {
  ActivityAI,
  ActivityChat,
  ActivityCheck,
  ActivityKey,
  ActivityUser,
  AlertTriangle,
  Dollar,
  StatCarIcon,
  StatDollarIcon,
  StatMembersIcon,
  StatMessageIcon,
} from "@/components/common/Svgs";
import { adminOverviewApi } from "@/api/adminOverview.api";
import type { AdminOverviewData } from "@/types/api";
import { ActivityHighlight, RecentActivityItem } from "./RecentActivityItem";
import { CriticalAlertItem, criticalAlertsPanelClass } from "./CriticalAlertItem";
import { DashboardGreeting } from "./DashboardGreeting";
import { OpenRequestsTable } from "./OpenRequestsTable";
import { OverviewOutsideHeader, OverviewSectionHeader } from "./OverviewSectionHeader";
import { PriorityScheduleItem } from "./PriorityScheduleItem";
import { ScheduleTimeline, ScheduleTimelineItem } from "./ScheduleTimelineItem";
import { StaffOnShiftList } from "./StaffOnShiftItem";
import { StatCard } from "./StatCard";
import { UrgentAlertBar } from "./UrgentAlertBar";
import { overviewPanelClass } from "./panelStyles";

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function getCountdown(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  if (diffMs <= 0) return "Now";
  const h = Math.floor(diffMs / 3_600_000);
  const m = Math.floor((diffMs % 3_600_000) / 60_000);
  return h > 0 ? `In ${h}h ${m}m` : `In ${m}m`;
}

function scheduleState(iso: string): "completed" | "active" | "upcoming" {
  const t = new Date(iso).getTime();
  const now = Date.now();
  if (t < now - 30 * 60_000) return "completed";
  if (t <= now + 15 * 60_000) return "active";
  return "upcoming";
}

function mapPriorityTagTone(type: string): "gold" | "teal" | "pink" | "purple" {
  switch (type) {
    case "arrival": return "gold";
    case "onboarding": return "pink";
    case "event": return "purple";
    case "workshop": return "teal";
    default: return "gold";
  }
}

function mapAlertTone(severity: string): "critical" | "payment" | "warning" | "purple" {
  if (severity === "payment") return "payment";
  if (severity === "critical") return "critical";
  if (severity === "info") return "purple";
  return "warning";
}

function mapStaffStatus(status: string): "online" | "active" | "meeting" {
  if (status === "meeting") return "meeting";
  if (status === "active") return "active";
  return "online";
}

function mapActivityTone(sourceType: string): "gold" | "purple" | "teal" | "pink" {
  const s = (sourceType ?? "").toLowerCase();
  if (s.includes("ai") || s.includes("auto")) return "purple";
  if (s.includes("workshop")) return "teal";
  if (s.includes("critical") || s.includes("alert")) return "pink";
  return "gold";
}

function AlertToneIcon({ tone }: { tone: "critical" | "payment" | "warning" | "purple" }) {
  if (tone === "critical") return <AlertTriangle color="#E57373" className="size-4" />;
  if (tone === "payment") return <Dollar color="#F0A0A0" className="size-4" />;
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 4.75v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  );
}

function ActivityIcon({ sourceType }: { sourceType: string }) {
  const s = (sourceType ?? "").toLowerCase();
  const cls = "size-3.5";
  if (s.includes("concierge") || s.includes("chat")) return <ActivityChat className={cls} />;
  if (s.includes("ai") || s.includes("auto")) return <ActivityAI className={cls} />;
  if (s.includes("workshop")) return <ActivityCheck className={cls} />;
  if (s.includes("vehicle")) return <ActivityKey className={cls} />;
  if (s.includes("critical") || s.includes("alert"))
    return <AlertTriangle color="#E57373" className={cls} />;
  return <ActivityUser className={cls} />;
}

function parseGreeting(text: string, firstName: string): { greeting: string; name: string } {
  const idx = text.lastIndexOf(", ");
  return {
    greeting: idx > -1 ? text.slice(0, idx) : text.replace(/,.*$/, "").trim(),
    name: `${firstName}.`,
  };
}

/** Compact empty state — minimal height, single line message */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <p className="font-roboto text-[11px] tracking-[0.08em] text-secondary/40 uppercase">
        {message}
      </p>
    </div>
  );
}

export function AdminOverviewPage() {
  const criticalAlertsRef = useRef<HTMLElement>(null);
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);

  useEffect(() => {
    adminOverviewApi
      .getOverview()
      .then((res) => {
        if (res?.data) setOverview(res.data);
      })
      .catch(() => {});
  }, []);

  function scrollToCriticalAlerts() {
    criticalAlertsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const greeting = overview
    ? parseGreeting(overview.greeting.text, overview.greeting.firstName)
    : { greeting: "Good morning", name: "" };

  const kpis = overview?.kpis;
  const ticker = overview?.ticker;
  const priorities = overview?.todayPriorities;
  const criticalAlerts = overview?.criticalAlerts;
  const conciergeQueue = overview?.conciergeQueue;
  const recentActivity = overview?.recentActivity;
  const staffOnShift = overview?.staffOnShift;
  const todaySchedule = overview?.todaySchedule;

  const tickerItems = (ticker?.alerts ?? []).map((a) => {
    const dashIdx = a.message.indexOf(" — ");
    return {
      highlight: dashIdx > -1 ? a.message.slice(0, dashIdx) : a.message,
      detail: a.detail,
    };
  });

  const queueRows = (conciergeQueue?.items ?? []).map((item) => ({
    initial: item.memberName.charAt(0).toUpperCase(),
    memberName: item.memberName.toUpperCase(),
    memberMeta: `No. ${item.memberNumber} · ${item.requestType}`,
    request: item.vehicleLabel ? `${item.title} · ${item.vehicleLabel}` : item.title,
    priority: (item.urgency === "urgent" ? "urgent" : "high") as "urgent" | "high",
    waiting: `${item.waitingMinutes}m`,
    assignedName: "—",
    assignedTone: "human" as const,
  }));

  const staffRows = (staffOnShift?.members ?? []).map((m) => ({
    initial: m.name.charAt(0).toUpperCase(),
    name: m.name,
    role: m.jobTitle,
    status: mapStaffStatus(m.status),
    meta: "",
    avatarTone: "gold" as const,
  }));

  const hasPriorities = (priorities?.items ?? []).length > 0;
  const hasAlerts = (criticalAlerts?.items ?? []).length > 0;
  const hasQueue = queueRows.length > 0;
  const hasStaff = staffRows.length > 0;
  const hasActivity = (recentActivity?.items ?? []).length > 0;
  const hasSchedule = (todaySchedule?.items ?? []).length > 0;

  return (
    <div className="space-y-7 p-8">
      <DashboardGreeting greeting={greeting.greeting} name={greeting.name} />

      {(ticker?.criticalCount ?? 0) > 0 && (
        <UrgentAlertBar
          count={ticker!.criticalCount}
          items={tickerItems}
          actionLabel="Review all"
          onReviewAll={scrollToCriticalAlerts}
        />
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          label={kpis?.activeMembers.label ?? "Active Members"}
          value={kpis ? String(kpis.activeMembers.value) : "—"}
          footnote="Founding"
          trend={kpis ? `+${kpis.activeMembers.newToday}` : ""}
          icon={<StatMembersIcon />}
          featured
        />
        <StatCard
          label={kpis?.inStorage.label ?? "In Storage"}
          value={kpis ? String(kpis.inStorage.value) : "—"}
          footnote="Vehicles"
          trend={kpis ? `+${kpis.inStorage.newThisWeek}` : ""}
          icon={<StatCarIcon />}
        />
        <StatCard
          label={kpis?.openRequests.label ?? "Open Requests"}
          value={kpis ? String(kpis.openRequests.value) : "—"}
          footnote={kpis ? `${kpis.openRequests.urgent} urgent` : ""}
          footnoteTone="pink"
          trend={kpis ? `+${kpis.openRequests.urgent}` : ""}
          icon={<StatMessageIcon />}
        />
        <StatCard
          label={kpis?.todayRevenue.label ?? "Today's Revenue"}
          value={kpis?.todayRevenue.displayValue ?? "—"}
          footnote="Vs avg"
          trend={kpis ? `+${kpis.todayRevenue.changeVsLastWeekPercent}%` : ""}
          icon={<StatDollarIcon />}
        />
      </div>

      {/*
        Single two-column layout for ALL sections below KPIs.
        Left and right are fully independent flex columns — nothing in one column
        can ever affect the height or spacing of the other column.

        LEFT:  Today's Priorities → Concierge Queue → Recent Activity
        RIGHT: Critical Alerts → Staff on Shift → Today's Schedule
      */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">

        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className="flex w-full min-w-0 flex-col gap-6 xl:flex-[1.7]">

          {/* Today's Priorities */}
          <div>
            <OverviewOutsideHeader
              titleSplit={{ before: "Today's", after: "Priorities" }}
              title=""
              subtitle={priorities?.subtitle ?? ""}
            />
            <section className={`${overviewPanelClass} flex flex-col ${hasPriorities ? "h-95" : ""}`}>
              {hasPriorities ? (
                <div className="flex-1 overflow-y-auto Custom__Scrollbar">
                  {(priorities?.items ?? []).map((item) => {
                    const tagTone = mapPriorityTagTone(item.type);
                    const dashIdx = item.title.indexOf(" — ");
                    const titleParts =
                      dashIdx > -1
                        ? { before: item.title.slice(0, dashIdx), after: item.title.slice(dashIdx + 3) }
                        : item.memberName
                          ? { before: item.memberName, after: item.title }
                          : undefined;
                    return (
                      <PriorityScheduleItem
                        key={item.id}
                        time={formatTime(item.time)}
                        countdown={getCountdown(item.time)}
                        tag={{ label: item.tag, tone: tagTone }}
                        title={item.title}
                        titleParts={titleParts}
                        detail={item.detail}
                        action="View"
                        actionTone={item.priority === "high" ? "pink" : "gold"}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyState message="No priorities scheduled for today" />
              )}
            </section>
          </div>

          {/* Concierge Queue */}
          <div>
            <OverviewOutsideHeader
              titleSplit={{ before: "Concierge", after: "Queue" }}
              title=""
              subtitle={
                conciergeQueue
                  ? `${conciergeQueue.openCount} open · ${conciergeQueue.urgentCount} urgent`
                  : ""
              }
            />
            <section className={`${overviewPanelClass} flex flex-col ${hasQueue ? "h-110" : ""}`}>
              {hasQueue ? (
                <div className="flex-1 overflow-y-auto Custom__Scrollbar">
                  <OpenRequestsTable rows={queueRows} />
                </div>
              ) : (
                <EmptyState message="No open requests" />
              )}
            </section>
          </div>

          {/* Recent Activity */}
          <div>
            <OverviewOutsideHeader
              titleSplit={{ before: "Recent", after: "Activity" }}
              title=""
              subtitle={
                recentActivity
                  ? `Last ${recentActivity.windowMinutes} minutes · ${recentActivity.count} events`
                  : ""
              }
            />
            <section className={`${overviewPanelClass} flex flex-col ${hasActivity ? "h-110" : ""}`}>
              {hasActivity ? (
                <div className="flex-1 overflow-y-auto Custom__Scrollbar">
                  {(recentActivity?.items ?? []).map((item) => {
                    const tone = mapActivityTone(item.sourceType);
                    return (
                      <RecentActivityItem
                        key={item.id}
                        time={formatTime(item.time)}
                        icon={<ActivityIcon sourceType={item.sourceType} />}
                        iconTone={tone}
                        category={item.sourceType}
                        categoryTone={tone === "pink" ? "critical" : "default"}
                      >
                        <ActivityHighlight>{item.actor}</ActivityHighlight> {item.action}
                        {item.subject ? (
                          <> <ActivityHighlight>{item.subject}</ActivityHighlight></>
                        ) : null}
                      </RecentActivityItem>
                    );
                  })}
                </div>
              ) : (
                <EmptyState message="No recent activity" />
              )}
            </section>
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────────────── */}
        <div className="flex w-full min-w-0 flex-col gap-6 xl:flex-1">

          {/* Critical Alerts */}
          <section
            ref={criticalAlertsRef}
            id="critical-alerts"
            className={`${criticalAlertsPanelClass} scroll-mt-6 flex flex-col ${hasAlerts ? "h-105" : ""}`}
          >
            <OverviewSectionHeader
              titleSplit={{ before: "Critical", after: "Alerts" }}
              title=""
              divider
            />
            {hasAlerts ? (
              <div className="flex-1 overflow-y-auto Custom__Scrollbar">
                {(criticalAlerts?.items ?? []).map((item) => {
                  const tone = mapAlertTone(item.severity);
                  return (
                    <CriticalAlertItem
                      key={item.id}
                      tone={tone}
                      typeLabel={item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                      status={item.detail}
                      title={item.title}
                      description={item.detail}
                      icon={<AlertToneIcon tone={tone} />}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState message="No critical alerts" />
            )}
          </section>

          {/* Staff on Shift */}
          <section className={`${overviewPanelClass} flex flex-col ${hasStaff ? "h-110" : ""}`}>
            <OverviewSectionHeader
              titleSplit={{ before: "Staff on", after: "Shift" }}
              title=""
              trailing={staffOnShift ? String(staffOnShift.activeCount) : ""}
            />
            {hasStaff ? (
              <div className="flex-1 overflow-y-auto Custom__Scrollbar">
                <StaffOnShiftList rows={staffRows} />
              </div>
            ) : (
              <EmptyState message="No staff on shift" />
            )}
          </section>

          {/* Today's Schedule */}
          <section className={`${overviewPanelClass} flex flex-col bg-[#12110f] ${hasSchedule ? "h-110" : ""}`}>
            <OverviewSectionHeader
              titleSplit={{ before: "Today's", after: "Schedule" }}
              title=""
              trailing={todaySchedule?.date ?? ""}
            />
            {hasSchedule ? (
              <div className="flex-1 overflow-y-auto Custom__Scrollbar">
                <ScheduleTimeline>
                  {(todaySchedule?.items ?? []).map((item, i) => {
                    const state = scheduleState(item.time);
                    return (
                      <ScheduleTimelineItem
                        key={`${item.time}-${i}`}
                        time={formatTime(item.time)}
                        title={item.title}
                        detail={item.subtitle || item.vehicleLabel || undefined}
                        state={state}
                        statusLabel={state === "active" ? "In progress" : undefined}
                      />
                    );
                  })}
                </ScheduleTimeline>
              </div>
            ) : (
              <EmptyState message="No schedule for today" />
            )}
          </section>
        </div>

      </div>
    </div>
  );
}
