import type { ActiveBayItem } from "./types";

const statusBadgeClass = {
  overdue: "border-pink/35 bg-pink/10 text-pink",
  active: "border-teal/35 bg-teal/10 text-teal",
  "final-check": "border-[#7DBFA0]/35 bg-[#7DBFA0]/10 text-[#7DBFA0]",
  "in-transit": "border-[#C5A059]/35 bg-[#C5A059]/10 text-[#C5A059]",
  "track-repairs": "border-[#9E8AD4]/35 bg-[#9E8AD4]/10 text-[#9E8AD4]",
} as const;

const timeToneClass = {
  pink: "text-pink",
  gold: "text-[#C5A059]",
  teal: "text-[#7DBFA0]",
} as const;

type ActiveBayCardProps = {
  bay: ActiveBayItem;
};

export function ActiveBayCard({ bay }: ActiveBayCardProps) {
  const timeClass = timeToneClass[bay.timeTone ?? "gold"];

  return (
    <article className="flex min-h-[220px] flex-col rounded-xl border border-white/5 bg-[#11100C] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-roboto text-[10px] font-semibold tracking-[0.16em] text-[#C5A059] uppercase">
          {bay.bay}
        </p>
        <span
          className={`font-roboto rounded-full border px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.1em] uppercase ${statusBadgeClass[bay.status]}`}
        >
          {bay.statusLabel}
        </span>
      </div>

      <div className="mb-3 space-y-1.5">
        <p className="font-roboto text-[13px] font-semibold leading-tight tracking-[0.05em] uppercase">
          <span className="text-[#E7E5E4]">{bay.vehicleMake} </span>
          <span className="text-[#C5A059]">{bay.vehicleModel}</span>
        </p>
        <p className="font-roboto text-[10px] tracking-[0.1em] text-[#6B665E] uppercase">
          {bay.memberName} · {bay.memberNumber}
        </p>
      </div>

      <p className="font-roboto mb-4 flex-1 text-[13px] leading-[1.65] tracking-[0.02em] text-[#B8AE96]">
        {bay.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/5 pt-3.5">
        <div className="flex items-center gap-2">
          <span
            className={`size-2 shrink-0 rounded-full ${
              bay.engineer === "Unassigned" ? "bg-[#6B665E]" : "bg-teal"
            }`}
          />
          <span className="font-roboto text-[11px] tracking-[0.04em] text-[#E7E5E4]">
            {bay.engineer}
            {bay.engineerRole ? (
              <span className="text-[#6B665E]"> · {bay.engineerRole}</span>
            ) : null}
          </span>
        </div>
        <span
          className={`font-roboto shrink-0 text-[11px] font-medium tracking-[0.06em] uppercase ${timeClass}`}
        >
          {bay.timeLabel}
        </span>
      </div>
    </article>
  );
}
