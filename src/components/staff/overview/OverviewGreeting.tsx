import {
  formatStaffDisplayDate,
  getStaffShiftLabel,
} from "@/lib/staffShift";

type OverviewGreetingProps = {
  displayDate: string;
  shiftLabel: string;
  staffName: string;
  timeRemainingLabel?: string;
};

function buildGreeting(staffName: string): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatStaffName(name: string): string {
  const trimmed = name.trim();
  const [first] = trimmed.split(/\s+/);

  return first || trimmed;
}

export function OverviewGreeting({
  staffName,
  timeRemainingLabel,
}: OverviewGreetingProps) {
  const firstName = formatStaffName(staffName);
  const dateLabel = formatStaffDisplayDate();
  const shiftLabel = getStaffShiftLabel();
  const meta = timeRemainingLabel
    ? `${dateLabel} · ${shiftLabel} · ${timeRemainingLabel} left`
    : `${dateLabel} · ${shiftLabel}`;

  return (
    <div className="space-y-3">
      <p className="font-roboto text-xs tracking-[0.14em] text-primary uppercase">
        {meta}
      </p>
      <h1 className="font-copperplate text-[32px] leading-tight">
        <span className="text-foreground-soft">{buildGreeting(staffName)}, </span>
        <span className="text-primary">{firstName}.</span>
      </h1>
    </div>
  );
}
