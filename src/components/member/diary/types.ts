export type DiaryEntryKind =
  | "event"
  | "service"
  | "drive"
  | "dining"
  | "acquisition"
  | "reservation";

export type DiaryEntry = {
  id: string;
  kind: DiaryEntryKind;
  /** e.g. "SAT · 26 APR" */
  dateLabel: string;
  /** e.g. "19:00" */
  timeLabel?: string;
  titlePrefix: string;
  titleHighlight?: string;
  description: string;
  tags: string[];
  /** Optional hero image — renders the entry as a featured card. */
  imageUrl?: string;
  /** Small pill shown over the hero image. */
  imageTag?: string;
};

export type DiaryGroup = {
  id: string;
  label: string;
  countLabel?: string;
  entries: DiaryEntry[];
};

export type DiaryStat = {
  value: string;
  label: string;
};

export type MemberDiaryData = {
  memberName: string;
  eyebrow: string;
  title: string;
  recordEyebrow: string;
  recordTitlePrefix: string;
  recordTitleHighlight: string;
  recordSubtitle: string;
  stats: DiaryStat[];
  groups: DiaryGroup[];
};
