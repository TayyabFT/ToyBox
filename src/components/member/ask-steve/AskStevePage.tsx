"use client";

import { AskSteveChatPanel } from "./AskSteveChatPanel";
import { AskSteveHero } from "./AskSteveHero";
import { AskSteveInputBar } from "./AskSteveInputBar";
import { AskSteveSuggestions } from "./AskSteveSuggestions";
import { useAskSteveChat } from "./useAskSteveChat";

export function AskStevePage() {
  const {
    draft,
    setDraft,
    messages,
    greeting,
    loading,
    sending,
    resetting,
    hasConversation,
    messagesContainerRef,
    sendQuery,
    startNewChat,
  } = useAskSteveChat();

  if (hasConversation) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-4xl flex-col px-8 py-6">
        <AskSteveChatPanel
          messages={messages}
          messagesContainerRef={messagesContainerRef}
          draft={draft}
          onDraftChange={setDraft}
          onSend={() => void sendQuery()}
          onNewChat={() => void startNewChat()}
          sending={sending}
          resetting={resetting}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center overflow-hidden px-8 py-6">
        {loading ? (
          <p className="font-roboto text-[13px] tracking-[0.06em] text-secondary uppercase">
            Loading conversation...
          </p>
        ) : (
          <div className="flex w-full flex-col items-center gap-10">
            <AskSteveHero greeting={greeting} />
            <AskSteveSuggestions
              disabled={sending || resetting}
              onSelect={(prompt) => void sendQuery(prompt)}
            />
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-4xl shrink-0 px-8 pb-8">
        <AskSteveInputBar
          value={draft}
          onChange={setDraft}
          onSend={() => void sendQuery()}
          disabled={loading || sending || resetting}
          sending={sending}
        />
      </div>
    </div>
  );
}
