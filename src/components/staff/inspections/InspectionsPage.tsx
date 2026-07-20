"use client";

import { useMemo, useState } from "react";
import {
  ActionCheckbox,
  ConfirmationPendingClock,
  VehicleFlag,
  VehicleFleetReady,
} from "@/components/common/Svgs";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { StatCard } from "@/components/staff/overview/StatCard";
import { ActiveInspectionPanel } from "./ActiveInspectionPanel";
import { InspectionQueuePanel } from "./InspectionQueuePanel";
import { AddInspectionModal } from "./add-inspection";
import { InspectionsGreeting } from "./InspectionsGreeting";
import { useStaffInspections } from "./useStaffInspections";

function InspectionDetailSkeleton() {
  return (
    <section
      className="w-full self-start rounded-2xl border border-accent/10 bg-card p-5"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-accent/6 pb-5">
        <ShimmerBlock className="h-4 w-56" />
        <ShimmerBlock className="h-7 w-24 rounded-lg" />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 border-b border-accent/6 pb-6 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-1.5">
            <ShimmerBlock className="h-2.5 w-16" />
            <ShimmerBlock className="h-3.5 w-20" />
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <ShimmerBlock key={index} className="h-8 flex-1 rounded-lg" />
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <ShimmerBlock key={index} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    </section>
  );
}

export function InspectionsPage() {
  const [addInspectionOpen, setAddInspectionOpen] = useState(false);
  const {
    stats,
    queue,
    selectedId,
    setSelectedId,
    inspection,
    loading,
    detailLoading,
    actionLoading,
    pendingCount,
    saveDraft,
    submitReport,
    uploadPhoto,
    toggleChecklistItem,
    changeStep,
    setStep,
    updateOdometer,
    updateFuelLevel,
    updateNotes,
    createInspection,
    canEditInspection,
  } = useStaffInspections();

  const statCards = useMemo(
    () => [
      {
        label: "Due Today",
        value: stats.dueToday.value,
        subtext: stats.dueToday.subtext,
        icon: <ActionCheckbox />,
      },
      {
        label: "In Progress",
        value: stats.inProgress.value,
        subtext: stats.inProgress.subtext,
        icon: <ConfirmationPendingClock />,
      },
      {
        label: "Completed",
        value: stats.completed.value,
        subtext: stats.completed.subtext,
        icon: <VehicleFleetReady />,
      },
      {
        label: "Flagged Issues",
        value: stats.flagged.value,
        subtext: stats.flagged.subtext,
        icon: <VehicleFlag />,
        highlighted: true,
      },
    ],
    [stats],
  );

  return (
    <div className="space-y-8 p-8">
      <InspectionsGreeting onAddInspection={() => setAddInspectionOpen(true)} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={loading ? "—" : card.value}
            subtext={card.subtext}
            icon={card.icon}
            iconSize="lg"
            valueLoading={loading}
            highlighted={card.highlighted}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <InspectionQueuePanel
          items={queue}
          selectedId={selectedId}
          pendingCount={pendingCount}
          loading={loading}
          onSelect={setSelectedId}
        />

        {detailLoading && !inspection ? (
          <InspectionDetailSkeleton />
        ) : inspection ? (
          <ActiveInspectionPanel
            inspection={inspection}
            actionLoading={actionLoading}
            canEditInspection={canEditInspection}
            onSaveDraft={() => void saveDraft()}
            onSubmit={() => void submitReport()}
            onUploadPhoto={uploadPhoto}
            onToggleChecklistItem={toggleChecklistItem}
            onStepBack={() => changeStep("back")}
            onStepNext={() => changeStep("next")}
            onStepSelect={setStep}
            onOdometerChange={updateOdometer}
            onFuelLevelChange={updateFuelLevel}
            onNotesChange={updateNotes}
          />
        ) : loading ? (
          <InspectionDetailSkeleton />
        ) : (
          <section className="w-full self-start rounded-2xl border border-accent/10 bg-card p-5">
            <p className="font-roboto py-8 text-center text-sm text-secondary">
              Select an inspection from the queue.
            </p>
          </section>
        )}
      </div>

      <AddInspectionModal
        open={addInspectionOpen}
        onClose={() => setAddInspectionOpen(false)}
        onSubmit={createInspection}
      />
    </div>
  );
}
