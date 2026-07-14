"use client";

import { useEffect, useMemo, useState } from "react";
import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { MessageInboxRow } from "./MessageInboxRow";
import { MessageInboxTabs } from "./MessageInboxTabs";
import { conciergeListPanelClass } from "./panelStyles";
import type { ConciergeInboxMessage, MessageInboxFilter } from "./types";

function MessageInboxRowSkeleton() {
  return (
    <div className="flex gap-3.5 border-b border-[#1E1A14] px-5 py-4 last:border-b-0">
      <ShimmerBlock className="size-10 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <ShimmerBlock className="h-3 w-28" />
          <ShimmerBlock className="h-2.5 w-10" />
        </div>
        <ShimmerBlock className="h-2.5 w-full" />
      </div>
    </div>
  );
}

type MessageInboxPanelProps = {
  messages: ConciergeInboxMessage[];
  selectedId: string;
  loading?: boolean;
  onSelect: (id: string) => void;
};

function filterMessages(
  messages: ConciergeInboxMessage[],
  filter: MessageInboxFilter,
) {
  if (filter === "unread") {
    return messages.filter((message) => message.unread);
  }

  return messages;
}

export function MessageInboxPanel({
  messages,
  selectedId,
  loading = false,
  onSelect,
}: MessageInboxPanelProps) {
  const [activeFilter, setActiveFilter] = useState<MessageInboxFilter>("all");

  const filteredMessages = useMemo(
    () => filterMessages(messages, activeFilter),
    [activeFilter, messages],
  );

  const visibleSelectedId = filteredMessages.some(
    (message) => message.id === selectedId,
  )
    ? selectedId
    : (filteredMessages[0]?.id ?? "");

  useEffect(() => {
    if (visibleSelectedId && visibleSelectedId !== selectedId) {
      onSelect(visibleSelectedId);
    }
  }, [onSelect, selectedId, visibleSelectedId]);

  return (
    <section
      className={`${conciergeListPanelClass} flex h-full min-h-0 flex-col`}
    >
      <div className="shrink-0">
        <MessageInboxTabs active={activeFilter} onChange={setActiveFilter} />
      </div>

      <div className="Custom__Scrollbar min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div aria-busy="true" aria-live="polite">
            {Array.from({ length: 4 }, (_, index) => (
              <MessageInboxRowSkeleton key={index} />
            ))}
          </div>
        ) : filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <MessageInboxRow
              key={message.id}
              message={message}
              selected={message.id === visibleSelectedId}
              onSelect={() => onSelect(message.id)}
            />
          ))
        ) : (
          <p className="font-roboto px-5 py-10 text-center text-[11px] tracking-[0.06em] text-[#6B665E] uppercase">
            No unread messages
          </p>
        )}
      </div>
    </section>
  );
}
