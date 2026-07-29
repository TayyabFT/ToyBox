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
      <div className="mx-auto flex h-[calc(100vh-72px)] w-full max-w-4xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
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
    <div className="relative flex flex-col px-4 pb-32 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-roboto text-[13px] tracking-[0.06em] text-secondary uppercase">
              Loading conversation...
            </p>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-8 sm:gap-10">
            <AskSteveHero greeting={greeting} />
            <AskSteveSuggestions
              disabled={sending || resetting}
              onSelect={(prompt) => void sendQuery(prompt)}
            />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 bg-background lg:left-[340px]">
        <div className="mx-auto w-full max-w-4xl px-4 pb-6 pt-3 sm:px-6 sm:pb-8 sm:pt-4 lg:px-8">
          <AskSteveInputBar
            value={draft}
            onChange={setDraft}
            onSend={() => void sendQuery()}
            disabled={loading || sending || resetting}
            sending={sending}
          />
        </div>
      </div>
    </div>
  );
}
