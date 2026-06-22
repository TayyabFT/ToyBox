"use client";

import { useState } from "react";
import { VehicleSend } from "@/components/common/Svgs";
import { ChatMessage } from "./ChatMessage";
import { conciergePanelClass } from "./panelStyles";
import type { ConciergeChatMessage } from "./types";

type MemberChatPanelProps = {
  chatTitle: string;
  chatOnline: boolean;
  messages: ConciergeChatMessage[];
  sessionLabel?: string;
};

export function MemberChatPanel({
  chatTitle,
  messages,
  sessionLabel,
}: MemberChatPanelProps) {
  const [draft, setDraft] = useState("");

  const dateLabel =
    sessionLabel ??
    (messages[0] ? `TODAY · ${messages[0].time}` : undefined);

  return (
    <section className={`${conciergePanelClass} flex min-h-[520px] flex-col`}>
      <div className="Custom__Scrollbar mb-5 flex-1 space-y-6 overflow-y-auto px-1 py-2">
        {dateLabel && (
          <p className="font-roboto text-center text-[11px] tracking-[0.12em] text-[#6B665E] uppercase">
            {dateLabel}
          </p>
        )}

        {messages.length > 0 ? (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        ) : (
          <p className="font-roboto py-10 text-center text-[11px] tracking-[0.06em] text-[#6B665E] uppercase">
            No messages yet
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[#2A2620] bg-[#0D0C0A] px-5 py-4">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={`Reply to ${chatTitle}...`}
          className="font-roboto min-w-0 flex-1 bg-transparent text-[13px] tracking-[0.02em] text-[#E7E5E4] outline-none placeholder:text-[#6B665E]"
        />
        <button
          type="button"
          aria-label="Send message"
          disabled={!draft.trim()}
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#F0C566] to-[#C9A84C] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <VehicleSend color="#0A0806" className="size-4" />
        </button>
      </div>
    </section>
  );
}
