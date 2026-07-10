import { MemberGarageRefreshIcon } from "@/components/common/Svgs";

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
        <MemberGarageRefreshIcon className="size-[14px]" color="currentColor" />
        Book Services
      </button>
    </div>
  );
}
