export type TermsCard = {
  title: string;
  subtitle: string;
};

export type TermsSubsection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  bulletVariant?: "default" | "data-field";
  footerParagraphs?: string[];
};

export type TermsSectionContent = {
  heading: string;
  paragraphs?: string[];
  subsections?: TermsSubsection[];
  cards?: TermsCard[];
};

export const termsLastUpdated = "Toybox Terms of Service & Privacy Policy";

export const termsNavItems = [
  { id: "introduction", label: "Introduction" },
  { id: "your-account", label: "Your account" },
  { id: "services-payments", label: "Services & payments" },
  { id: "responsibilities", label: "Responsibilities" },
  { id: "intellectual-property", label: "Intellectual property" },
  { id: "liability-termination", label: "Liability & termination" },
  { id: "changes-law", label: "Changes & law" },
  { id: "contact", label: "Contact" },
  { id: "privacy-policy", label: "Privacy policy" },
] as const;

export type TermsSectionId = (typeof termsNavItems)[number]["id"];
