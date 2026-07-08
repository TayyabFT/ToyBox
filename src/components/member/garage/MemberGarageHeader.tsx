type MemberGarageHeaderProps = {
  onAddClick?: () => void;
};

export function MemberGarageHeader({ onAddClick }: MemberGarageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="font-roboto text-[10px] tracking-[0.18em] text-primary uppercase">
          Your Collection
        </p>
        <h1 className="font-copperplate text-[36px] leading-none tracking-[0.04em] text-foreground uppercase">
          Garage
        </h1>
      </div>

      {/* <button
        type="button"
        onClick={onAddClick}
        className="font-roboto shrink-0 cursor-pointer rounded-full border border-primary/35 bg-primary/8 px-5 py-2.5 text-[12px] font-medium text-primary transition-colors hover:border-primary/50 hover:bg-primary/14"
      >
        + Add a motor car
      </button> */}
    </div>
  );
}
