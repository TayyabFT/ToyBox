import type {
  RecentUpload,
  SelectedPhoto,
  TodayCapture,
} from "./types";

export const todayCaptures: TodayCapture[] = [
  {
    id: "cap-1",
    label: "Exterior Front",
    time: "07:45",
    status: "uploaded",
  },
  {
    id: "cap-2",
    label: "Interior Back",
    time: "07:44",
    status: "uploaded",
  },
  {
    id: "cap-3",
    label: "Issue Flag",
    time: "Interior dome light issue",
    status: "flagged",
  },
  {
    id: "cap-4",
    label: "Dashboard",
    time: "07:43",
    status: "uploaded",
  },
  {
    id: "cap-5",
    label: "Rear View",
    time: "Pending upload",
    status: "pending",
  },
  {
    id: "cap-6",
    label: "Tyres",
    time: "Pending upload",
    status: "pending",
  },
];

export const selectedPhoto: SelectedPhoto = {
  id: "cap-3",
  reference: "INS-0441 · Bay A-02",
  index: "Photo 03",
  title: "Interior Light — Issue",
  status: "flagged",
  time: "09:22 · 17 May",
  size: "3.8 MB · JPG",
  fileId: "INS-0441",
  categoryTags: ["Interior", "Pre-Service", "Flagged"],
  caption:
    "Rear-left interior dome light non-functional. Possible blown bulb. Flagged for workshop team.",
};

export const recentUploads: RecentUpload[] = [
  {
    id: "up-1",
    title: "Porsche 911 GT3 — Dashboard",
    meta: "INS-0441 · 09:24 · 3.2 MB",
    state: "synced",
  },
  {
    id: "up-2",
    title: "Porsche 911 GT3 — Driver Side",
    meta: "INS-0441 · 09:23 · 4.1 MB",
    state: "synced",
  },
  {
    id: "up-3",
    title: "Porsche 911 GT3 — Interior Light Issue",
    meta: "INS-0441 · 09:22 · 3.8 MB",
    state: "flagged",
  },
  {
    id: "up-4",
    title: "McLaren 720S — Storage Check-in",
    meta: "INS-0439 · 08:51 · 2.9 MB",
    state: "pending",
  },
  {
    id: "up-5",
    title: "Bentley Continental GT — Detail Sign-off",
    meta: "DET-0212 · 08:14 · 5.2 MB",
    state: "approved",
  },
];
