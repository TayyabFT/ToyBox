"use client";

export function MemberSidebar() {
  return (
    <aside className="sidebar flex h-full w-56 shrink-0 flex-col border-r border-white/10 bg-[#0f0f11]">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-[3px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className="size-[6px] rounded-[1px] bg-[#C9A84C]"
              />
            ))}
          </div>
          <span className="text-xs font-medium tracking-[0.3em] text-[#C9A84C]">
            TOY BOX
          </span>
        </div>
        <p className="mt-3 text-[10px] tracking-[0.15em] text-white/35 uppercase">
          Member
        </p>
      </div>
    </aside>
  );
}
