"use client";

import { StaffShiftMeta } from "@/components/staff/StaffShiftMeta";
import { PhotoUploadsFilterTabs } from "./PhotoUploadsFilterTabs";
import type { PhotoUploadFilter, PhotoUploadTab } from "./types";

type PhotoUploadsGreetingProps = {
  activeFilter: PhotoUploadFilter;
  tabs?: PhotoUploadTab[] | null;
  onFilterChange: (filter: PhotoUploadFilter) => void;
};

export function PhotoUploadsGreeting({
  activeFilter,
  tabs,
  onFilterChange,
}: PhotoUploadsGreetingProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <StaffShiftMeta split />
        <h1 className="font-copperplate text-[32px] leading-tight">
          <span className="text-foreground">Photo </span>
          <span className="text-primary">Uploads</span>
        </h1>
      </div>

      <PhotoUploadsFilterTabs
        active={activeFilter}
        tabs={tabs ?? undefined}
        onChange={onFilterChange}
      />
    </div>
  );
}
