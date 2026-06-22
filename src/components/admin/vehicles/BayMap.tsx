import type { BayMapDisplay, BayStatus } from "./types";

const LEGEND: { status: BayStatus; label: string }[] = [
  { status: "occupied", label: "Occupied" },
  { status: "service", label: "Service" },
  { status: "overdue", label: "Overdue" },
  { status: "away", label: "Away" },
  { status: "empty", label: "Empty" },
];

const DOT_TONE: Record<BayStatus, string> = {
  occupied: "bg-primary",
  service: "bg-[#E8C547]",
  overdue: "bg-[var(--pink)]",
  away: "bg-[#9A8CE0]",
  empty: "border border-accent/35",
};

const CARD_TONE: Record<BayStatus, string> = {
  occupied:
    "border-primary/20 bg-gradient-to-b from-primary/[0.12] to-primary/[0.02] text-primary",
  service:
    "border-[#E8C547]/30 bg-gradient-to-b from-[#E8C547]/[0.14] to-[#E8C547]/[0.03] text-[#E8C547]",
  overdue:
    "border-[var(--pink)]/30 bg-gradient-to-b from-[var(--pink)]/[0.14] to-[var(--pink)]/[0.03] text-[var(--pink)]",
  away:
    "border-[#9A8CE0]/30 bg-gradient-to-b from-[#9A8CE0]/[0.16] to-[#9A8CE0]/[0.04] text-[#9A8CE0]",
  empty: "border-accent/12 bg-transparent text-secondary",
};

type BayMapProps = {
  bayMap: BayMapDisplay;
  loading?: boolean;
};

export function BayMap({ bayMap, loading = false }: BayMapProps) {
  const levelDisplay = bayMap.levelLabel.replace(/^level\s*/i, "Level ");

  return (
    <section
      className={`rounded-2xl border border-accent/12 bg-card p-5 ${
        loading ? "opacity-70" : ""
      }`}
      aria-busy={loading}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-copperplate text-[16px] tracking-[0.06em] text-foreground uppercase">
          Bay Map{" "}
          <span className="text-primary">— {levelDisplay}</span>
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          {LEGEND.map((item) => (
            <span key={item.status} className="flex items-center gap-1.5">
              <span
                className={`size-2 rounded-full ${DOT_TONE[item.status]}`}
              />
              <span className="font-roboto text-[9px] font-medium tracking-[0.12em] text-secondary uppercase">
                {item.label}
              </span>
            </span>
          ))}
        </div>
      </div>

      {bayMap.bays.length === 0 ? (
        <p className="font-roboto py-8 text-center text-sm text-secondary">
          No bay data available.
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {bayMap.bays.map((bay, index) => (
            <article
              key={`${bay.bay}-${index}`}
              className={`flex min-h-[78px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-center transition-colors ${CARD_TONE[bay.status]}`}
            >
              <p className="font-copperplate text-[18px] leading-none">
                {bay.bay}
              </p>
              {bay.name ? (
                <p className="font-roboto text-[9px] tracking-[0.1em] uppercase opacity-75">
                  {bay.name}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
