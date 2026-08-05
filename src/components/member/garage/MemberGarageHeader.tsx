type MemberGarageHeaderProps = {
  onAddVehicleClick?: () => void;
};

export function MemberGarageHeader({ onAddVehicleClick }: MemberGarageHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-1.5 sm:space-y-2">
        <p className="garage-page-eyebrow font-roboto text-[10px] tracking-[0.18em] text-accent uppercase">
          Your Collection
        </p>
        <h1 className="font-copperplate text-[30px] sm:text-[34px] md:text-[40px] leading-none tracking-[0.03em] text-foreground uppercase">
          Garage
        </h1>
      </div>

      <button
        type="button"
        onClick={onAddVehicleClick}
        className="font-roboto inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-black transition-all hover:bg-accent/90 hover:shadow-[0_4px_20px_rgba(0,0,0,0.25)] active:scale-[0.97] sm:px-7 sm:py-3"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Vehicle
      </button>
    </div>
  );
}
