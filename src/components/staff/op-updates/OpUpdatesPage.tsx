"use client";

import { ManagementBroadcastBar } from "./ManagementBroadcastBar";
import { OpUpdatesGreeting } from "./OpUpdatesGreeting";
import { PinnedNoticesPanel } from "./PinnedNoticesPanel";
import { PostUpdateCard } from "./PostUpdateCard";
import { ShiftLogPanel } from "./ShiftLogPanel";
import { ShiftUpdateFeed } from "./ShiftUpdateFeed";
import { useStaffOperationalUpdates } from "./useStaffOperationalUpdates";

export function OpUpdatesPage() {
  const {
    header,
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
    return (
      <div className="p-8">
        <p className="font-roboto py-16 text-center text-sm text-secondary">
          Loading operational updates...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <OpUpdatesGreeting
        header={header}
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
