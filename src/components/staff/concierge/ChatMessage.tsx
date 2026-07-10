import type { ConciergeChatMessage } from "./types";

type ChatMessageProps = {
  message: ConciergeChatMessage;
  viewerRole?: "staff" | "member";
};

export function ChatMessage({
  message,
  viewerRole = "staff",
}: ChatMessageProps) {
  const isOwnMessage =
    viewerRole === "member"
      ? message.sender === "member"
      : message.sender === "staff" || message.sender === "admin";

  const incomingBubbleClass =
    message.sender === "admin"
      ? "rounded-tl-sm border border-accent/14 bg-accent/7"
      : "rounded-tl-sm border border-teal/14 bg-teal/7";

  return (
    <div
      className={`flex flex-col gap-1 ${isOwnMessage ? "items-end" : "items-start"}`}
    >
      <span className="font-roboto text-xs tracking-[0.06em] text-section-label">
        {message.senderName} {message.time}
      </span>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 text-foreground ${
          isOwnMessage
            ? "rounded-tr-sm border border-accent/10 bg-accent/7"
            : incomingBubbleClass
        }`}
      >
        <p className="font-roboto text-[12px] leading-relaxed tracking-[0.02em]">
          {message.message}
        </p>
      </div>
    </div>
  );
}
