import type { MemberDiaryData } from "./types";

export const memberDiaryMock: MemberDiaryData = {
  memberName: "Alex Mitchell",
  eyebrow: "YOUR JOURNEY",
  title: "Member Diary",
  recordEyebrow: "YOUR TOYBOX JOURNEY",
  recordTitlePrefix: "A RECORD OF YOUR",
  recordTitleHighlight: "MEMBERSHIP MOMENTS",
  recordSubtitle:
    "Every drive, dinner, and detail — automatically recorded for you to revisit and share.",
  stats: [
    { value: "23", label: "EVENTS" },
    { value: "47", label: "VEHICLE USES" },
    { value: "12", label: "DRIVES" },
    { value: "1,647", label: "MILES" },
  ],
  groups: [
    {
      id: "this-week",
      label: "THIS WEEK",
      countLabel: "5 ENTRIES",
      entries: [
        {
          id: "1",
          kind: "event",
          dateLabel: "SAT 26 APR",
          timeLabel: "19:00",
          titlePrefix: "AUCTION DAY —",
          titleHighlight: "YAS MARINA",
          description:
            "All heavy hitters showing up with 18 fellow members. The 1962 Ferrari 250 GTO stole the show late at the night, eventually settling at a hammer price that broke our weekly record.",
          tags: ["EVENT", "ACTIVE", "FEATURED"],
          imageUrl:
            "https://skinny-orange-qoimb3hb.edgeone.dev/c59acd119e9d748fd71d04d88315ec298c4df832.jpg",
        },
        {
          id: "2",
          kind: "service",
          dateLabel: "FRI 25 APR",
          timeLabel: "14:37",
          titlePrefix: "GHOST BLACK BADGE —",
          titleHighlight: "DETAILED & INSPECTED",
          description:
            "47 inspection points completed by Marco at the Clubhouse workshop. Brake fluid topped, climate calibrated to 21°C, exterior fully detailed.",
          tags: ["SERVICE", "GARAGE"],
        },
        {
          id: "3",
          kind: "event",
          dateLabel: "WED 23 APR",
          timeLabel: "19:00",
          titlePrefix: "CIGAR EVENING —",
          titleHighlight: "MEMBERS' LOUNGE",
          description:
            "A quiet evening with the Davidoff curation. Conversation with HRH Reza on the upcoming Concours d'Elegance and a brief encounter with the Director.",
          tags: ["LOUNGE", "SOCIAL"],
        },
        {
          id: "4",
          kind: "drive",
          dateLabel: "MON 21 APR",
          timeLabel: "06:00",
          titlePrefix: "DAWN DRIVE TO",
          titleHighlight: "HATTA",
          description:
            "147 miles round trip with the Continental GT. Group of twelve, exceptional sunrise at the Hajar mountains, breakfast at the lodge.",
          tags: ["DRIVE", "BENTLEY", "SHOW"],
        },
      ],
    },
    {
      id: "earlier-this-month",
      label: "EARLIER THIS MONTH",
      countLabel: "16 ENTRIES",
      entries: [
        {
          id: "5",
          kind: "dining",
          dateLabel: "WED 16 APR",
          timeLabel: "20:00",
          titlePrefix: "COLLECTORS' DINNER —",
          titleHighlight: "CLUBHOUSE",
          description:
            "A fine four-course tasting menu paired with rare Bordeaux. 23 members in attendance.",
          tags: ["DINING", "EXCLUSIVE"],
        },
        {
          id: "6",
          kind: "drive",
          dateLabel: "SUN 13 APR",
          timeLabel: "09:00",
          titlePrefix: "TRACK SESSION AT",
          titleHighlight: "YAS MARINA",
          description:
            "Eight laps in the Ferrari 296. Best lap 1:48.23 - competitive among the founding members.",
          tags: ["TRACK", "GARAGE"],
        },
      ],
    },
  ],
};
