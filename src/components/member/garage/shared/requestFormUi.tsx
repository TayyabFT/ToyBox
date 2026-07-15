// ── Shared form primitives used across all garage request modals ──────────────

// ── Field label ───────────────────────────────────────────────────────────────

export function RequestFieldLabel({ children }: { children: string }) {
  return (
    <p className="font-roboto text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
      {children}
    </p>
  );
}

// ── Radio dot ─────────────────────────────────────────────────────────────────

export function RequestRadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        selected ? "border-primary" : "border-secondary/40"
      }`}
    >
      {selected ? <span className="size-2.5 rounded-full bg-primary" /> : null}
    </span>
  );
}

// ── Dynamic date generation ───────────────────────────────────────────────────

const SHORT_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SHORT_MONTHS   = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export type DateOption = {
  /** ISO date string YYYY-MM-DD — used as the form value */
  key: string;
  weekday: string; // e.g. "Thu"
  day: string;     // e.g. "1"
  month: string;   // e.g. "May"
};

/**
 * Generates the next `count` calendar days starting from today.
 * Returns fresh dates every call — no stale hardcoded values.
 */
export function generateDateOptions(count = 4): DateOption[] {
  const options: DateOption[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, "0");
    const dd   = String(d.getDate()).padStart(2, "0");

    options.push({
      key:     `${yyyy}-${mm}-${dd}`,
      weekday: SHORT_WEEKDAYS[d.getDay()],
      day:     String(d.getDate()),
      month:   SHORT_MONTHS[d.getMonth()],
    });
  }

  return options;
}

// ── Preferred date picker ─────────────────────────────────────────────────────

type PreferredDatePickerProps = {
  /** Currently selected ISO date key */
  value: string;
  onChange: (isoKey: string) => void;
  /**
   * compact — small button showing day + month (Detailing & Transport modals)
   * tall    — taller card showing weekday / large day / month (Maintenance modal)
   */
  variant?: "compact" | "tall";
  count?: number;
  label?: string;
};

/**
 * Shared date picker used by all three garage request modals.
 * Renders 4 (or `count`) dynamic day buttons generated from today.
 */
export function PreferredDatePicker({
  value,
  onChange,
  variant = "compact",
  count = 4,
  label = "Preferred Date",
}: PreferredDatePickerProps) {
  const options = generateDateOptions(count);

  return (
    <div className="space-y-2.5">
      <RequestFieldLabel>{label}</RequestFieldLabel>
      <div className="grid grid-cols-4 gap-2.5">
        {options.map((option) => {
          const selected = value === option.key;

          if (variant === "tall") {
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange(option.key)}
                className={`font-roboto flex h-[77px] flex-col items-center justify-center rounded-lg border text-center transition-colors ${
                  selected
                    ? "border-primary bg-primary/6 text-primary"
                    : "garage-form-chip border-accent/15 text-secondary hover:border-accent/30"
                }`}
              >
                <span className="text-[9px] font-bold tracking-[0.18em] uppercase">
                  {option.weekday}
                </span>
                <span
                  className={`mt-1 font-copperplate text-[24px] leading-none ${
                    selected ? "text-primary" : "text-foreground"
                  }`}
                >
                  {option.day}
                </span>
                <span className="mt-0.5 text-[11px] font-medium">
                  {option.month}
                </span>
              </button>
            );
          }

          // compact variant
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              className={`font-roboto flex h-11 flex-col items-center justify-center rounded-lg text-center transition-colors ${
                selected
                  ? "bg-primary text-dark"
                  : "garage-form-chip border border-accent/10 text-foreground-soft hover:border-accent/25"
              }`}
            >
              <span className="text-[13px] font-semibold leading-none">
                {option.day}
              </span>
              {/* <span
                className={`mt-0.5 text-[9px] font-medium ${
                  selected ? "text-dark/70" : "text-secondary"
                }`} 
              >
                {option.month}
              </span> */}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── ConfirmedRow ──────────────────────────────────────────────────────────────
// Used by all confirmed step components (detailing, maintenance, sourcing).

export function ConfirmedRow({
  label,
  value,
  valueClassName = "text-foreground",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="font-roboto text-[12px] text-secondary">{label}</span>
      <span
        className={`font-roboto max-w-[62%] text-right text-[12px] font-medium ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

// ── ReviewRow ─────────────────────────────────────────────────────────────────
// Used by all review step components (detailing, maintenance, sourcing).

import type { ReactNode } from "react";

export function ReviewRow({
  label,
  children,
  align = "end",
}: {
  label: string;
  children: ReactNode;
  align?: "end" | "center";
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-accent/8 py-3 last:border-b-0">
      <span className="font-roboto shrink-0 text-[11px] text-secondary">{label}</span>
      <div
        className={`min-w-0 flex-1 ${align === "center" ? "text-center" : "text-right"}`}
      >
        {children}
      </div>
    </div>
  );
}

// ── DotTimeline + TimelineNode ────────────────────────────────────────────────
// Dot-based progress timeline used by maintenance and sourcing track steps.

export type DotTimelineStep = {
  id: number;
  status: "completed" | "active" | "pending";
  title: string;
  meta: string;
  metaClassName?: string;
};

export function TimelineNode({ status }: { status: DotTimelineStep["status"] }) {
  if (status === "completed") {
    return (
      <span className="relative z-10 flex size-9 shrink-0 items-center justify-center">
        <span className="size-2.5 rounded-full bg-primary" />
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="relative z-10 flex size-9 shrink-0 items-center justify-center">
        <span className="size-4 rounded-full bg-primary shadow-[0_0_0_4px_rgba(201,168,76,0.22)]" />
      </span>
    );
  }

  return (
    <span className="relative z-10 flex size-9 shrink-0 items-center justify-center">
      <span className="garage-timeline-dot-pending size-2.5 rounded-full border border-accent/25" />
    </span>
  );
}

export function DotTimeline({ steps }: { steps: DotTimelineStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const lineTone = step.status === "pending" ? "bg-accent/15" : "bg-primary/45";
        const titleClass =
          step.status === "pending"
            ? "font-roboto text-[13px] font-semibold text-secondary/55"
            : "font-roboto text-[13px] font-semibold text-foreground";

        return (
          <div key={step.id} className={`relative flex gap-4 ${isLast ? "" : "pb-7"}`}>
            {!isLast ? (
              <span
                className={`absolute top-9 left-[17px] h-[calc(100%-12px)] w-px ${lineTone}`}
              />
            ) : null}

            <TimelineNode status={step.status} />

            <div className="min-w-0 pt-1.5">
              <p className={titleClass}>{step.title}</p>
              <p
                className={`font-roboto mt-1 text-[11px] ${
                  step.metaClassName ?? "text-secondary"
                }`}
              >
                {step.meta}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
