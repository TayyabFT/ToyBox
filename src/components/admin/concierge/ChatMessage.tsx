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
      <span key={`${part}-${index}`} className="text-[#D4A74C]">
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
  const isStaff = message.sender === "staff";

  return (
    <div
      className={`flex flex-col gap-2 ${isStaff ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[78%] rounded-2xl px-5 py-4 ${
          isStaff
            ? "bg-gradient-to-r from-[#F0C566] to-[#C9A84C] text-[#0A0806]"
            : "bg-[#1E1B18] text-[#E7E5E4]"
        }`}
      >
        <p className="font-roboto text-[14px] leading-[1.65] tracking-[0.02em]">
          {renderMessageText(message)}
        </p>
      </div>

      <span className="font-roboto text-[11px] tracking-[0.04em] text-[#6B665E]">
        {message.senderName} · {message.time}
        {isStaff && message.read ? " · Read" : ""}
      </span>
    </div>
  );
}
