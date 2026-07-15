import type { RecentBulletin } from "@/components/admin/communications/types";
import type { CommunicationsBulletinRaw } from "@/types/api";

function formatBulletinListTime(iso: string | undefined): string {
  if (!iso) return "—";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return "Now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks}w ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function parseRatePercent(value: number | string | undefined | null): number | null {
  if (value == null || value === "") return null;

  const numeric =
    typeof value === "number"
      ? value
      : Number.parseFloat(String(value).replace("%", ""));

  return Number.isFinite(numeric) ? numeric : null;
}

function resolveBulletinTimestamp(bulletin: CommunicationsBulletinRaw): string {
  if (bulletin.sentAt) return bulletin.sentAt;
  if (bulletin.updatedAt) return bulletin.updatedAt;
  return bulletin.createdAt ?? "";
}

export function mapCommunicationsBulletins(
  items: CommunicationsBulletinRaw[] | undefined,
): RecentBulletin[] {
  if (!items?.length) return [];

  return items.map((bulletin, index) => ({
    id: bulletin.id ?? `bulletin-${index}`,
    title: bulletin.title?.trim() || "Untitled bulletin",
    time: formatBulletinListTime(resolveBulletinTimestamp(bulletin)),
    openRate: parseRatePercent(bulletin.openRatePercent),
    clickRate: parseRatePercent(bulletin.clickRatePercent),
    isDraft: bulletin.status?.trim().toLowerCase() === "draft",
  }));
}
