"use client";

import { useEffect, useState } from "react";
import { HelpFaqChevron } from "@/components/common/Svgs";
import type { HelpFaqItem } from "./mockData";

type HelpFaqSectionProps = {
  items: HelpFaqItem[];
  searchQuery?: string;
};

export function HelpFaqSection({
  items,
  searchQuery = "",
}: HelpFaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    setOpenId(items[0]?.id ?? null);
  }, [items, searchQuery]);

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <h2 className="font-copperplate text-[22px] tracking-[0.04em] uppercase">
          <span className="text-foreground">Frequently </span>
          <span className="text-primary">Asked</span>
        </h2>
        <p className="font-roboto text-[11px] tracking-[0.16em] text-secondary uppercase">
          Most-read questions
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className={`member-page-card overflow-hidden rounded-xl ${
                isOpen ? "member-page-card--active" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-roboto text-[14px] tracking-[0.02em] text-foreground">
                  {item.question}
                </span>
                <span className="text-accent">
                  <HelpFaqChevron open={isOpen} stroke="currentColor" />
                </span>
              </button>

              {isOpen && item.answer ? (
                <div className="member-page-card-divider border-t px-5 py-4">
                  <p className="font-roboto text-[13px] leading-relaxed tracking-[0.02em] text-muted">
                    {item.answer}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
