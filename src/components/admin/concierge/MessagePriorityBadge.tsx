import type { MessagePriorityTag } from "./types";

const tagClass: Record<MessagePriorityTag, string> = {
  urgent: "border-pink/25 bg-pink/10 text-pink",
  private: "border-accent/25 bg-accent/10 text-accent",
  high: "border-accent/25 bg-accent/10 text-accent",
  normal: "border-teal/25 bg-teal/10 text-teal",
};

const labelMap: Record<MessagePriorityTag, string> = {
  urgent: "Urgent",
  private: "Private",
  high: "High",
  normal: "Normal",
};

type MessagePriorityBadgeProps = {
  tag: MessagePriorityTag;
};

export function MessagePriorityBadge({ tag }: MessagePriorityBadgeProps) {
  return (
    <span
      className={`font-roboto inline-flex rounded-full border px-2.5 py-0.5 text-[8px] font-semibold tracking-[0.08em] uppercase ${tagClass[tag]}`}
    >
      {labelMap[tag]}
    </span>
  );
}
