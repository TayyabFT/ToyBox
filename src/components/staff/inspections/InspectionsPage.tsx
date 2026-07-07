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
import { AddInspectionModal } from "./add-inspection";
import { InspectionsGreeting } from "./InspectionsGreeting";
import { useStaffInspections } from "./useStaffInspections";

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
          <section className="w-full self-start rounded-2xl border border-accent/10 bg-card p-5">
            <p className="font-roboto py-8 text-center text-sm text-secondary">
              Loading inspection detail...
            </p>
          </section>
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
        ) : (
          <section className="w-full self-start rounded-2xl border border-accent/10 bg-card p-5">
            <p className="font-roboto py-8 text-center text-sm text-secondary">
              {loading
                ? "Loading inspections..."
                : "Select an inspection from the queue."}
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
