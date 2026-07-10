"use client";

import { AskSteveSendIcon } from "./AskSteveIcons";

type AskSteveInputBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  sending?: boolean;
};

export function AskSteveInputBar({
  value,
  onChange,
  onSend,
  disabled = false,
  sending = false,
}: AskSteveInputBarProps) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }

  return (
    <div className="ask-steve-input-bar flex items-center gap-3 rounded-xl">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask Steve anything..."
        className="font-roboto min-w-0 flex-1 bg-transparent px-5 py-4 text-[14px] tracking-[0.02em] text-foreground italic placeholder:text-secondary/60 focus:outline-none disabled:opacity-50"
      />

      <div className="p-2">
        <button
          type="button"
          aria-label="Send message"
          onClick={onSend}
          disabled={disabled || sending || !value.trim()}
          className="ask-steve-send-btn flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <AskSteveSendIcon />
        </button>
      </div>
    </div>
  );
}
