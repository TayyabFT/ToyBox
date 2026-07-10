import { StaffShiftMeta } from "@/components/staff/StaffShiftMeta";

export function ConfirmationsGreeting() {
  return (
    <div className="space-y-3">
      <StaffShiftMeta split />
      <h1 className="font-copperplate text-[32px] leading-tight">
        <span className="text-primary">Bookings</span>
      </h1>
    </div>
  );
}
