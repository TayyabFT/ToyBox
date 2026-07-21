import type {
  ActiveJobDetail,
  DetailingJob,
  MaintenanceJob,
  SectionMeta,
  ServiceRequestStat,
  TransportJob,
} from "./types";

export const serviceRequestStats: ServiceRequestStat[] = [
  {
    label: "Assigned",
    value: "0",
    subtext: "Awaiting your action",
    icon: "urgent",
  },
  {
    label: "Sign-Off Queue",
    value: "0",
    subtext: "Manager review",
    icon: "transport",
  },
  {
    label: "Completed Today",
    value: "0",
    subtext: "Confirmed done",
    icon: "completed",
  },
  {
    label: "Shift Progress",
    value: "0%",
    subtext: "On track",
    icon: "in-progress",
  },
];

export const transportSectionMeta: SectionMeta = {
  title: "Transport & Delivery",
  requestCount: 4,
  highlightLabel: "1 urgent",
};

export const maintenanceSectionMeta: SectionMeta = {
  title: "Maintenance & Service",
  requestCount: 5,
  highlightLabel: "1 overdue",
};

export const detailingSectionMeta: SectionMeta = {
  title: "Detailing & Wash",
  requestCount: 5,
  highlightLabel: "2 in progress",
};

export const transportJobs: TransportJob[] = [
  {
    id: "t1",
    title: "Transport — Ferrari SF90",
    jobId: "JOB-T0029",
    member: "Alex Mitchell",
    vehicle: "Ferrari SF90",
    tier: "Founding",
    status: "urgent",
    statusLabel: "Urgent",
    from: "Bay C-09 — Storage",
    to: "DIFC — Gate 3",
    scheduled: "14:30 Today",
    isUrgent: true,
    category: "transport",
  },
  {
    id: "t2",
    title: "Return to Storage — Lamborghini Huracán",
    jobId: "JOB-T0027",
    member: "Nora Assemmi",
    vehicle: "Lamborghini Huracán",
    status: "assigned",
    statusLabel: "Assigned",
    from: "Yas Marina",
    to: "Bay C-12 — Storage",
    scheduled: "16:00 Today",
    assignee: "Khalid M.",
    category: "transport",
  },
];

export const maintenanceJobs: MaintenanceJob[] = [
  {
    id: "m1",
    title: "Annual Service — Ferrari 296 GTS",
    jobId: "JOB-M0441",
    member: "Khalid Al Mansoori",
    vehicle: "Ferrari 296 GTS",
    status: "overdue",
    statusLabel: "12 Days Overdue",
    serviceType: "Annual / Scheduled",
    centre: "Official Ferrari",
    estimatedCost: "AED 8,200",
    isOverdue: true,
    category: "maintenance",
  },
  {
    id: "m2",
    title: "Annual Service — Porsche 911 GT3",
    jobId: "JOB-M0444",
    member: "Alex Mitchell",
    vehicle: "Porsche 911 GT3",
    status: "in-progress",
    statusLabel: "In Progress",
    serviceType: "Official Porsche Centre",
    centre: "Official Porsche Centre",
    estimatedCost: "AED 4,500",
    startedAt: "07:00 Today",
    estimatedDone: "13:00 Today",
    progress: 50,
    workshop: "Ahmed Hassan — Workshop",
    progressNote: "Est. 12:26 done",
    category: "maintenance",
  },
];

export const detailingJobs: DetailingJob[] = [
  {
    id: "d1",
    title: "Full Detail + Ceramic Coat",
    jobId: "JOB-D0118",
    member: "Sara Al Hashimi",
    vehicle: "Bentley Continental GT",
    status: "in-progress",
    statusLabel: "In Progress",
    type: "Full Detail",
    addOn: "Ceramic Coat",
    estimate: "AED 2,050",
    progress: 60,
    progressNote: "60% done",
    category: "detailing",
  },
  {
    id: "d2",
    title: "Exterior Wash + Interior Clean",
    jobId: "JOB-D0119",
    member: "Alex Mitchell",
    vehicle: "Rolls Royce Spectre",
    status: "pending",
    statusLabel: "Pending",
    type: "Wash + Interior",
    estimate: "AED 850",
    scheduled: "12:00 Today",
    bay: "D-08",
    category: "detailing",
  },
];

export const activeJobDetail: ActiveJobDetail = {
  jobId: "JOB-T0027",
  categoryLabel: "Transport Job · In Progress",
  statusLabel: "Active",
  statusTone: "active",
  vehicle: "Lamborghini Huracán STO",
  subtitle: "Return to Storage · Nora Alsuwaidi · Bay C-12",
  assignee: "Khalid M.",
  pickup: {
    label: "Pickup",
    detail: "Yas Marina Circuit · Gate 8 — VIP Bay 4",
  },
  dropoff: {
    label: "Dropoff",
    detail: "Toybox Storage · Bay C-12 — Ready",
  },
  steps: [
    {
      id: "s1",
      label: "Confirm vehicle collection with member",
      completed: true,
      time: "16:05",
    },
    {
      id: "s2",
      label: "Pre-departure walkaround inspection",
      completed: true,
      time: "16:11",
    },
    {
      id: "s3",
      label: "Drive to storage facility",
      completed: false,
    },
    {
      id: "s4",
      label: "Bay C-12 check-in + photo documentation",
      completed: false,
    },
    {
      id: "s5",
      label: "Log completion in system",
      completed: false,
    },
  ],
  specialInstructions:
    "Please warm up the car before arrival. Do not exceed 60 km/h. Park facing out.",
};
