import type { ConciergeChatMessage } from "./types";

type ChatMessageProps = {
  message: ConciergeChatMessage;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isStaff = message.sender === "staff";

  return (
    <div
      className={`flex flex-col gap-1 ${isStaff ? "items-end" : "items-start"}`}
    >
      <span className="font-roboto text-xs tracking-[0.06em] text-section-label">
        {message.senderName} {message.time}
      </span>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 text-foreground ${
          isStaff
            ? "rounded-tr-sm border border-accent/10 bg-accent/7"
            : "rounded-tl-sm border border-teal/14 bg-teal/7"
        }`}
      >
        <p className="font-roboto text-[12px] leading-relaxed tracking-[0.02em]">
          {message.message}
        </p>
      </div>
    </div>
  );
}
