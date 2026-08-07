import type { ConciergeChatMessage } from "./types";

type ChatMessageProps = {
  message: ConciergeChatMessage;
};

function renderMessageText(message: ConciergeChatMessage) {
  const highlights = message.highlights ?? [];

  if (highlights.length === 0) {
    return message.message;
  }

  const pattern = new RegExp(`(${highlights.map(escapeRegExp).join("|")})`, "g");
  const parts = message.message.split(pattern);

  return parts.map((part, index) =>
    highlights.includes(part) ? (
      <span key={`${part}-${index}`} className="text-accent">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isOutgoing = message.sender !== "member";

  return (
    <div
      className={`flex w-full ${isOutgoing ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[78%] flex-col gap-2 ${isOutgoing ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-2xl px-5 py-4 ${
            isOutgoing
              ? "bg-gradient-to-r from-gold-bright to-accent text-dark"
              : "bg-elevated text-foreground-soft"
          }`}
        >
          <p className="font-roboto text-[14px] leading-[1.65] tracking-[0.02em]">
            {renderMessageText(message)}
          </p>
        </div>

        <span className="font-roboto text-[11px] tracking-[0.04em] text-secondary">
          {message.senderName} · {message.time}
          {isOutgoing && message.read ? " · Read" : ""}
        </span>
      </div>
    </div>
  );
}
