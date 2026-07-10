export function RequestFieldLabel({ children }: { children: string }) {
  return (
    <p className="font-roboto text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
      {children}
    </p>
  );
}

export function RequestRadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        selected ? "border-primary" : "border-secondary/40"
      }`}
    >
      {selected ? <span className="size-2.5 rounded-full bg-primary" /> : null}
    </span>
  );
}
