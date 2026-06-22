import {
  conciergeLogisticsCardClass,
  conciergeSectionLabelClass,
} from "./panelStyles";
import type { ConciergeLogisticsItem } from "./types";

type LogisticsSummaryProps = {
  items: ConciergeLogisticsItem[];
};

export function LogisticsSummary({ items }: LogisticsSummaryProps) {
  return (
    <div className="space-y-5">
      <h3 className={conciergeSectionLabelClass}>Logistics Summary</h3>

      <div className="space-y-3.5">
        {items.map((item) => (
          <div key={item.label} className={conciergeLogisticsCardClass}>
            <p className="font-roboto mb-2 text-[10px] tracking-[0.14em] text-[#7A6C56] uppercase">
              {item.label}
            </p>
            <p
              className={`font-roboto tracking-[0.02em] ${
                item.highlight
                  ? "text-[30px] font-semibold leading-none text-[#E5989B]"
                  : "text-[14px] font-semibold leading-snug text-[#E7E5E4]"
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
