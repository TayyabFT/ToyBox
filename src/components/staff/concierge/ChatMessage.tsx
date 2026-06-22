import type { ConciergeChatMessage } from "./types";

type ChatMessageProps = {
  message: ConciergeChatMessage;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isStaff = message.sender === "staff";

  return (
    <div
      className={`flex flex-col gap-1 ${isStaff ? "items-start" : "items-end"}`}
    >
      <span className="font-roboto text-[9px] tracking-[0.06em] text-secondary">
        {message.senderName} {message.time}
      </span>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 ${
          isStaff
            ? "rounded-tl-sm border border-[#D4A8471A] bg-card text-foreground"
            : "rounded-tr-sm border border-accent/12 bg-[#141210] text-foreground-soft"
        }`}
      >
        <p className="font-roboto text-[12px] leading-relaxed tracking-[0.02em]">
          {message.message}
        </p>
      </div>
    </div>
  );
}
