"use client";

import { useState } from "react";
import { ConciergePageHeader } from "./ConciergePageHeader";
import { MemberChatPanel } from "./MemberChatPanel";
import { MessageInboxPanel } from "./MessageInboxPanel";
import { inboxMessages, messageDetails } from "./mockData";

export function ConciergePage() {
  const [selectedId, setSelectedId] = useState(inboxMessages[0]?.id ?? "");

  const visibleSelectedId = inboxMessages.some((message) => message.id === selectedId)
    ? selectedId
    : (inboxMessages[0]?.id ?? "");

  const selectedDetail =
    messageDetails[visibleSelectedId] ?? messageDetails["msg-1"]!;

  return (
    <div className="space-y-6 p-8">
      <ConciergePageHeader />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <MessageInboxPanel
          messages={inboxMessages}
          selectedId={visibleSelectedId}
          onSelect={setSelectedId}
        />

        <MemberChatPanel
          chatTitle={selectedDetail.chatTitle}
          chatOnline={selectedDetail.chatOnline}
          messages={selectedDetail.chatMessages}
          sessionLabel={selectedDetail.sessionLabel}
        />
      </div>
    </div>
  );
}
