import { Search } from "@/components/common/Svgs";

type SidebarSearchProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export function SidebarSearch({ value = "", onChange }: SidebarSearchProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 [&_svg]:size-4">
        <Search />
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder="Search..."
        className="font-roboto w-full rounded-xl border border-accent/10 bg-card py-2.5 pr-4 pl-10 text-[13px] tracking-[0.02em] text-foreground placeholder:text-secondary/70 focus:border-accent/25 focus:outline-none"
      />
    </div>
  );
}
