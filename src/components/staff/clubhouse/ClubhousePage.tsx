import { ClubhouseGreeting } from "./ClubhouseGreeting";
import { ClubhouseReservationsPanel } from "./ClubhouseReservationsPanel";
import { clubhouseReservationsSummary } from "./mockData";

export function ClubhousePage() {
  return (
    <div className="space-y-6 p-8">
      <ClubhouseGreeting />
      <ClubhouseReservationsPanel summary={clubhouseReservationsSummary} />
    </div>
  );
}
