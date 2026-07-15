import type { ConciergeChatMessage } from "./types";

type ChatMessageProps = {
  message: ConciergeChatMessage;
  viewerRole?: "staff" | "member";
  ownBubbleClassName?: string;
};

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-0.5" aria-label="Thinking">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="ask-steve-thinking-dot size-1.5 rounded-full bg-current opacity-70"
          style={{ animationDelay: `${index * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export function ChatMessage({
  message,
  viewerRole = "staff",
  ownBubbleClassName,
}: ChatMessageProps) {
  const isOwnMessage =
    viewerRole === "member"
      ? message.sender === "member"
      : message.sender === "staff" || message.sender === "admin";

  const ownBubbleClass =
    ownBubbleClassName ??
    "concierge-own-bubble rounded-tr-sm bg-[#D4A847] text-dark";

  const incomingBubbleClass =
    message.sender === "admin"
      ? "rounded-tl-sm border border-accent/14 bg-accent/7 text-foreground"
      : "rounded-tl-sm border border-teal/14 bg-teal/7 text-foreground";

  return (
    <div
      className={`flex flex-col gap-1 ${isOwnMessage ? "items-end" : "items-start"}`}
    >
      <span className="font-roboto text-xs tracking-[0.06em] text-section-label">
        {message.senderName} {message.time}
      </span>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 ${
          isOwnMessage ? ownBubbleClass : incomingBubbleClass
        }`}
      >
        {message.thinking ? (
          <ThinkingDots />
        ) : (
          <p className="font-roboto text-[12px] leading-relaxed tracking-[0.02em]">
            {message.message}
          </p>
        )}
      </div>
    </div>
  );
}
