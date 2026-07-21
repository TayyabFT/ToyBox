type MemberGarageHeaderProps = {
  onAddVehicleClick?: () => void;
};

export function MemberGarageHeader({ onAddVehicleClick }: MemberGarageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5 sm:space-y-2">
        <p className="font-roboto text-[10px] tracking-[0.18em] text-accent uppercase">
          Your Collection
        </p>
        <h1 className="font-copperplate text-[28px] sm:text-[32px] md:text-[36px] leading-none tracking-[0.04em] text-foreground uppercase">
          Garage
        </h1>
      </div>

      <button
        type="button"
        onClick={onAddVehicleClick}
        className="garage-add-vehicle-btn font-roboto shrink-0 cursor-pointer rounded-full px-7 py-3 text-[10px] font-semibold tracking-[0.18em] uppercase"
      >
        <span className="garage-add-vehicle-btn__shimmer" aria-hidden="true" />
        <span className="relative flex items-center gap-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M6 1v10M1 6h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Add Vehicle
        </span>
      </button>
    </div>
  );
}
