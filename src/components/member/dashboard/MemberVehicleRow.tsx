import Link from "next/link";
import type { MemberVehicleItem } from "@/components/member/dashboard/types";

const statusConfig: Record<
  string,
  { label: string; badgeCls: string }
> = {
  ready: {
    label: "READY",
    badgeCls: "border-teal/40 bg-teal/12 text-teal",
  },
  in_service: {
    label: "IN SERVICE",
    badgeCls: "border-accent/40 bg-accent/12 text-accent",
  },
  scheduled: {
    label: "SCHEDULED",
    badgeCls: "border-accent/30 bg-accent/10 text-accent",
  },
};

function getStatus(status: string) {
  return (
    statusConfig[status] ?? {
      label: status.toUpperCase(),
      badgeCls: "border-accent/20 bg-accent/8 text-secondary",
    }
  );
}

// Known multi-word brands
const BRANDS = ["Rolls-Royce", "Bentley", "Ferrari", "Lamborghini", "Aston Martin", "McLaren", "Porsche", "Mercedes", "BMW", "Audi"];

function splitVehicleName(name: string): { brand: string; model: string } {
  for (const brand of BRANDS) {
    if (name.startsWith(brand)) {
      return { brand, model: name.slice(brand.length).trim() };
    }
  }
  const idx = name.indexOf(" ");
  if (idx === -1) return { brand: name, model: "" };
  return { brand: name.slice(0, idx), model: name.slice(idx + 1) };
}

type MemberVehicleRowProps = {
  vehicle: MemberVehicleItem;
};

export function MemberVehicleRow({ vehicle }: MemberVehicleRowProps) {
  const st = getStatus(vehicle.status);
  const { brand, model } = splitVehicleName(vehicle.name);

  return (
    <div className="group flex overflow-hidden rounded-2xl border border-accent/10 card-view transition-all duration-200 hover:border-accent/20">

      {/* Left — Image block */}
      <div className="relative h-[110px] w-[120px] shrink-0 overflow-hidden bg-elevated sm:h-[130px] sm:w-[175px]">
        {vehicle.imageUrl ? (
          <img
            src={vehicle.imageUrl}
            alt={vehicle.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const img = e.currentTarget;
              img.style.display = "none";
              const placeholder = img.nextElementSibling as HTMLElement | null;
              if (placeholder) placeholder.style.display = "flex";
            }}
          />
        ) : null}
        {/* Placeholder — shown when no image or image fails to load */}
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2"
          style={{ display: vehicle.imageUrl ? "none" : "flex" }}
        >
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden>
            <rect width="38" height="38" rx="8" fill="rgba(197,160,89,0.06)" />
            <path d="M9 25H10.5L11.5 22H26.5L27.5 25H29" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M9 25H29V27.5H9Z" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="13" cy="27.5" r="1.2" fill="var(--muted)" />
            <circle cx="25" cy="27.5" r="1.2" fill="var(--muted)" />
            <path d="M11.5 22L13 17H25L26.5 22" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 17V15M19 17V14M23 17V15" stroke="var(--muted)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          </svg>
          <span className="font-roboto text-[8px] tracking-[0.1em] text-secondary/40 uppercase">No Image</span>
        </div>

        {/* Status badge — overlaid on bottom-left of image */}
        <div className="absolute bottom-2.5 left-2.5">
          <div className={`flex items-center gap-1 rounded-full border px-2 py-0.5 backdrop-blur-sm ${st.badgeCls}`}>
            <span className="size-1 shrink-0 rounded-full bg-current" />
            <span className="font-roboto text-[8px] font-bold tracking-[0.1em]">
              {st.label}
            </span>
          </div>
        </div>
      </div>

      {/* Right — Content */}
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-4">

        {/* Vehicle info */}
        <div className="flex-1 space-y-2 min-w-0 sm:space-y-2.5">
          {/* Name — Brand white, Model gold */}
          <div>
            <h3 className="font-copperplate text-[12px] leading-snug tracking-[0.04em] text-foreground sm:text-[13px]">
              {brand}{" "}
              <span className="text-accent">{model}</span>
            </h3>
            <p className="font-Roboto mt-0.5 truncate text-[9px] tracking-[0.1em] text-secondary/70 uppercase">
              {[vehicle.year, vehicle.engine, vehicle.bay].filter(Boolean).join(" · ")}
            </p>
          </div>

          {/* Metrics — wrap on small, row on sm+ */}
          <div className="flex flex-wrap items-start gap-x-5 gap-y-2 sm:gap-8">
            {/* Col 1 */}
            {vehicle.odometer && (
              <div>
                <p className="font-roboto text-[8px] tracking-[0.12em] text-secondary/50 uppercase">Odometer</p>
                <p className="font-roboto mt-0.5 text-[12px] text-foreground sm:text-[13px]">{vehicle.odometer}</p>
              </div>
            )}
            {vehicle.returns && (
              <div>
                <p className="font-roboto text-[8px] tracking-[0.12em] text-secondary/50 uppercase">Returns</p>
                <p className="font-roboto mt-0.5 text-[12px] text-foreground sm:text-[13px]">{vehicle.returns}</p>
              </div>
            )}

            {/* Col 2 */}
            {vehicle.inspected && (
              <div>
                <p className="font-roboto text-[8px] tracking-[0.12em] text-secondary/50 uppercase">Inspected</p>
                <p className="font-roboto mt-0.5 text-[12px] text-foreground sm:text-[13px]">{vehicle.inspected}</p>
              </div>
            )}
            {vehicle.engineer && (
              <div>
                <p className="font-roboto text-[8px] tracking-[0.12em] text-secondary/50 uppercase">Engineer</p>
                <p className="font-roboto mt-0.5 text-[12px] text-foreground sm:text-[13px]">{vehicle.engineer}</p>
              </div>
            )}
          </div>
        </div>

        {/* DETAILS button */}
        <Link
          href={`/member/garage/${vehicle.id}`}
          className="shrink-0 self-end flex items-center gap-1.5 rounded-full border border-accent/22 px-3 py-1.5 transition-all hover:border-accent/40 hover:bg-accent/5 sm:self-auto sm:px-4 sm:py-2"
        >
          <span className="font-roboto text-[9px] font-semibold tracking-[0.16em] text-accent uppercase">
            Details
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M3.5 2L7 5L3.5 8"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-accent"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
