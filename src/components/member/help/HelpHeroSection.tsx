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
    <section className="member-page-hero rounded-3xl px-8 py-14">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <h2 className="font-copperplate text-[28px] leading-tight tracking-[0.04em] text-foreground uppercase">
          <span>How may we </span>
          <span className="text-primary">assist</span>
          ?
        </h2>

        <p className="font-roboto mx-auto max-w-xl text-center text-[13px] leading-relaxed tracking-[0.02em] text-secondary">
          Search our articles, contact your dedicated team, or message James
          directly. Founding Members enjoy priority response times.
        </p>

        <label className="relative mt-2 w-full max-w-xl">
          <span className="sr-only">Search articles, FAQs, topics</span>
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-accent">
            <HelpSearch stroke="currentColor" />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search articles, FAQs, topics..."
            className="member-page-input font-roboto w-full rounded-xl py-3.5 pr-5 pl-11 text-[13px] tracking-[0.02em] placeholder:text-secondary/70 focus:outline-none"
          />
        </label>
      </div>
    </section>
  );
}
