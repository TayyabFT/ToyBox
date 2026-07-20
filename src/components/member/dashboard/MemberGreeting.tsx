type MemberGreetingProps = {
  memberName: string;
  sublabel?: string;
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function MemberGreeting({ memberName, sublabel }: MemberGreetingProps) {
  const firstName = getFirstName(memberName);

  return (
    <div className="space-y-1">
      {sublabel && (
        <p className="font-Roboto text-[10px] tracking-[0.18em] text-primary uppercase">
          {/* {sublabel} */}
          Welcome back
        </p>
      )}
      {/* Figma: ~32px Copperplate, white + gold first name */}
      <h1 className="font-copperplate text-[20px] sm:text-[26px] md:text-[32px] leading-[1.2] tracking-[0.03em] uppercase">
        <span className="text-foreground">{getGreeting()}, </span>
        <span className="text-accent">{firstName}.</span>
      </h1>
    </div>
  );
}
