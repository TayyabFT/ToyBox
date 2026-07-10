"use client";

import { useState } from "react";
import { termsSectionComponents } from "./sectionRegistry";
import { TermsOnThisPageNav } from "./TermsOnThisPageNav";
import { TermsPrivacyPageHeader } from "./TermsPrivacyPageHeader";
import type { TermsSectionId } from "./mockData";

export function TermsPrivacyPage() {
  const [activeId, setActiveId] = useState<TermsSectionId>("introduction");
  const ActiveSection = termsSectionComponents[activeId];

  return (
    <div className="p-8">
      <div className="mb-10 lg:hidden">
        <TermsOnThisPageNav activeId={activeId} onSelect={setActiveId} />
      </div>

      <aside className="fixed top-[104px] left-[372px] z-20 hidden w-60 lg:block">
        <TermsOnThisPageNav activeId={activeId} onSelect={setActiveId} />
      </aside>

      <div className="lg:ml-[280px]">
        <div className="space-y-10">
          <TermsPrivacyPageHeader />
          <ActiveSection />
        </div>
      </div>
    </div>
  );
}
