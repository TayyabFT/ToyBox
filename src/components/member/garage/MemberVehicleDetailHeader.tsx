"use client";

import { useRouter } from "next/navigation";
import { MemberGarageRefreshIcon } from "@/components/common/Svgs";

type MemberVehicleDetailHeaderProps = {
  onBookServices?: () => void;
};

export function MemberVehicleDetailHeader({ onBookServices }: MemberVehicleDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="group flex cursor-pointer items-center gap-1.5 font-roboto text-[10px] tracking-[0.18em] text-[#6E6455] uppercase transition-colors hover:text-primary"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            <path
              d="M7.5 2L3.5 6L7.5 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>

        <div className="space-y-2">
          <p className="font-roboto text-[10px] tracking-[0.18em] text-primary uppercase">
            Your Collection
          </p>
          <h1 className="font-copperplate text-[36px] leading-none tracking-[0.04em] text-foreground-soft uppercase">
            Details
          </h1>
        </div>
      </div>

      <button
        type="button"
        onClick={onBookServices}
        className="font-roboto flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[12px] font-semibold text-dark transition-colors hover:bg-[#D4B45C]"
      >
        <MemberGarageRefreshIcon className="size-[14px]" color="currentColor" />
        Book Services
      </button>
    </div>
  );
}
