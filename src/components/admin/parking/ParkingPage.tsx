"use client";

import { useCallback, useEffect, useState } from "react";
import { AddSlotsModal } from "./add-slots";
import { ParkingSlotsSection } from "./parking-slots";
import { ParkingSessionsSection } from "./parking-sessions";
import { ParkingGreeting } from "./ParkingGreeting";
import { ParkingSlotsSummaryRow } from "./ParkingSlotsSummaryRow";

export function ParkingPage() {
  const [addSlotsOpen, setAddSlotsOpen] = useState(false);
  const [parkingRefreshToken, setParkingRefreshToken] = useState(0);
  const [sessionsReady, setSessionsReady] = useState(false);
  const [slotsReady, setSlotsReady] = useState(false);
  const [summaryReady, setSummaryReady] = useState(false);

  useEffect(() => {
    setSessionsReady(false);
    setSlotsReady(false);
    setSummaryReady(false);
  }, [parkingRefreshToken]);

  const handleSessionsReady = useCallback(() => {
    setSessionsReady(true);
  }, []);

  const handleSlotsReady = useCallback(() => {
    setSlotsReady(true);
  }, []);

  const handleSummaryReady = useCallback(() => {
    setSummaryReady(true);
  }, []);

  const pageReady = sessionsReady && slotsReady && summaryReady;

  return (
    <div className="space-y-8 p-8">
      <ParkingGreeting onAddSlots={() => setAddSlotsOpen(true)} />

      <ParkingSlotsSummaryRow
        refreshToken={parkingRefreshToken}
        holdReveal={!pageReady}
        onBootstrapComplete={handleSummaryReady}
      />

      <div className="space-y-8">
        <ParkingSessionsSection
          refreshToken={parkingRefreshToken}
          holdReveal={!pageReady}
          onBootstrapComplete={handleSessionsReady}
        />
        <ParkingSlotsSection
          refreshToken={parkingRefreshToken}
          showSummary={false}
          holdReveal={!pageReady}
          onBootstrapComplete={handleSlotsReady}
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
