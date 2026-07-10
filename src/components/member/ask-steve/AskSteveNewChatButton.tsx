type AskSteveNewChatButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function AskSteveNewChatButton({
  onClick,
  disabled = false,
}: AskSteveNewChatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="ask-steve-new-chat-btn font-roboto relative cursor-pointer overflow-hidden rounded-full px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase transition-all disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="relative z-10">New chat</span>
    </button>
  );
}
