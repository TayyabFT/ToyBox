import {
  formatStaffDisplayDate,
  getStaffShiftLabel,
} from "@/lib/staffShift";

type StaffShiftMetaProps = {
  split?: boolean;
};

export function StaffShiftMeta({ split = false }: StaffShiftMetaProps) {
  const dateLabel = formatStaffDisplayDate();
  const shiftLabel = getStaffShiftLabel();

  if (split) {
    return (
      <p className="font-roboto text-xs tracking-[0.14em] uppercase">
        <span className="text-foreground">{dateLabel} · </span>
        <span className="text-primary">{shiftLabel}</span>
      </p>
    );
  }

  return (
    <p className="font-roboto text-xs tracking-[0.14em] text-primary uppercase">
      {dateLabel} · {shiftLabel}
    </p>
  );
}
