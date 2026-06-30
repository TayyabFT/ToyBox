"use client";

import { useMemo, useState } from "react";
import {
  ActionCheckbox,
  ConfirmationPendingClock,
  VehicleFlag,
  VehicleFleetReady,
} from "@/components/common/Svgs";
import { StatCard } from "@/components/staff/overview/StatCard";
import { ActiveInspectionPanel } from "./ActiveInspectionPanel";
import { InspectionQueuePanel } from "./InspectionQueuePanel";
import { InspectionsGreeting } from "./InspectionsGreeting";
import {
  activeInspection,
  inspectionQueue,
  inspectionStats,
} from "./mockData";

export function InspectionsPage() {
  const [selectedId, setSelectedId] = useState(inspectionQueue[0]?.id ?? "");

  const pendingCount = useMemo(
    () =>
      inspectionQueue.filter(
        (item) => item.status === "pending" || item.status === "overdue",
      ).length,
    [],
  );

  return (
    <div className="space-y-8 p-8">
      <InspectionsGreeting />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          label="Due Today"
          value={inspectionStats.dueToday.value}
          subtext={inspectionStats.dueToday.subtext}
          icon={<ActionCheckbox />}
          iconSize="lg"
        />
        <StatCard
          label="In Progress"
          value={inspectionStats.inProgress.value}
          subtext={inspectionStats.inProgress.subtext}
          icon={<ConfirmationPendingClock />}
          iconSize="lg"
        />
        <StatCard
          label="Completed"
          value={inspectionStats.completed.value}
          subtext={inspectionStats.completed.subtext}
          icon={<VehicleFleetReady />}
          iconSize="lg"
        />
        <StatCard
          label="Flagged Issues"
          value={inspectionStats.flagged.value}
          subtext={inspectionStats.flagged.subtext}
          icon={<VehicleFlag />}
          iconSize="lg"
          highlighted
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <InspectionQueuePanel
          items={inspectionQueue}
          selectedId={selectedId}
          pendingCount={pendingCount}
          onSelect={setSelectedId}
        />

        <ActiveInspectionPanel inspection={activeInspection} />
      </div>
    </div>
  );
}
