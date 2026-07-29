import { HelpSearch } from "@/components/common/Svgs";

type HelpHeroSectionProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export function HelpHeroSection({
  searchQuery,
  onSearchChange,
}: HelpHeroSectionProps) {
  return (
    <section className="member-page-hero rounded-3xl px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center sm:gap-5">
        <h2 className="font-copperplate text-[22px] leading-tight tracking-[0.04em] text-foreground uppercase sm:text-[28px]">
          <span>How may we </span>
          <span className="text-primary">assist</span>
          ?
        </h2>

        <p className="font-roboto mx-auto max-w-xl text-center text-[12px] leading-relaxed tracking-[0.02em] text-secondary sm:text-[13px]">
          Search our articles, contact your dedicated team, or message James
          directly. Founding Members enjoy priority response times.
        </p>

        <label className="relative mt-1 w-full max-w-xl sm:mt-2">
          <span className="sr-only">Search articles, FAQs, topics</span>
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-accent">
            <HelpSearch stroke="currentColor" />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search articles, FAQs, topics..."
            className="member-page-input font-roboto w-full rounded-xl py-3 pr-5 pl-11 text-[12px] tracking-[0.02em] placeholder:text-secondary/70 focus:outline-none sm:py-3.5 sm:text-[13px]"
          />
        </label>
      </div>
    </section>
  );
}
