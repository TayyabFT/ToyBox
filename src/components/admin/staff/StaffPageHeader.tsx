type StaffPageHeaderProps = {
  onInviteClick?: () => void;
};

export function StaffPageHeader({ onInviteClick }: StaffPageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="font-roboto text-[10px] tracking-[0.18em] text-primary uppercase">
          — Staff Directory
        </p>
        <h1 className="font-copperplate text-[36px] leading-none tracking-[0.04em] text-foreground uppercase">
          Staff
        </h1>
      </div>

      <button
        type="button"
        onClick={onInviteClick}
        className="font-roboto shrink-0 cursor-pointer rounded-full bg-primary px-6 py-3 text-[10px] font-semibold tracking-[0.16em] text-dark uppercase shadow-[0_0_28px_rgba(201,168,76,0.35)] transition-colors hover:bg-[#D4B45C]"
      >
        + Invite Staff
      </button>
    </div>
  );
}
