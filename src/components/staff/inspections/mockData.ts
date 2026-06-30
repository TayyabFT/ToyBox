import type {
  ActiveInspection,
  InspectionQueueItem,
  InspectionStats,
} from "./types";

export const inspectionStats: InspectionStats = {
  dueToday: { value: "4", subtext: "Inspections Pending" },
  inProgress: { value: "1", subtext: "Active Now" },
  completed: { value: "7", subtext: "This Shift" },
  flagged: { value: "2", subtext: "Needs Review" },
};

export const inspectionQueue: InspectionQueueItem[] = [
  {
    id: "ins-0441",
    vehicle: "Porsche 911 GT3",
    serviceType: "Annual Service",
    bay: "Bay A-02",
    assignee: "Al-Rashidi",
    time: "09:30",
    status: "in-progress",
  },
  {
    id: "ins-0442",
    vehicle: "Mercedes-AMG GT",
    serviceType: "Pre-Service",
    bay: "Bay B-05",
    assignee: "Kathrine",
    time: "10:15",
    status: "pending",
  },
  {
    id: "ins-0443",
    vehicle: "Ferrari 488",
    serviceType: "Annual Service",
    bay: "Bay C-01",
    assignee: "Marcus",
    time: "08:45",
    status: "overdue",
  },
  {
    id: "ins-0440",
    vehicle: "Aston Martin DBS",
    serviceType: "Handover",
    bay: "Bay D-03",
    assignee: "Sarah",
    time: "07:30",
    status: "done",
  },
];

export const activeInspection: ActiveInspection = {
  reference: "INS-0441",
  vehicle: "Porsche 911 GT3",
  bay: "A-02",
  mileage: "28,890 km",
  inspectionType: "Pre-Service",
  steps: [
    { id: "exterior", label: "Exterior", state: "complete" },
    { id: "interior", label: "Interior", state: "active" },
    { id: "mechanical", label: "Mechanical", state: "upcoming" },
    { id: "tyres", label: "Tyres", state: "upcoming" },
  ],
  activeStepId: "interior",
  checklist: [
    { id: "1", label: "Dashboard warning lights", state: "ok" },
    { id: "2", label: "Seat condition & adjustment", state: "ok" },
    { id: "3", label: "Interior light — rear-left out", state: "issue" },
    { id: "4", label: "Cabin odour check", state: "ok" },
    { id: "5", label: "Infotainment screen", state: "pending" },
    { id: "6", label: "Steering wheel wear", state: "ok" },
    { id: "7", label: "Carpet & mat condition", state: "ok" },
    { id: "8", label: "Door card trim", state: "pending" },
  ],
  flaggedIssue: {
    tag: "Rear-Left Interior Light",
    notes:
      "Rear-left interior dome light not illuminating. Bulb appears intact — possible wiring fault. Flagged for electrical review before handover.",
  },
  odometer: "28,890",
  fuelLevel: "3/4 Tank",
};
