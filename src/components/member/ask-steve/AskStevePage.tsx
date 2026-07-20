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
      <div className="mx-auto flex h-[calc(100vh-72px)] w-full max-w-4xl flex-col px-8 py-6">
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
    <div className="relative flex flex-col px-8 pb-32 pt-10">
      <div className="mx-auto w-full max-w-4xl">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-roboto text-[13px] tracking-[0.06em] text-secondary uppercase">
              Loading conversation...
            </p>
          </div>
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

      <div className="fixed bottom-0 left-0 right-0 z-10 bg-background lg:pl-[340px]">
        <div className="mx-auto w-full max-w-4xl px-8 pb-8 pt-4">
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
