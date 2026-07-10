import type { ComponentType } from "react";
import type { TermsSectionId } from "./mockData";
import { termsNavItems } from "./mockData";
import { TermsContentSection } from "./TermsContentSection";

function createTermsSectionComponent(
  sectionId: TermsSectionId,
): ComponentType {
  return function TermsSection() {
    return <TermsContentSection sectionId={sectionId} />;
  };
}

export const termsSectionComponents = Object.fromEntries(
  termsNavItems.map((item) => [item.id, createTermsSectionComponent(item.id)]),
) as Record<TermsSectionId, ComponentType>;
