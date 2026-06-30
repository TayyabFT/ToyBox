import type { ChecklistItemState, InspectionChecklistItem } from "./types";

function ChecklistStatus({ state }: { state: ChecklistItemState }) {
  if (state === "ok") {
    return (
      <span className="font-roboto text-[10px] font-semibold tracking-[0.06em] text-teal uppercase">
        OK
      </span>
    );
  }

  if (state === "issue") {
    return (
      <span className="font-roboto text-[10px] font-semibold tracking-[0.06em] text-pink uppercase">
        Issue
      </span>
    );
  }

  return <span className="font-roboto text-[10px] text-secondary">—</span>;
}

function ChecklistCheckbox({ state }: { state: ChecklistItemState }) {
  const base =
    "flex size-4 shrink-0 items-center justify-center rounded border";

  if (state === "ok") {
    return (
      <span className={`${base} border-teal/40 bg-teal/15 text-teal`}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M2 5L4.2 7.2L8 3.2"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (state === "issue") {
    return (
      <span className={`${base} border-pink/45 bg-pink/10 text-pink`}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M3 3L7 7M7 3L3 7"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  return <span className={`${base} border-accent/20 bg-transparent`} />;
}

type InspectionChecklistSectionProps = {
  stepLabel: string;
  items: InspectionChecklistItem[];
};

export function InspectionChecklistSection({
  stepLabel,
  items,
}: InspectionChecklistSectionProps) {
  const midpoint = Math.ceil(items.length / 2);
  const leftColumn = items.slice(0, midpoint);
  const rightColumn = items.slice(midpoint);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-copperplate text-[13px] tracking-[0.04em] text-foreground uppercase">
          {stepLabel}
        </h3>
        <span className="font-roboto rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 text-[9px] font-semibold tracking-[0.08em] text-primary uppercase">
          In Progress
        </span>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
        {[leftColumn, rightColumn].map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-3">
            {column.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 ${
                  item.state === "issue"
                    ? "border-pink/25 bg-pink/[0.04]"
                    : "border-accent/10 bg-elevated/60"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <ChecklistCheckbox state={item.state} />
                  <p
                    className={`font-roboto text-[12px] tracking-[0.02em] ${
                      item.state === "issue"
                        ? "text-pink"
                        : item.state === "pending"
                          ? "text-secondary"
                          : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
                <ChecklistStatus state={item.state} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
