import { ConciergeLoadChart } from "./ConciergeLoadChart";
import { EventAttendanceChart } from "./EventAttendanceChart";
import { VehicleUtilChart } from "./VehicleUtilChart";

export function AnalyticsInsightsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <EventAttendanceChart />
      <ConciergeLoadChart />
      <VehicleUtilChart />
    </div>
  );
}
