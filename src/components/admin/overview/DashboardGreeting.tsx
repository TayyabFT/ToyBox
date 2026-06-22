type DashboardGreetingProps = {
  sublabel?: string;
  greeting: string;
  name: string;
};

export function DashboardGreeting({
  sublabel = "Welcome back",
  greeting,
  name,
}: DashboardGreetingProps) {
  return (
    <div className="space-y-2">
      <p className="font-roboto text-[11px] tracking-[0.16em] text-[#6B665E] uppercase">
        {sublabel}
      </p>
      <h1 className="font-copperplate text-[36px] leading-[1.1] tracking-[0.04em] uppercase">
        <span className="text-[#E7E5E4]">{greeting}, </span>
        <span className="text-[#C5A059]">{name}</span>
      </h1>
    </div>
  );
}
