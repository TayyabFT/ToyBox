type MemberSectionEmptyProps = {
  title: string;
  description?: string;
};

export function MemberSectionEmpty({ title, description }: MemberSectionEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-accent/20 bg-card px-6 py-10 text-center">
      <p className="font-copperplate text-[13px] tracking-[0.06em] text-foreground uppercase">
        {title}
      </p>
      {description && (
        <p className="font-roboto max-w-xs text-[11px] leading-relaxed text-secondary/75">
          {description}
        </p>
      )}
    </div>
  );
}
