import type { ConciergeLogisticsItem } from "./types";

type LogisticsSummaryProps = {
  items: ConciergeLogisticsItem[];
};

export function LogisticsSummary({ items }: LogisticsSummaryProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-roboto text-[10px] tracking-[0.14em] text-secondary uppercase">
        Logistics Summary
      </h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-accent/10 bg-surface px-4 py-3"
          >
            <p className="font-roboto mb-1.5 text-[9px] tracking-[0.12em] text-secondary uppercase">
              {item.label}
            </p>
            <p
              className={`font-roboto text-[12px] tracking-[0.03em] ${
                item.highlight
                  ? "font-medium text-pink"
                  : "text-foreground"
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
