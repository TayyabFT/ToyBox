import { TermsSectionPanel } from "./TermsSectionPanel";
import { termsSectionsContent } from "./termsContent";
import type { TermsSectionId } from "./mockData";

type TermsContentSectionProps = {
  sectionId: TermsSectionId;
};

export function TermsContentSection({ sectionId }: TermsContentSectionProps) {
  return <TermsSectionPanel content={termsSectionsContent[sectionId]} />;
}
