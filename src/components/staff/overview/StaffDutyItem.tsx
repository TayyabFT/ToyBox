type StaffDutyItemProps = {
  initial: string;
  name: string;
  role: string;
  avatarClass: string;
  statusTone: "green" | "gold";
  highlight?: boolean;
};

export function StaffDutyItem({
  initial,
  name,
  role,
  avatarClass,
  statusTone,
  highlight = false,
}: StaffDutyItemProps) {
  const statusColor = statusTone === "green" ? "bg-teal" : "bg-primary";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#D4A84712] bg-[#1A1612] p-3.5">
      <span
        className={`font-roboto flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold uppercase ${avatarClass}`}
      >
        {initial}
      </span>

      <div className="min-w-0 flex-1 space-y-0.5">
        <p
          className={`font-roboto truncate text-[13px] font-medium tracking-[0.06em] uppercase ${
            highlight ? "text-primary" : "text-foreground"
          }`}
        >
          {name}
        </p>
        <p className="font-roboto truncate text-[11px] tracking-[0.08em] font-medium text-secondary uppercase">
          {role}
        </p>
      </div>

      <span className={`size-2 shrink-0 rounded-full ${statusColor}`} />
    </div>
  );
}
