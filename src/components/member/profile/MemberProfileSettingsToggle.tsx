type MemberProfileSettingsToggleProps = {
  enabled: boolean;
  onChange?: (enabled: boolean) => void;
};

export function MemberProfileSettingsToggle({
  enabled,
  onChange,
}: MemberProfileSettingsToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange?.(!enabled)}
      className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${
        enabled
          ? "border-accent/40 bg-accent/20"
          : "border-accent/15 bg-accent/8"
      }`}
    >
      <span
        className={`absolute top-0.5 size-3.5 rounded-full bg-accent transition-transform ${
          enabled ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
