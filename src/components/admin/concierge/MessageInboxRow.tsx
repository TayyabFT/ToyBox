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
      className={`flex w-full cursor-pointer gap-3.5 border-b border-accent/8 px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-elevated/50 ${
        selected
          ? "border-l-2 border-l-accent bg-elevated/70 pl-[18px]"
          : "border-l-2 border-l-transparent"
      }`}
    >
      <span className="admin-gold-avatar flex size-10 shrink-0 items-center justify-center rounded-full font-roboto text-[14px] font-semibold uppercase">
        {message.memberInitial}
      </span>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <p className="font-roboto truncate text-[13px] font-semibold tracking-[0.04em] text-foreground uppercase">
            {message.memberName}
          </p>
          <span className="shrink-0 font-roboto text-[11px] tracking-[0.04em] text-pink">
            {message.timeLabel}
          </span>
        </div>

        <p className="font-roboto text-[12px] leading-relaxed tracking-[0.02em] text-section-label">
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
