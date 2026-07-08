export function ConciergeGreeting() {
  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-3">
      <p className="font-roboto text-xs tracking-[0.14em] text-primary uppercase">
        {dateLabel}
      </p>
      <h1 className="font-copperplate text-[32px] leading-tight">
        <span className="text-foreground">Concierge </span>
        <span className="text-primary">Desk</span>
      </h1>
    </div>
  );
}
