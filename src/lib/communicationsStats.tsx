import {
  CommunicationsClickRateIcon,
  CommunicationsOpenRateIcon,
  DraftIcon,
  VehicleSend,
} from "@/components/common/Svgs";
import type { CommunicationStatItem } from "@/components/admin/communications/types";
import type { CommunicationsStatsData } from "@/types/api";

function formatCount(value: number | undefined | null): string {
  if (value == null) return "—";
  return String(value);
}

function formatPercent(value: number | string | undefined | null): string {
  if (value == null || value === "") return "—";
  const text = String(value).trim();
  if (!text) return "—";
  return text.endsWith("%") ? text : `${text}%`;
}

export function createPlaceholderCommunicationStats(): CommunicationStatItem[] {
  return [
    {
      label: "Sent · 30d",
      value: "—",
      subtext: "Bulletins",
      icon: <VehicleSend color="var(--primary)" className="size-4" />,
    },
    {
      label: "Open Rate",
      value: "—",
      subtext: "Vs Avg",
      icon: <CommunicationsOpenRateIcon className="size-4" />,
    },
    {
      label: "Click Rate",
      value: "—",
      subtext: "Strong",
      icon: <CommunicationsClickRateIcon className="size-4" />,
    },
    {
      label: "Drafts",
      value: "—",
      subtext: "Pending",
      icon: <DraftIcon className="size-4" color="var(--primary)" />,
    },
  ];
}

export function mapCommunicationsStats(
  stats: CommunicationsStatsData,
): CommunicationStatItem[] {
  return [
    {
      label: "Sent · 30d",
      value: formatCount(stats.sentBulletins),
      subtext: "Bulletins",
      icon: <VehicleSend color="var(--primary)" className="size-4" />,
    },
    {
      label: "Open Rate",
      value: formatPercent(stats.openRatePercent),
      subtext: "Vs Avg",
      icon: <CommunicationsOpenRateIcon className="size-4" />,
    },
    {
      label: "Click Rate",
      value: formatPercent(stats.clickRatePercent),
      subtext: "Strong",
      icon: <CommunicationsClickRateIcon className="size-4" />,
    },
    {
      label: "Drafts",
      value: formatCount(stats.draftCount),
      subtext: "Pending",
      icon: <DraftIcon className="size-4" color="var(--primary)" />,
    },
  ];
}
