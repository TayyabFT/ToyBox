import { StaffShiftMeta } from "@/components/staff/StaffShiftMeta";

export function ClubhouseGreeting() {
  return (
    <div className="space-y-3">
      <StaffShiftMeta />
      <h1 className="font-copperplate text-[32px] leading-tight">
        <span className="text-foreground">Club </span>
        <span className="text-primary">House</span>
      </h1>
    </div>
  );
}
