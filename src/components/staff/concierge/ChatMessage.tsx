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
      <span className="font-roboto text-xs tracking-[0.06em] text-[#4A4338]">
        {message.senderName} {message.time}
      </span>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 text-[#F2EAD5] ${
          isStaff
            ? "rounded-tl-sm border border-[#D4A8471A] bg-[#D4A84712]"
            : "rounded-tr-sm border border-[#7DBFA024] bg-[#7DBFA012]"
        }`}
      >
        <p className="font-roboto text-[12px] leading-relaxed tracking-[0.02em]">
          {message.message}
        </p>
      </div>
    </div>
  );
}
