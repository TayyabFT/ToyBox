import type {
  ConciergeAlert,
  ConciergeChatMessage,
  ConciergeInboxMessage,
  ConciergeOpenRequest,
  ConciergeRequestDetail,
} from "./types";

export const conciergeAlert: ConciergeAlert = {
  highlight: "VIP Arrival — Khalid Al Mansoori · 14:30 today",
  detail:
    "Porsche 911 GT3 prep + suite setup + refreshments required · 3h 16m to arrival",
  timeLabel: "3h 16m",
};

export const openRequests: ConciergeOpenRequest[] = [
  {
    id: "req-1",
    title: "VIP Arrival Prep",
    member: "Khalid Al Mansoori",
    tier: "Founding",
    timeLabel: "3h 16m",
    status: "urgent",
    icon: "car",
    filterTags: ["all", "urgent", "my-requests"],
  },
  {
    id: "req-2",
    title: "Vehicle Sourcing — Ferrari F40",
    member: "Nora Assenmio",
    tier: "TB-004",
    timeLabel: "Yesterday",
    status: "review",
    icon: "camera",
    filterTags: ["all", "my-requests"],
  },
  {
    id: "req-3",
    title: "Detailing — Porsche 911 GT3",
    member: "Khalid Al Mansoori",
    tier: "Founding",
    timeLabel: "14:30",
    status: "active",
    icon: "car",
    filterTags: ["all", "my-requests"],
  },
  {
    id: "req-4",
    title: "Maintenance — Battery Repl.",
    member: "Alex Mitchell",
    tier: "TB-018",
    timeLabel: "Pending",
    status: "pending",
    icon: "gear",
    filterTags: ["all", "my-requests"],
  },
  {
    id: "req-5",
    title: "Transport — Bentley to DIFC",
    member: "Sofia Reyes",
    tier: "TB-011",
    timeLabel: "07:15",
    status: "done",
    icon: "check",
    filterTags: ["all", "resolved"],
  },
];

export const requestDetails: Record<string, ConciergeRequestDetail> = {
  "req-1": {
    id: "req-1",
    memberName: "Khalid Al Mansoori",
    memberInitial: "K",
    memberStatus: "Online",
    memberTier: "Founding",
    memberId: "TB-003",
    conciergeLead: "James Alderton",
    checklist: [
      {
        id: "c1",
        label: "Porsche 911 GT3 — Pre-inspection done",
        completed: true,
      },
      {
        id: "c2",
        label: "Bay A-02 cleared and cleaned",
        completed: true,
      },
      {
        id: "c3",
        label: "Ferrari SF90 — position at entrance",
        completed: false,
      },
      {
        id: "c4",
        label: "Lounge suite — refreshments setup",
        completed: false,
      },
      {
        id: "c5",
        label: "Guest parking — Bays A-04 reserved",
        completed: false,
      },
      {
        id: "c6",
        label: "Member confirmed ETA via concierge",
        completed: false,
      },
    ],
    logistics: [
      { label: "Arrival Time", value: "14:30", highlight: true },
      { label: "Vehicles Ready", value: "GT3 + SF90 → Entrance A" },
      { label: "Hospitality", value: "Sparkling water + dates · Suite 3" },
      { label: "Concierge Lead", value: "James Alderton" },
    ],
    chatTitle: "James Alderton",
    chatOnline: true,
    chatMessages: [
      {
        id: "m1",
        sender: "staff",
        senderName: "James",
        time: "09:10",
        message:
          "Good morning Khalid — your GT3 and SF90 are being prepped now. Bay A-02 is ready.",
      },
      {
        id: "m2",
        sender: "member",
        senderName: "Member",
        time: "09:22",
        message:
          "Perfect. I'll arrive at 14:30. Please have the SF90 at the entrance.",
      },
      {
        id: "m3",
        sender: "staff",
        senderName: "James",
        time: "09:24",
        message:
          "Confirmed. Suite 3 will have refreshments ready. I'll send a reminder at 13:30.",
      },
    ],
  },
  "req-2": {
    id: "req-2",
    memberName: "Nora Assenmio",
    memberInitial: "N",
    memberStatus: "Online",
    memberTier: "TB-004",
    memberId: "TB-004",
    conciergeLead: "James Alderton",
    checklist: [
      { id: "c1", label: "Source Ferrari F40 options", completed: true },
      { id: "c2", label: "Member review scheduled", completed: false },
    ],
    logistics: [
      { label: "Request Type", value: "Vehicle Sourcing" },
      { label: "Target Model", value: "Ferrari F40" },
      { label: "Status", value: "Awaiting Review", highlight: true },
      { label: "Concierge Lead", value: "James Alderton" },
    ],
    chatTitle: "James Alderton",
    chatOnline: true,
    chatMessages: [],
  },
  "req-3": {
    id: "req-3",
    memberName: "Khalid Al Mansoori",
    memberInitial: "K",
    memberStatus: "Online",
    memberTier: "Founding",
    memberId: "TB-003",
    conciergeLead: "James Alderton",
    checklist: [
      { id: "c1", label: "Exterior detail — in progress", completed: false },
      { id: "c2", label: "Interior vacuum and leather care", completed: false },
    ],
    logistics: [
      { label: "Service Time", value: "14:30", highlight: true },
      { label: "Vehicle", value: "Porsche 911 GT3" },
      { label: "Bay", value: "Bay A-02" },
      { label: "Concierge Lead", value: "James Alderton" },
    ],
    chatTitle: "James Alderton",
    chatOnline: true,
    chatMessages: [],
  },
  "req-4": {
    id: "req-4",
    memberName: "Alex Mitchell",
    memberInitial: "A",
    memberStatus: "Away",
    memberTier: "TB-018",
    memberId: "TB-018",
    conciergeLead: "James Alderton",
    checklist: [
      {
        id: "c1",
        label: "Battery replacement — parts ordered",
        completed: false,
      },
    ],
    logistics: [
      { label: "Service", value: "Battery Replacement" },
      { label: "Status", value: "Pending Parts" },
      { label: "Vehicle", value: "Bentley Continental GT" },
      { label: "Concierge Lead", value: "James Alderton" },
    ],
    chatTitle: "James Alderton",
    chatOnline: false,
    chatMessages: [],
  },
  "req-5": {
    id: "req-5",
    memberName: "Sofia Reyes",
    memberInitial: "S",
    memberStatus: "Offline",
    memberTier: "TB-011",
    memberId: "TB-011",
    conciergeLead: "James Alderton",
    checklist: [
      { id: "c1", label: "Transport to DIFC completed", completed: true },
    ],
    logistics: [
      { label: "Completed At", value: "07:15", highlight: true },
      { label: "Vehicle", value: "Bentley to DIFC" },
      { label: "Driver", value: "Alex Mitchell" },
      { label: "Concierge Lead", value: "James Alderton" },
    ],
    chatTitle: "James Alderton",
    chatOnline: false,
    chatMessages: [],
  },
};

export const defaultRequestDetail = requestDetails["req-1"]!;

export const inboxMessages: ConciergeInboxMessage[] = [
  {
    id: "msg-1",
    memberName: "Mr. Al Mansoori",
    memberInitial: "M",
    preview:
      "Please ensure Suite 02 is fully prepared for my arrival at 14:30. I'll have a guest joining.",
    timeLabel: "12m",
    tags: ["urgent", "private"],
    unread: true,
    apiMemberId: "1",
  },
  {
    id: "msg-2",
    memberName: "Mr. Reza Khalili",
    memberInitial: "R",
    preview:
      "Have you located the 1973 911 RS Carrera I asked about? Budget remains flexible.",
    timeLabel: "8m",
    tags: ["urgent"],
    unread: true,
    apiMemberId: "2",
  },
  {
    id: "msg-3",
    memberName: "Mrs. Khoury",
    memberInitial: "K",
    preview:
      "The Maybach pickup time of 18:00 conflicts with my dinner. Can we reschedule?",
    timeLabel: "5m",
    tags: ["urgent"],
    unread: true,
    apiMemberId: "3",
  },
  {
    id: "msg-4",
    memberName: "Alex Mitchell",
    memberInitial: "A",
    preview: "Could you have the Ghost at the forecourt for 10:15?",
    timeLabel: "2m",
    tags: ["high"],
    unread: true,
    apiMemberId: "4",
  },
  {
    id: "msg-5",
    memberName: "Mr. Tan Wei",
    memberInitial: "T",
    preview:
      "Interested in entering my Bugatti for the Concours d'Élégance — what's the process?",
    timeLabel: "23m",
    tags: ["high"],
    unread: false,
    apiMemberId: "5",
  },
  {
    id: "msg-6",
    memberName: "Mr. Bashir",
    memberInitial: "B",
    preview:
      "Q2 statement received. Could you clarify the workshop line items?",
    timeLabel: "1h 4m",
    tags: ["normal"],
    unread: false,
    apiMemberId: "6",
  },
];

export type MessageChatDetail = {
  chatTitle: string;
  chatOnline: boolean;
  chatMessages: ConciergeChatMessage[];
  sessionLabel?: string;
};

export const messageDetails: Record<string, MessageChatDetail> = {
  "msg-1": {
    chatTitle: "Mr. Al Mansoori",
    chatOnline: true,
    sessionLabel: "TODAY · 09:30",
    chatMessages: [
      {
        id: "m1",
        sender: "member",
        senderName: "Al Mansoori",
        time: "09:30",
        message:
          "Please ensure Suite 02 is fully prepared for my arrival at 14:30. I'll have a guest joining for the evening.",
        highlights: ["14:30"],
      },
      {
        id: "m2",
        sender: "member",
        senderName: "Al Mansoori",
        time: "09:32",
        message:
          "Also — has the Pagani returned from Goodwood? I'd like to drive it tomorrow.",
      },
      {
        id: "m3",
        sender: "staff",
        senderName: "James",
        time: "09:40",
        message:
          "Good morning, Mr. Al Mansoori. I'll prepare Suite 02 immediately and confirm everything by 13:00. Regarding the Pagani — it's still in the UK, expected back 14 May.",
        read: true,
      },
      {
        id: "m4",
        sender: "member",
        senderName: "Al Mansoori",
        time: "09:41",
        message:
          "Thank you, James. For the guest tonight — please ensure the second key fob is available.",
      },
    ],
  },
  "msg-2": {
    chatTitle: "Mr. Reza Khalili",
    chatOnline: true,
    chatMessages: [
      {
        id: "m1",
        sender: "member",
        senderName: "Member",
        time: "08:52",
        message:
          "Have you located the 1973 911 RS Carrera I asked about? Budget remains flexible.",
      },
    ],
  },
  "msg-3": {
    chatTitle: "Mrs. Khoury",
    chatOnline: true,
    chatMessages: [
      {
        id: "m1",
        sender: "member",
        senderName: "Member",
        time: "08:55",
        message:
          "The Maybach pickup time of 18:00 conflicts with my dinner. Can we reschedule?",
      },
    ],
  },
  "msg-4": {
    chatTitle: "Alex Mitchell",
    chatOnline: false,
    chatMessages: [
      {
        id: "m1",
        sender: "member",
        senderName: "Member",
        time: "08:58",
        message: "Could you have the Ghost at the forecourt for 10:15?",
      },
    ],
  },
  "msg-5": {
    chatTitle: "Mr. Tan Wei",
    chatOnline: false,
    chatMessages: [
      {
        id: "m1",
        sender: "member",
        senderName: "Member",
        time: "08:37",
        message:
          "Interested in entering my Bugatti for the Concours d'Élégance — what's the process?",
      },
    ],
  },
  "msg-6": {
    chatTitle: "Mr. Bashir",
    chatOnline: false,
    chatMessages: [
      {
        id: "m1",
        sender: "member",
        senderName: "Member",
        time: "07:56",
        message:
          "Q2 statement received. Could you clarify the workshop line items?",
      },
    ],
  },
};
