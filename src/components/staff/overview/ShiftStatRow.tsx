type ShiftStatRowProps = {
  label: string;
  value: string;
};

export function ShiftStatRow({ label, value }: ShiftStatRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#D4A8470A] py-3 last:border-b-0">
      <span className="font-roboto text-[13px] tracking-[0.04em] text-[#B8AE96]">
        {label}
      </span>
      <span className="font-roboto text-[11px] font-medium tracking-[0.04em] text-[#F2EAD5]">
        {value}
      </span>
    </div>
  );
}
