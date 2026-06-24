export function MemberProfileCard() {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-full bg-gradient-to-b from-[#F0C566] to-[#8B6F2A] font-medium uppercase text-dark">
          M
        </span>
        <div className="space-y-0.5 uppercase">
          <h2 className="font-roboto text-sm font-medium tracking-[0.06em] text-foreground">
            Al Mansoori
          </h2>
          <p className="font-roboto text-xs tracking-[0.06em] text-secondary">
            Founding Member
          </p>
        </div>
      </div>
      <span className="size-2 rounded-full bg-teal shadow-[0_0_10px_rgba(125,191,160,0.5)]" />
    </div>
  );
}
