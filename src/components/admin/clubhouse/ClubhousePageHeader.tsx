type ClubhousePageHeaderProps = {
  onAddNewClick?: () => void;
};

export function ClubhousePageHeader({ onAddNewClick }: ClubhousePageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="font-roboto text-[10px] tracking-[0.18em] text-accent uppercase">
          — Clubhouse
        </p>
        <h1 className="font-copperplate text-[36px] leading-none tracking-[0.04em] text-foreground uppercase">
          Clubhouse
        </h1>
      </div>

      <button
        type="button"
        onClick={onAddNewClick}
        className="admin-gold-cta font-roboto shrink-0 cursor-pointer rounded-full px-6 py-3 text-[10px] font-semibold tracking-[0.16em] uppercase"
      >
        + Add New
      </button>
    </div>
  );
}
