type VehicleInfoGridProps = {
  name: string;
  bay: string;
  mileage: string;
  member: string;
  memberBadge?: string;
};

export function VehicleInfoGrid({
  name,
  bay,
  mileage,
  member,
  memberBadge,
}: VehicleInfoGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 border-b border-accent/10 px-5 py-5 md:grid-cols-4">
      <div className="space-y-1">
        <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
          Vehicle
        </p>
        <p className="font-copperplate text-[15px] leading-tight text-foreground">
          {name}
        </p>
      </div>

      <div className="space-y-1">
        <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
          Bay
        </p>
        <p className="font-copperplate text-[15px] leading-tight text-pink">
          {bay}
        </p>
      </div>

      <div className="space-y-1">
        <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
          Mileage
        </p>
        <p className="font-roboto text-sm text-foreground">{mileage}</p>
      </div>

      <div className="space-y-1">
        <p className="font-roboto text-[9px] tracking-[0.12em] text-secondary uppercase">
          Member
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-roboto text-sm text-foreground">{member}</p>
          {memberBadge && (
            <span className="font-roboto rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[8px] font-medium tracking-[0.08em] text-primary uppercase">
              {memberBadge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
