"use client";

import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { ManagementBroadcastBar } from "./ManagementBroadcastBar";
import { OpUpdatesGreeting } from "./OpUpdatesGreeting";
import { PinnedNoticesPanel } from "./PinnedNoticesPanel";
import { PostUpdateCard } from "./PostUpdateCard";
import { ShiftLogPanel } from "./ShiftLogPanel";
import { ShiftUpdateFeed } from "./ShiftUpdateFeed";
import { useStaffOperationalUpdates } from "./useStaffOperationalUpdates";

function OpUpdatesPageSkeleton() {
  return (
    <div className="space-y-6 p-8" aria-busy="true" aria-live="polite">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <ShimmerBlock className="h-2.5 w-40" />
          <ShimmerBlock className="h-8 w-64" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <ShimmerBlock key={index} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="space-y-4 rounded-2xl border border-accent/10 bg-card p-5">
            <ShimmerBlock className="h-20 w-full rounded-xl" />
            <div className="flex justify-end">
              <ShimmerBlock className="h-9 w-28 rounded-lg" />
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-accent/10 bg-card p-5">
            <ShimmerBlock className="h-3 w-32" />
            {Array.from({ length: 3 }, (_, index) => (
              <ShimmerBlock key={index} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3 rounded-2xl border border-accent/10 bg-card p-5">
            <ShimmerBlock className="h-3 w-28" />
            {Array.from({ length: 3 }, (_, index) => (
              <ShimmerBlock key={index} className="h-12 w-full rounded-lg" />
            ))}
          </div>

          <div className="space-y-3 rounded-2xl border border-accent/10 bg-card p-5">
            <ShimmerBlock className="h-3 w-24" />
            {Array.from({ length: 3 }, (_, index) => (
              <ShimmerBlock key={index} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OpUpdatesPage() {
  const {
    tabs,
    broadcast,
    feedItems,
    pinnedNotices,
    shiftLogEntries,
    shiftLogStaffName,
    shiftLogFooter,
    authorInitial,
    vehicleOptions,
    memberOptions,
    activeFilter,
    postText,
    activeCategory,
    isFlagged,
    selectedVehicleId,
    selectedMemberId,
    linkedJobReference,
    loading,
    feedLoading,
    posting,
    optionsLoading,
    pinningId,
    setActiveFilter,
    setPostText,
    setActiveCategory,
    setIsFlagged,
    setSelectedVehicleId,
    setSelectedMemberId,
    setLinkedJobReference,
    createUpdate,
    togglePin,
  } = useStaffOperationalUpdates();

  if (loading) {
    return <OpUpdatesPageSkeleton />;
  }

  return (
    <div className="space-y-6 p-8">
      <OpUpdatesGreeting
        activeFilter={activeFilter}
        tabs={tabs}
        onFilterChange={setActiveFilter}
      />

      {broadcast ? <ManagementBroadcastBar broadcast={broadcast} /> : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <PostUpdateCard
            value={postText}
            activeCategory={activeCategory}
            isFlagged={isFlagged}
            authorInitial={authorInitial}
            vehicleOptions={vehicleOptions}
            memberOptions={memberOptions}
            selectedVehicleId={selectedVehicleId}
            selectedMemberId={selectedMemberId}
            linkedJobReference={linkedJobReference}
            optionsLoading={optionsLoading}
            posting={posting}
            onChange={setPostText}
            onCategoryChange={setActiveCategory}
            onToggleFlag={() => setIsFlagged((current) => !current)}
            onVehicleChange={setSelectedVehicleId}
            onMemberChange={setSelectedMemberId}
            onLinkedJobReferenceChange={setLinkedJobReference}
            onPost={() => void createUpdate()}
          />

          <ShiftUpdateFeed
            items={feedItems}
            loading={feedLoading}
            pinningId={pinningId}
            onTogglePin={(id, isPinned) => void togglePin(id, isPinned)}
          />
        </div>

        <div className="space-y-6">
          <PinnedNoticesPanel
            notices={pinnedNotices}
            pinningId={pinningId}
            onTogglePin={(id, isPinned) => void togglePin(id, isPinned)}
          />
          <ShiftLogPanel
            staffName={shiftLogStaffName}
            entries={shiftLogEntries}
            footerNote={shiftLogFooter}
          />
        </div>
      </div>
    </div>
  );
}
