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
        className="font-roboto cursor-pointer rounded-lg border border-[#D4A84740] bg-transparent py-3 text-sm font-semibold tracking-[0.12em] text-[#EDE3CC] uppercase transition-colors hover:border-[#C9A84C] disabled:opacity-60"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="font-roboto cursor-pointer rounded-lg bg-[#C9A84C] py-3 text-sm font-semibold tracking-[0.12em] text-[#1a1208] uppercase transition-colors hover:bg-[#D4B45C] disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
