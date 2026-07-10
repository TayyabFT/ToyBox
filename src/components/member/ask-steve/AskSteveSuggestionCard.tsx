import { AskSteveArrowIcon, AskSteveSuggestionIcon } from "./AskSteveIcons";
import type { AskSteveSuggestion } from "./mockData";

type AskSteveSuggestionCardProps = {
  suggestion: AskSteveSuggestion;
  disabled?: boolean;
  onSelect: () => void;
};

export function AskSteveSuggestionCard({
  suggestion,
  disabled = false,
  onSelect,
}: AskSteveSuggestionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className="ask-steve-suggestion flex w-full cursor-pointer items-center gap-4 rounded-2xl px-4 py-4 text-left transition-colors hover:border-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="member-page-icon-box flex size-11 shrink-0 items-center justify-center rounded-xl">
        <AskSteveSuggestionIcon icon={suggestion.icon} />
      </span>

      <span className="min-w-0 flex-1 space-y-1">
        <span className="font-roboto block text-[13px] leading-snug tracking-[0.01em] text-foreground">
          &ldquo;{suggestion.prompt}&rdquo;
        </span>
        <span className="font-roboto block text-[10px] tracking-[0.14em] text-primary uppercase">
          — {suggestion.category}
        </span>
      </span>

      <span className="shrink-0 text-accent">
        <AskSteveArrowIcon />
      </span>
    </button>
  );
}
