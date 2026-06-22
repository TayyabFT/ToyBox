import { MessagePriorityBadge } from "./MessagePriorityBadge";
import type { ConciergeInboxMessage } from "./types";

type MessageInboxRowProps = {
  message: ConciergeInboxMessage;
  selected?: boolean;
  onSelect?: () => void;
};

export function MessageInboxRow({
  message,
  selected = false,
  onSelect,
}: MessageInboxRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full cursor-pointer gap-3.5 border-b border-[#1E1A14] px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-[#16140F]/50 ${
        selected
          ? "border-l-2 border-l-[#C5A059] bg-[#16140F]/70 pl-[18px]"
          : "border-l-2 border-l-transparent"
      }`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#F0C566] to-[#8B6F2A] font-roboto text-[14px] font-semibold text-[#0A0806] uppercase">
        {message.memberInitial}
      </span>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <p className="font-roboto truncate text-[13px] font-semibold tracking-[0.04em] text-[#F2EAD5] uppercase">
            {message.memberName}
          </p>
          <span className="shrink-0 font-roboto text-[11px] tracking-[0.04em] text-[#D98880]">
            {message.timeLabel}
          </span>
        </div>

        <p className="font-roboto text-[12px] leading-relaxed tracking-[0.02em] text-[#8A8378]">
          &ldquo;{message.preview}&rdquo;
        </p>

        {message.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {message.tags.map((tag) => (
              <MessagePriorityBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
