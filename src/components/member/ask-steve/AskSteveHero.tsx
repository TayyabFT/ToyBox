import Image from "next/image";

type AskSteveHeroProps = {
  greeting: string;
};

export function AskSteveHero({ greeting }: AskSteveHeroProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <Image
        src="/images/ask-steve-orb.png"
        alt=""
        width={176}
        height={176}
        priority
        className="size-[160px] object-contain"
      />

      <div className="space-y-2">
        <p className="font-copperplate text-[22px] leading-tight tracking-[0.06em] text-foreground uppercase">
          {greeting}
        </p>
        <h1 className="font-copperplate text-[28px] leading-tight tracking-[0.06em] uppercase">
          <span className="text-foreground">How may I </span>
          <span className="text-primary">help</span>
          <span className="text-foreground">?</span>
        </h1>
      </div>

      <p className="font-roboto mt-6 max-w-xl text-[13px] leading-relaxed tracking-[0.02em] text-secondary">
        I'm Steve, your private intelligence. I can recommend events, find rare
        parts, plan drives, summarise your week, or help with anything in between.
      </p>
    </div>
  );
}
