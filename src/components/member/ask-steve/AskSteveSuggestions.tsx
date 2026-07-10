import { AskSteveSuggestionCard } from "./AskSteveSuggestionCard";
import { askSteveSuggestions } from "./mockData";

type AskSteveSuggestionsProps = {
  disabled?: boolean;
  onSelect: (prompt: string) => void;
};

export function AskSteveSuggestions({
  disabled = false,
  onSelect,
}: AskSteveSuggestionsProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      {askSteveSuggestions.map((suggestion) => (
        <AskSteveSuggestionCard
          key={suggestion.id}
          suggestion={suggestion}
          disabled={disabled}
          onSelect={() => onSelect(suggestion.prompt)}
        />
      ))}
    </div>
  );
}
