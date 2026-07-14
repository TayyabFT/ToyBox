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
  meeting: "text-secondary",
};

const dotClass: Record<StaffShiftStatus, string> = {
  online: "bg-teal",
  active: "bg-teal",
  meeting: "bg-accent",
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
      ? "border-avatar-purple/40 bg-elevated text-avatar-purple"
      : "border-accent/40 bg-elevated text-accent";

  const dotColor = avatarTone === "purple" ? "bg-avatar-purple" : dotClass[status];

  const statusTextClass =
    avatarTone === "purple" ? "text-avatar-purple" : statusClass[status];

  return (
    <div className="flex items-center gap-3 border-b border-[var(--overview-border)] py-4 transition-colors last:border-b-0 hover:bg-elevated">
      <div className="relative shrink-0">
        <span
          className={`font-roboto flex size-10 items-center justify-center rounded-full border text-[12px] font-semibold uppercase ${avatarClass}`}
        >
          {initial}
        </span>
        <span
          className={`absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-card ${dotColor}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className={overviewRowTitleClass}>{name}</p>
        <p className={overviewRowMetaClass}>{role}</p>
      </div>

      <div className="shrink-0 text-right">
        <p
          className={`font-roboto text-[11px] font-medium tracking-[0.04em] pr-6 ${statusTextClass}`}
        >
          {statusLabel[status]}
        </p>
        <p className="font-roboto text-[10px] tracking-[0.04em] text-secondary">
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
