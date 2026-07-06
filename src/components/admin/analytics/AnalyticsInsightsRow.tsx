import { ConciergeLoadChart } from "./ConciergeLoadChart";
import { EventAttendanceChart } from "./EventAttendanceChart";
import type {
  ConciergeLoadChartData,
  EventAttendanceChartData,
  VehicleUtilChartData,
} from "./types";
import { VehicleUtilChart } from "./VehicleUtilChart";

type AnalyticsInsightsRowProps = {
  eventAttendance: EventAttendanceChartData;
  conciergeLoad: ConciergeLoadChartData;
  vehicleUtil: VehicleUtilChartData;
  status?: "loading" | "error";
};

export function AnalyticsInsightsRow({
  eventAttendance,
  conciergeLoad,
  vehicleUtil,
  status,
}: AnalyticsInsightsRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <EventAttendanceChart data={eventAttendance} status={status} />
      <ConciergeLoadChart data={conciergeLoad} status={status} />
      <VehicleUtilChart data={vehicleUtil} status={status} />
    </div>
  );
}
