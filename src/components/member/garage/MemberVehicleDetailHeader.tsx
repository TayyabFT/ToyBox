export function MemberVehicleDetailHeader() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="font-roboto text-[10px] tracking-[0.18em] text-primary uppercase">
          Your Collection
        </p>
        <h1 className="font-copperplate text-[36px] leading-none tracking-[0.04em] text-foreground-soft uppercase">
          Details
        </h1>
      </div>

      <button
        type="button"
        className="font-roboto flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[12px] font-semibold text-dark transition-colors hover:bg-[#D4B45C]"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M13.5 8A5.5 5.5 0 1 1 8 2.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M13.5 3.5V6.5H10.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Book Services
      </button>
    </div>
  );
}
