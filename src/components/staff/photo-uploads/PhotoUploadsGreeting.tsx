"use client";

import { PhotoUploadsFilterTabs } from "./PhotoUploadsFilterTabs";
import type { PhotoUploadFilter, PhotoUploadHeader, PhotoUploadTab } from "./types";

type PhotoUploadsGreetingProps = {
  header: PhotoUploadHeader;
  activeFilter: PhotoUploadFilter;
  tabs?: PhotoUploadTab[] | null;
  onFilterChange: (filter: PhotoUploadFilter) => void;
};

export function PhotoUploadsGreeting({
  header,
  activeFilter,
  tabs,
  onFilterChange,
}: PhotoUploadsGreetingProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <p className="font-roboto text-xs tracking-[0.14em] uppercase">
          <span className="text-foreground">{header.dateLabel} · </span>
          <span className="text-primary">{header.shiftLabel}</span>
        </p>
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
