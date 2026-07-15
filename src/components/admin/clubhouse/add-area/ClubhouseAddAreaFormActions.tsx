type ClubhouseAddAreaFormActionsProps = {
  saving?: boolean;
  onCancel: () => void;
  onSave: () => void;
};

export function ClubhouseAddAreaFormActions({
  saving = false,
  onCancel,
  onSave,
}: ClubhouseAddAreaFormActionsProps) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="font-roboto cursor-pointer rounded-lg border border-accent/25 bg-transparent py-3 text-sm font-semibold tracking-[0.12em] text-foreground uppercase transition-colors hover:border-accent disabled:opacity-60"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="admin-gold-cta font-roboto cursor-pointer rounded-lg py-3 text-sm font-semibold tracking-[0.12em] uppercase disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
