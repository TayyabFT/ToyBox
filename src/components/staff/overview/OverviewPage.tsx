"use client";

import { useCallback, useEffect, useState } from "react";
import { staffOverviewApi } from "@/api/staffOverview.api";
import {
  createEmptyStaffOverviewDisplay,
  mapStaffOverview,
} from "@/lib/staffOverview";
import { showError } from "@/lib/toast";
import { ActionCard } from "./ActionCard";
import { AssignmentCard } from "./AssignmentCard";
import { OverviewGreeting } from "./OverviewGreeting";
import { resolveOverviewIcon } from "./overviewIcons";
import { PriorityTaskItem } from "./PriorityTaskItem";
import { ScheduleItem } from "./ScheduleItem";
import { SectionHeader } from "./SectionHeader";
import { ShiftStatRow } from "./ShiftStatRow";
import { StaffDutyItem } from "./StaffDutyItem";
import { StatCard } from "./StatCard";
import { SystemAlertItem } from "./SystemAlertItem";
import type { StaffOverviewDisplay } from "./types";

function EmptySectionMessage({ message }: { message: string }) {
  return (
    <p className="font-roboto rounded-xl border border-accent/10 bg-elevated/40 px-4 py-6 text-center text-sm text-secondary">
      {message}
    </p>
  );
}

export function OverviewPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<StaffOverviewDisplay>(
    createEmptyStaffOverviewDisplay(),
  );

  const loadOverview = useCallback(async () => {
    setLoading(true);

    try {
      const [overviewResponse, jobsResponse] = await Promise.all([
        staffOverviewApi.getOverview(),
        staffOverviewApi.getJobs().catch(() => null),
      ]);

      setOverview(
        mapStaffOverview(overviewResponse.data, jobsResponse?.data),
      );
    } catch (error) {
      const message =
        (error as { message?: string }).message ??
        "Failed to load staff overview";

      showError(message);
      setOverview(createEmptyStaffOverviewDisplay());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const priorityBadge =
    overview.priorityTasks.urgentCount > 0
      ? {
          label: `${overview.priorityTasks.urgentCount} urgent`,
          tone: "red" as const,
        }
      : undefined;

  const alertsBadge =
    overview.systemAlerts.criticalCount > 0
      ? {
          label: `${overview.systemAlerts.criticalCount} critical`,
          tone: "red" as const,
        }
      : undefined;

  const staffBadge =
    overview.staffOnDuty.activeCount > 0
      ? {
          label: `${overview.staffOnDuty.activeCount} active`,
          tone: "green" as const,
        }
      : undefined;

  return (
    <div className="space-y-8 p-8">
      <OverviewGreeting
        displayDate={overview.greeting.displayDate}
        shiftLabel={overview.greeting.shiftLabel}
        staffName={overview.greeting.staffName}
        timeRemainingLabel={overview.greeting.timeRemainingLabel}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        {overview.kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            subtext={kpi.subtext}
            trend={kpi.trend}
            icon={resolveOverviewIcon(kpi.iconKey)}
            valueLoading={loading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview.quickActions.map((action) => (
          <ActionCard
            key={action.id}
            title={action.title}
            subtitle={action.subtitle}
            icon={resolveOverviewIcon(action.iconKey)}
            href={action.href}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="col-span-2 rounded-2xl border border-accent/10 bg-[var(--section-canvas)] p-5">
          <SectionHeader
            title="Priority Tasks · Today"
            badge={priorityBadge}
          />

          <div className="space-y-2">
            {!loading && overview.priorityTasks.items.length === 0 ? (
              <EmptySectionMessage message="No priority tasks for today" />
            ) : (
              overview.priorityTasks.items.map((task) => (
                <PriorityTaskItem
                  key={task.id}
                  index={task.index}
                  title={task.title}
                  detail={task.detail}
                  time={task.time}
                  status={task.status}
                  iconTone={task.iconTone}
                  icon={resolveOverviewIcon(task.iconKey)}
                />
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-accent/10 bg-[var(--section-canvas)] p-5">
          <SectionHeader
            title="Today's Schedule"
            trailing={
              overview.schedule.eventCount > 0
                ? `${overview.schedule.eventCount} events`
                : undefined
            }
          />

          <div className="space-y-3">
            {!loading && overview.schedule.items.length === 0 ? (
              <EmptySectionMessage message="No events scheduled today" />
            ) : (
              overview.schedule.items.map((item) => (
                <ScheduleItem
                  key={item.id}
                  time={item.time}
                  title={item.title}
                  detail={item.detail}
                />
              ))
            )}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-accent/10 bg-[var(--section-canvas)] p-5">
          <SectionHeader title="System Alerts" badge={alertsBadge} />

          <div className="space-y-2.5">
            {!loading && overview.systemAlerts.items.length === 0 ? (
              <EmptySectionMessage message="No system alerts" />
            ) : (
              overview.systemAlerts.items.map((alert) => (
                <SystemAlertItem
                  key={alert.id}
                  message={alert.message}
                  time={alert.time}
                  icon={resolveOverviewIcon(alert.iconKey)}
                />
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-accent/10 bg-surface p-5">
          <SectionHeader title="Staff on Duty" badge={staffBadge} />

          <div className="space-y-2.5">
            {!loading && overview.staffOnDuty.items.length === 0 ? (
              <EmptySectionMessage message="No staff on duty" />
            ) : (
              overview.staffOnDuty.items.map((staff) => (
                <StaffDutyItem
                  key={staff.id}
                  initial={staff.initial}
                  name={staff.name}
                  role={staff.role}
                  avatarClass={staff.avatarClass}
                  statusTone={staff.statusTone}
                  highlight={staff.highlight}
                />
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-accent/10 bg-surface p-5">
            <SectionHeader
              title="Shift Stats"
              trailing={overview.shiftStats.shiftLabel}
            />

            <div>
              {!loading && overview.shiftStats.items.length === 0 ? (
                <EmptySectionMessage message="No shift stats available" />
              ) : (
                overview.shiftStats.items.map((stat) => (
                  <ShiftStatRow
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                  />
                ))
              )}
            </div>
          </div>

          {overview.assignment && (
            <AssignmentCard assignment={overview.assignment} />
          )}
        </section>
      </div>
    </div>
  );
}
