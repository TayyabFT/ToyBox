"use client";

import { MemberVehicleSourcingIcon } from "@/components/common/Svgs";

type MemberGarageHeaderProps = {
  onSourcingClick?: () => void;
};

export function MemberGarageHeader({ onSourcingClick }: MemberGarageHeaderProps) {
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
        onClick={onSourcingClick}
        className="font-roboto flex w-full sm:w-auto shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[12px] font-semibold text-dark transition-colors hover:bg-[#D4B45C]"
      >
        <MemberVehicleSourcingIcon className="size-[14px]" />
        Source a Vehicle
      </button>
    </div>
  );
}
