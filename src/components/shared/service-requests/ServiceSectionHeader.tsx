import type { ReactNode } from "react";
import type { SectionMeta } from "./types";

type ServiceSectionHeaderProps = {
  meta: SectionMeta;
  actions?: ReactNode;
};

export function ServiceSectionHeader({
  meta,
  actions,
}: ServiceSectionHeaderProps) {
  return (
    <div className="-mx-5 mb-4 flex items-start justify-between gap-3 border-b border-[#D4A8470F] px-5 pb-4">
      <div className="space-y-1">
        <h3 className="font-copperplate text-sm font-normal tracking-[0.06em] text-primary uppercase">
          {meta.title}
        </h3>
        <p className="font-roboto text-[9px] tracking-[0.1em] text-secondary uppercase">
          {meta.requestCount} requests · {meta.highlightLabel}
        </p>
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
