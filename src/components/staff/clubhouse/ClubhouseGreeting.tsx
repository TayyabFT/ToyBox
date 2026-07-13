import type { ClubhouseSummaryDisplay } from "./types";

type ClubhouseGreetingProps = {
  summary?: ClubhouseSummaryDisplay;
};

export function ClubhouseGreeting({ summary }: ClubhouseGreetingProps) {
  const dateLabel = summary?.dateLabel ?? "Today";
  const shiftLabel = summary?.shiftLabel ?? "Shift";

  return (
    <div className="space-y-3">
      <p className="font-roboto text-xs tracking-[0.14em] text-primary uppercase">
        {dateLabel} · {shiftLabel}
      </p>
      <h1 className="font-copperplate text-[32px] leading-tight">
        <span className="text-foreground">Club </span>
        <span className="text-primary">House</span>
      </h1>
    </div>
  );
}
