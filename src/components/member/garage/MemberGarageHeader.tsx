type MemberGarageHeaderProps = {
  onAddClick?: () => void;
};

export function MemberGarageHeader({ onAddClick }: MemberGarageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="font-roboto text-[10px] tracking-[0.18em] text-accent uppercase">
          Your Collection
        </p>
        <h1 className="font-copperplate text-[36px] leading-none tracking-[0.04em] text-foreground uppercase">
          Garage
        </h1>
      </div>

      {/* <button
        type="button"
        onClick={onAddClick}
        className="font-roboto shrink-0 cursor-pointer rounded-full border border-accent/25 bg-elevated px-5 py-2.5 text-[11px] font-medium tracking-[0.08em] text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary"
      >
        + Add a motor car
      </button> */}
    </div>
  );
}
