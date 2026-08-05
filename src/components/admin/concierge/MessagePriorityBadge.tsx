// MessagePriorityBadge — delegates to the central Chip component.

import { Chip } from "@/components/ui/Chip";
import type { ChipTone } from "@/components/ui/Chip";
import type { MessagePriorityTag } from "./types";

const TONE_MAP: Record<MessagePriorityTag, ChipTone> = {
  urgent:  "pink",
  private: "gold",
  high:    "gold",
  normal:  "teal",
};

const LABEL_MAP: Record<MessagePriorityTag, string> = {
  urgent:  "Urgent",
  private: "Private",
  high:    "High",
  normal:  "Normal",
};

type MessagePriorityBadgeProps = {
  tag: MessagePriorityTag;
};

export function MessagePriorityBadge({ tag }: MessagePriorityBadgeProps) {
  return (
    <Chip
      label={LABEL_MAP[tag]}
      context="inline"
      tone={TONE_MAP[tag]}
      shape="pill"
    />
  );
}
