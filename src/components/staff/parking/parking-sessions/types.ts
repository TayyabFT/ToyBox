export type ParkingSessionAction = "accept" | "start" | "complete";

export type ParkingSessionListItem = {
  id: string;
  reference: string;
  memberName: string;
  vehicleName: string;
  vehiclePlate: string;
  slotCode: string;
  slotZone: string;
  status: string;
  statusLabel: string;
  requestedAt: string;
  requestedTime: string;
  nextAction: ParkingSessionAction | null;
};

export type ParkingSessionDetail = {
  id: string;
  reference: string;
  memberName: string;
  vehicleName: string;
  vehiclePlate: string;
  slotCode: string;
  slotZone: string;
  slotLevel: string;
  status: string;
  statusLabel: string;
  requestedAt: string;
  requestedAtLabel: string;
  acceptedAtLabel: string;
  startedAtLabel: string;
  completedAtLabel: string;
  staffNotes: string;
  memberNotes: string;
  nextAction: ParkingSessionAction | null;
};

export type ParkingSessionsSummaryDisplay = {
  queue: { label: string; value: string; subtext: string };
  accepted: { label: string; value: string; subtext: string };
  active: { label: string; value: string; subtext: string };
  completed: { label: string; value: string; subtext: string };
};

export const PARKING_SESSION_ACTION_LABELS: Record<
  ParkingSessionAction,
  { title: string; submit: string; success: string }
> = {
  accept: {
    title: "Accept Request",
    submit: "Accept Request",
    success: "Parking request accepted",
  },
  start: {
    title: "Start Session",
    submit: "Start Parking",
    success: "Parking session started",
  },
  complete: {
    title: "Complete Session",
    submit: "Complete Parking",
    success: "Parking session completed",
  },
};
