import type { ComposeMode } from "@/components/admin/communications/types";
import type {
  BulletinAudienceSegment,
  BulletinChannel,
  CreateBulletinRequest,
} from "@/types/api";
import { mapAudienceIdsToApiKeys } from "./communicationsAudience";

const BULLETIN_CHANNELS: BulletinChannel[] = ["app", "email", "push"];

export function buildCreateBulletinPayload(params: {
  title: string;
  body: string;
  mode: ComposeMode;
  audienceSegmentIds: string[];
  channels: string[];
}): CreateBulletinRequest {
  const status = params.mode === "draft" ? "draft" : "sent";
  const type = params.mode === "alert" ? "alert" : "bulletin";
  const audienceSegments = mapAudienceIdsToApiKeys(
    params.audienceSegmentIds,
  ) as BulletinAudienceSegment[];
  const channels = params.channels.filter((channel): channel is BulletinChannel =>
    BULLETIN_CHANNELS.includes(channel as BulletinChannel),
  );

  return {
    title: params.title.trim(),
    body: params.body.trim(),
    type,
    status,
    category: "news",
    isPinned: false,
    audienceSegments,
    channels,
    ...(status === "sent" ? { scheduledAt: new Date().toISOString() } : {}),
  };
}

export function validateCreateBulletinForm(params: {
  title: string;
  body: string;
  audienceSegmentIds: string[];
  channels: string[];
}): string | null {
  if (!params.title.trim()) return "Title is required.";
  if (!params.body.trim()) return "Body is required.";
  if (params.audienceSegmentIds.length === 0) {
    return "Select at least one audience segment.";
  }
  if (params.channels.length === 0) {
    return "Select at least one channel.";
  }
  return null;
}
