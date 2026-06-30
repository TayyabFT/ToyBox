import type { ReactNode } from "react";

export type CommunicationStatItem = {
  label: string;
  value: string;
  subtext: string;
  trend?: string;
  icon: ReactNode;
};

export type ComposeMode = "draft" | "bulletin" | "alert";

/** @deprecated Use ComposeMode for the compose toolbar selection. */
export type BulletinType = ComposeMode;

export type BulletinDraftPreview = {
  title: string;
  body: string;
  mode: ComposeMode;
};

export type AudienceSegment = {
  id: string;
  label: string;
  count: number;
};

export type RecentBulletin = {
  id: string;
  title: string;
  time: string;
  openRate: number | null;
  clickRate: number | null;
};
