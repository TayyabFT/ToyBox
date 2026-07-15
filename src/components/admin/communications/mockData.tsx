import {
  CommunicationsClickRateIcon,
  CommunicationsOpenRateIcon,
  DraftIcon,
  VehicleSend,
} from "@/components/common/Svgs";
import type {
  AudienceSegment,
  CommunicationStatItem,
  RecentBulletin,
} from "./types";

export const communicationStats: CommunicationStatItem[] = [
  {
    label: "Sent · 30d",
    value: "24",
    subtext: "Bulletins",
    icon: <VehicleSend color="var(--accent)" className="size-4" />,
  },
  {
    label: "Open Rate",
    value: "87%",
    subtext: "Vs Avg",
    trend: "+4%",
    icon: <CommunicationsOpenRateIcon className="size-4" />,
  },
  {
    label: "Click Rate",
    value: "42%",
    subtext: "Strong",
    icon: <CommunicationsClickRateIcon className="size-4" />,
  },
  {
    label: "Drafts",
    value: "2",
    subtext: "Pending",
    icon: <DraftIcon className="size-4" color="var(--accent)" />,
  },
];

export const TOTAL_AUDIENCE = 142;

export const audienceSegments: AudienceSegment[] = [
  { id: "all", label: "All Members", count: 142 },
  { id: "vip", label: "VIP", count: 23 },
  { id: "concours-eligible", label: "Concours-Eligible", count: 87 },
  { id: "new-30d", label: "New (30d)", count: 8 },
];

export const composeDefaults = {
  title: "Concours d'Élégance — invitations open",
  body: "We are pleased to announce that invitations for our annual Concours d'Élégance are now open. The event will take place on Saturday 23 May at our private grounds, with judging across five classic categories and a curated awards dinner.\n\nThis is an invitation-only event. Members wishing to enter their motor cars for consideration are encouraged to contact the Concierge by Friday 15 May.",
};

export const recentBulletins: RecentBulletin[] = [
  {
    id: "auction-day",
    title: "Auction Day · Final Details",
    time: "2h ago",
    openRate: 89,
    clickRate: 54,
    isDraft: false,
  },
  {
    id: "dawn-drive",
    title: "Dawn Drive · Weather Update",
    time: "Yesterday",
    openRate: 92,
    clickRate: 61,
    isDraft: false,
  },
  {
    id: "may-calendar",
    title: "May Calendar — New Events",
    time: "4d ago",
    openRate: 87,
    clickRate: 38,
    isDraft: false,
  },
  {
    id: "workshop-maintenance",
    title: "Workshop Maintenance Window",
    time: "1w ago",
    openRate: 78,
    clickRate: 22,
    isDraft: false,
  },
];
