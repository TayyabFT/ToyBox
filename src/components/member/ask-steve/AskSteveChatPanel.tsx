import type { RefObject } from "react";
import { ChatMessage } from "@/components/staff/concierge/ChatMessage";
import { StatusPill } from "@/components/staff/overview/StatusPill";
import { mapAskSteveToConciergeMessages } from "@/lib/askSteve";
import type { AskSteveMessage } from "@/lib/askSteve";
import { AskSteveInputBar } from "./AskSteveInputBar";
import { AskSteveNewChatButton } from "./AskSteveNewChatButton";

type AskSteveChatPanelProps = {
  messages: AskSteveMessage[];
  messagesContainerRef: RefObject<HTMLDivElement | null>;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onNewChat: () => void;
  sending?: boolean;
  resetting?: boolean;
};

export function AskSteveChatPanel({
  messages,
  messagesContainerRef,
  draft,
  onDraftChange,
  onSend,
  onNewChat,
  sending = false,
  resetting = false,
}: AskSteveChatPanelProps) {
  const conciergeMessages = mapAskSteveToConciergeMessages(messages);

  return (
    <section className="flex h-[calc(100vh-120px)] w-full flex-col overflow-hidden">
      <div className="shrink-0 px-2 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-copperplate text-[28px] leading-none tracking-[0.06em] text-foreground uppercase">
              Ask Steve
            </h2>
            <p className="font-roboto !mt-3 text-[11px] tracking-[0.12em] text-secondary uppercase">
              Your private intelligence
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <StatusPill label="online" tone="green" />
            <AskSteveNewChatButton
              onClick={onNewChat}
              disabled={sending || resetting}
            />
          </div>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="Custom__Scrollbar min-h-0 flex-1 overflow-y-auto px-2 py-5"
      >
        <div className="space-y-4 pr-1">
          {conciergeMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              viewerRole="member"
              ownBubbleClassName="rounded-tr-sm bg-[#D4A847] text-dark"
            />
          ))}
        </div>
      </div>

      <div className="shrink-0 px-2 pb-2 pt-4">
        <AskSteveInputBar
          value={draft}
          onChange={onDraftChange}
          onSend={onSend}
          disabled={sending || resetting}
          sending={sending}
        />
      </div>
    </section>
  );
}
