import {
  ActionCamera,
  ActionCheckbox,
  ActionMessage,
  AlertTriangle,
  Car,
  ChartBars,
  ClockSmall,
  DeliveryTruck,
  FileReport,
  Message,
  ShieldCheck,
  StatSunburst,
  Thermometer,
  Umbrella,
  UsersGroup,
} from "@/components/common/Svgs";
import type { OverviewIconResolver } from "./types";

export const resolveOverviewIcon: OverviewIconResolver = (iconKey) => {
  const normalized = iconKey.trim().toLowerCase();

  switch (normalized) {
    case "members":
    case "users":
      return <UsersGroup />;
    case "vehicles":
    case "car":
      return <Car />;
    case "open-requests":
    case "requests":
    case "sunburst":
      return <StatSunburst />;
    case "storage":
    case "occupancy":
    case "chart":
      return <ChartBars />;
    case "inspections":
    case "checkbox":
      return <ActionCheckbox />;
    case "photo-uploads":
    case "camera":
      return <ActionCamera />;
    case "concierge":
    case "message":
      return <ActionMessage />;
    case "bookings":
      return <ActionCheckbox />;
    case "clock":
      return <ClockSmall color="var(--pink)" />;
    case "transport":
    case "delivery":
      return <DeliveryTruck color="var(--pink)" />;
    case "detail":
    case "umbrella":
      return <Umbrella color="var(--accent)" />;
    case "health-report":
    case "report":
      return <FileReport color="var(--info)" />;
    case "shield":
      return <ShieldCheck color="var(--teal)" />;
    case "thermometer":
      return <Thermometer color="var(--pink)" />;
    case "chat":
      return <Message active />;
    case "alert":
    default:
      return <AlertTriangle color="var(--pink)" />;
  }
};
