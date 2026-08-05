import Link from "next/link";
import type { MemberVehicleItem } from "@/components/member/dashboard/types";
import { resolveAssetUrl } from "@/lib/resolveAssetUrl";

const statusConfig: Record<string, { label: string; badgeCls: string; dotCls?: string }> = {
  ready: {
    label: "READY",
    badgeCls: "border-teal/60 bg-black/60 text-teal",
    dotCls: "bg-teal",
  },
  in_service: {
    label: "IN SERVICE",
    badgeCls: "border-accent/60 bg-black/60 text-accent",
    dotCls: "bg-accent",
  },
  scheduled: {
    label: "SCHEDULED",
    badgeCls: "border-accent/60 bg-black/60 text-accent",
    dotCls: "bg-accent",
  },
  stored: {
    label: "STORED",
    badgeCls: "border-accent/50 bg-black/60 text-accent",
    dotCls: "bg-accent",
  },
  away: {
    label: "AWAY",
    badgeCls: "border-accent/50 bg-black/60 text-accent",
    dotCls: "bg-accent",
  },
  in_review: {
    label: "IN REVIEW",
    badgeCls: "border-pink/60 bg-black/60 text-pink",
    dotCls: "bg-pink",
  },
};

function getStatus(status: string) {
  return (
    statusConfig[status] ?? {
      label: status.toUpperCase(),
      badgeCls: "border-accent/20 bg-dark/70 text-secondary",
      dotCls: "bg-secondary",
    }
  );
}

// Known multi-word brands — order matters (longer first)
const BRANDS = [
  "Rolls-Royce",
  "Aston Martin",
  "Lamborghini",
  "Mercedes-Benz",
  "Mercedes",
  "McLaren",
  "Bentley",
  "Ferrari",
  "Porsche",
  "BMW",
  "Audi",
];

function splitVehicleName(name: string): { brand: string; model: string } {
  for (const brand of BRANDS) {
    if (name.toLowerCase().startsWith(brand.toLowerCase())) {
      return { brand: name.slice(0, brand.length).trim(), model: name.slice(brand.length).trim() };
    }
  }
  const idx = name.indexOf(" ");
  if (idx === -1) return { brand: name, model: "" };
  return { brand: name.slice(0, idx), model: name.slice(idx + 1) };
}

function formatOdometerDisplay(val?: string): string | undefined {
  if (!val) return undefined;
  const trimmed = val.trim();
  if (!trimmed || trimmed.toLowerCase() === "details") return undefined;

  // If numeric string like "8150"
  if (/^\d+$/.test(trimmed)) {
    return `${Number(trimmed).toLocaleString("en-US")} mi`;
  }

  // If string starts with digits like "8150 mi"
  const match = trimmed.match(/^(\d+)(\s*.*)$/);
  if (match) {
    const num = Number(match[1]).toLocaleString("en-US");
    const unit = match[2].trim() || "mi";
    return `${num} ${unit}`;
  }

  return trimmed;
}

type MemberVehicleRowProps = {
  vehicle: MemberVehicleItem;
};

export function MemberVehicleRow({ vehicle }: MemberVehicleRowProps) {
  const st = getStatus(vehicle.status);
  const { brand, model } = splitVehicleName(vehicle.name);

  const subInfo = [vehicle.year, vehicle.engine, vehicle.bay]
    .filter(Boolean)
    .join(" · ");

  const odometerFormatted = formatOdometerDisplay(vehicle.odometer);
  const inspectedVal = vehicle.inspected || vehicle.lastService;
  const inspectedLabel = vehicle.inspected
    ? "INSPECTED"
    : vehicle.lastService
    ? "LAST SERVICE"
    : null;

  return (
    <div className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-accent/15 bg-card transition-all duration-200 hover:border-accent/30 h-[160px]">

      {/* ── Image ── */}
      <div className="relative shrink-0 w-[180px] h-full overflow-hidden bg-surface">

        {/* Image or placeholder */}
        {vehicle.imageUrl ? (
          <img
            src={resolveAssetUrl(vehicle.imageUrl)}
            alt={vehicle.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const img = e.currentTarget;
              img.style.display = "none";
              const ph = img.nextElementSibling as HTMLElement | null;
              if (ph) ph.style.display = "flex";
            }}
          />
        ) : null}

        {/* Placeholder */}
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-1.5 min-h-[120px]"
          style={{ display: vehicle.imageUrl ? "none" : "flex" }}
        >
          <svg width="36" height="36" viewBox="0 0 38 38" fill="none" aria-hidden>
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

        {/* Status badge — top-left overlay */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <div
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-[5px] backdrop-blur-md ${st.badgeCls}`}
          >
            <span className={`size-[5px] shrink-0 rounded-full ${st.dotCls ?? "bg-current"}`} />
            <span className="font-roboto text-[9px] font-bold tracking-[0.14em]">
              {st.label}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 min-w-0">

        {/* Top: Vehicle Name & Subtitle */}
        <div>
          <h3 className="font-copperplate text-[15px] sm:text-[16px] leading-tight tracking-[0.05em] text-foreground uppercase">
            {brand}{" "}
            <span className="text-foreground">{model}</span>
          </h3>
          {subInfo && (
            <p className="font-roboto mt-1 text-[9.5px] sm:text-[10px] tracking-[0.12em] text-secondary/70 uppercase">
              {subInfo}
            </p>
          )}
        </div>

        {/* Divider line (as highlighted in Figma design) */}
        <div className="my-3 h-[1px] w-full bg-accent/15" />

        {/* Bottom: Metrics & Details button */}
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Metrics */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            {odometerFormatted && (
              <div>
                <p className="font-roboto text-[8.5px] font-semibold tracking-[0.14em] text-secondary/50 uppercase">
                  Odometer
                </p>
                <p className="font-roboto mt-0.5 text-[13px] sm:text-[14px] font-medium text-foreground tracking-wide">
                  {odometerFormatted}
                </p>
              </div>
            )}
            {inspectedVal && (
              <div>
                <p className="font-roboto text-[8.5px] font-semibold tracking-[0.14em] text-secondary/50 uppercase">
                  {inspectedLabel}
                </p>
                <p className="font-roboto mt-0.5 text-[13px] sm:text-[14px] font-medium text-foreground tracking-wide">
                  {inspectedVal}
                </p>
              </div>
            )}
            {vehicle.returns && (
              <div>
                <p className="font-roboto text-[8.5px] font-semibold tracking-[0.14em] text-secondary/50 uppercase">
                  Returns
                </p>
                <p className="font-roboto mt-0.5 text-[13px] sm:text-[14px] font-medium text-foreground tracking-wide">
                  {vehicle.returns}
                </p>
              </div>
            )}
            {vehicle.engineer && (
              <div>
                <p className="font-roboto text-[8.5px] font-semibold tracking-[0.14em] text-secondary/50 uppercase">
                  Engineer
                </p>
                <p className="font-roboto mt-0.5 text-[13px] sm:text-[14px] font-medium text-foreground tracking-wide">
                  {vehicle.engineer}
                </p>
              </div>
            )}
          </div>

          {/* Details button — bottom right aligned */}
          <Link
            href={`/member/garage/${vehicle.id}`}
            className="shrink-0 flex items-center gap-2 rounded-full border border-accent/35 px-4 py-1.5 transition-all duration-200 hover:border-accent hover:bg-accent/10"
          >
            <span className="font-roboto text-[9.5px] font-semibold tracking-[0.18em] text-accent uppercase">
              Details
            </span>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
              <path
                d="M2.5 1.5L5.5 4L2.5 6.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-accent"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
