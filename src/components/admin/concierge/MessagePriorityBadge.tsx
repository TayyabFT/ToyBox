import type { MessagePriorityTag } from "./types";

const tagClass: Record<MessagePriorityTag, string> = {
  urgent: "border-[#D98880]/25 bg-[#3D2424] text-[#D98880]",
  private: "border-[#C5A059]/25 bg-[#2A2418] text-[#C5A059]",
  high: "border-[#C5A059]/25 bg-[#2A2418] text-[#C5A059]",
  normal: "border-[#7DBFA0]/25 bg-[#162D24] text-[#7DBFA0]",
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
