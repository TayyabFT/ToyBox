import type { AudienceSegment } from "@/components/admin/communications/types";
import type { CommunicationsAudiencePreviewData } from "@/types/api";

const AUDIENCE_SEGMENT_DEFINITIONS = [
  { id: "all", label: "All Members", apiKey: "ALL_MEMBERS" },
  { id: "vip", label: "VIP", apiKey: "VIP" },
  { id: "concours-eligible", label: "Concours-Eligible", apiKey: "CONCOURS_ELIGIBLE" },
  { id: "new-30d", label: "New (30d)", apiKey: "NEW" },
] as const;

export function mapAudienceIdsToApiKeys(ids: string[]): string[] {
  return ids.flatMap((id) => {
    const match = AUDIENCE_SEGMENT_DEFINITIONS.find((segment) => segment.id === id);
    return match ? [match.apiKey] : [];
  });
}

export function createPlaceholderAudienceSegments(): AudienceSegment[] {
  return AUDIENCE_SEGMENT_DEFINITIONS.map(({ id, label }) => ({
    id,
    label,
    count: 0,
  }));
}

export function mapAudiencePreview(
  data: CommunicationsAudiencePreviewData,
): AudienceSegment[] {
  return AUDIENCE_SEGMENT_DEFINITIONS.map(({ id, label, apiKey }) => ({
    id,
    label,
    count: data[apiKey] ?? 0,
  }));
}

export function getAudienceReachCount(
  segments: AudienceSegment[],
  activeAudienceIds: string[],
): number {
  if (activeAudienceIds.length === 0) return 0;

  if (activeAudienceIds.includes("all")) {
    return segments.find((segment) => segment.id === "all")?.count ?? 0;
  }

  return activeAudienceIds.reduce((total, id) => {
    const segment = segments.find((item) => item.id === id);
    return total + (segment?.count ?? 0);
  }, 0);
}
