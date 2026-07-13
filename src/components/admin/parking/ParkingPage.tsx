"use client";

import { useState } from "react";
import { AddSlotsModal } from "./add-slots";
import { ParkingSlotsSection } from "./parking-slots";
import { ParkingSessionsSection } from "./parking-sessions";
import { ParkingGreeting } from "./ParkingGreeting";
import { ParkingSlotsSummaryRow } from "./ParkingSlotsSummaryRow";

export function ParkingPage() {
  const [addSlotsOpen, setAddSlotsOpen] = useState(false);
  const [parkingRefreshToken, setParkingRefreshToken] = useState(0);

  return (
    <div className="space-y-8 p-8">
      <ParkingGreeting onAddSlots={() => setAddSlotsOpen(true)} />

      <ParkingSlotsSummaryRow refreshToken={parkingRefreshToken} />

      <div className="space-y-8">
        <ParkingSessionsSection refreshToken={parkingRefreshToken} />
        <ParkingSlotsSection
          refreshToken={parkingRefreshToken}
          showSummary={false}
        />
      </div>

      <AddSlotsModal
        open={addSlotsOpen}
        onClose={() => setAddSlotsOpen(false)}
        onSuccess={() => setParkingRefreshToken((current) => current + 1)}
      />
    </div>
  );
}
