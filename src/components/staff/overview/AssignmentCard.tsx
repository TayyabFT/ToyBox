import type { OverviewAssignment } from "./types";

type AssignmentCardProps = {
  assignment: OverviewAssignment;
};

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const isActive = assignment.shiftStatus.toLowerCase().includes("active");

  return (
    <div className="rounded-2xl border border-teal/18 bg-teal/4 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="size-2 rounded-full bg-teal shadow-[var(--shadow-glow-teal)]" />
        <p className="font-roboto text-[10px] tracking-[0.12em] text-teal uppercase">
          Your Assignment
        </p>
      </div>

      <h4 className="font-copperplate text-[28px] leading-tight text-foreground">
        {assignment.bay}
      </h4>

      <div className="mt-3 space-y-1.5 font-roboto text-[11px] tracking-[0.04em]">
        <p className="text-secondary">{assignment.location}</p>
        <p className="text-muted">
          Vehicle:{" "}
          <span className="text-foreground">{assignment.vehicle}</span>
        </p>
        <p className="text-muted">
          Shift Status:{" "}
          <span className={isActive ? "text-teal" : "text-secondary"}>
            {assignment.shiftStatus}
          </span>
        </p>
      </div>
    </div>
  );
}
