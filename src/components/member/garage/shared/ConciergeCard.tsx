// ── Shared assigned concierge / manager card ─────────────────────────────────

import { MemberGarageConciergeChatIcon } from "@/components/common/Svgs";

type ConciergeCardProps = {
  /** Display name e.g. "Sarah Khalid" */
  name: string;
  /** Two-letter initials e.g. "SK" */
  initials: string;
  /** Status / role subtitle e.g. "Available · Responds in <2 min" */
  subtitle: string;
  /** Section label shown above the card */
  sectionLabel?: string;
};

export function ConciergeCard({
  name,
  initials,
  subtitle,
  sectionLabel,
}: ConciergeCardProps) {
  return (
    <div>
      {sectionLabel ? (
        <p className="font-roboto mb-3 text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
          {sectionLabel}
        </p>
      ) : null}

      <div className="flex items-center gap-3 rounded-2xl border border-accent/12 bg-elevated px-4 py-3.5">
        <span className="font-roboto flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/8 text-[13px] font-semibold text-primary">
          {initials}
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-roboto text-[13px] font-semibold text-foreground">
            {name}
          </p>
          <p className="font-roboto mt-0.5 text-[11px] text-secondary">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-colors hover:border-primary/60 hover:bg-primary/15"
          aria-label={`Message ${name}`}
        >
          <MemberGarageConciergeChatIcon />
        </button>
      </div>
    </div>
  );
}
