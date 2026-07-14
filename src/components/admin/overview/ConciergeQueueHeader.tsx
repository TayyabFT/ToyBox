import {
  overviewTitleAccentClass,
  overviewTitleBeforeClass,
} from "./panelStyles";

type ConciergeQueueHeaderProps = {
  openCount: number;
  urgentCount: number;
  avgWait: string;
};

export function ConciergeQueueHeader({
  openCount,
  urgentCount,
  avgWait,
}: ConciergeQueueHeaderProps) {
  return (
    <div className="mb-6 space-y-2">
      <h2 className="font-copperplate text-[18px] leading-tight tracking-[0.04em] uppercase">
        <span className={overviewTitleBeforeClass}>Concierge </span>
        <span className={overviewTitleAccentClass}>Queue</span>
      </h2>
      <p className="font-roboto text-[11px] tracking-[0.08em] text-secondary uppercase">
        {openCount} open · {urgentCount} urgent · avg {avgWait}
      </p>
    </div>
  );
}
