import { overviewRowMetaClass, overviewRowTitleClass } from "./panelStyles";

type StaffShiftStatus = "online" | "active" | "meeting";

export type StaffOnShiftRowData = {
  initial: string;
  name: string;
  role: string;
  status: StaffShiftStatus;
  meta: string;
  avatarTone?: "gold" | "purple";
};

const statusLabel: Record<StaffShiftStatus, string> = {
  online: "Online",
  active: "Active",
  meeting: "Meeting",
};

const statusClass: Record<StaffShiftStatus, string> = {
  online: "text-teal",
  active: "text-teal",
  meeting: "text-[#6B665E]",
};

const dotClass: Record<StaffShiftStatus, string> = {
  online: "bg-teal",
  active: "bg-teal",
  meeting: "bg-[#C5A059]",
};

export function StaffOnShiftItem({
  initial,
  name,
  role,
  status,
  meta,
  avatarTone = "gold",
}: StaffOnShiftRowData) {
  const avatarClass =
    avatarTone === "purple"
      ? "border-[#9E8AD4]/40 bg-[#1C1917] text-[#9E8AD4]"
      : "border-[#D4AF37]/40 bg-[#1C1917] text-[#D4AF37]";

  const dotColor = avatarTone === "purple" ? "bg-[#9E8AD4]" : dotClass[status];

  const statusTextClass =
    avatarTone === "purple" ? "text-[#9E8AD4]" : statusClass[status];

  return (
    <div className="flex items-center gap-3 border-b border-white/5 py-4 transition-colors last:border-b-0 hover:bg-[#1A1A1A]">
      <div className="relative shrink-0">
        <span
          className={`font-roboto flex size-10 items-center justify-center rounded-full border text-[12px] font-semibold uppercase ${avatarClass}`}
        >
          {initial}
        </span>
        <span
          className={`absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-[#11100c] ${dotColor}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className={overviewRowTitleClass}>{name}</p>
        <p className={overviewRowMetaClass}>{role}</p>
      </div>

      <div className="shrink-0 text-right">
        <p
          className={`font-roboto text-[11px] font-medium tracking-[0.04em] ${statusTextClass}`}
        >
          {statusLabel[status]}
        </p>
        <p className="font-roboto text-[10px] tracking-[0.04em] text-[#6B665E]">
          {meta}
        </p>
      </div>
    </div>
  );
}

export function StaffOnShiftList({ rows }: { rows: StaffOnShiftRowData[] }) {
  return (
    <div>
      {rows.map((row) => (
        <StaffOnShiftItem key={row.name} {...row} />
      ))}
    </div>
  );
}
