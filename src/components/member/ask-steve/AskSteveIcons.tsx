import {
  AskStevePromptActivity,
  AskStevePromptAcquisition,
  AskStevePromptAdvisory,
  AskStevePromptDrive,
  AskStevePromptRecommendations,
  AskStevePromptVehicles,
  AskSteveSuggestionArrow,
} from "@/components/common/Svgs";
import type { AskSteveSuggestion } from "./mockData";

const icons = {
  activity: AskStevePromptActivity,
  drive: AskStevePromptDrive,
  acquisition: AskStevePromptAcquisition,
  recommendations: AskStevePromptRecommendations,
  vehicles: AskStevePromptVehicles,
  advisory: AskStevePromptAdvisory,
} as const;

export function AskSteveSuggestionIcon({
  icon,
}: {
  icon: AskSteveSuggestion["icon"];
}) {
  const Icon = icons[icon];
  return <Icon stroke="currentColor" />;
}

export function AskSteveArrowIcon() {
  return <AskSteveSuggestionArrow stroke="currentColor" />;
}

export function AskSteveSendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13.5 2.5L2.5 7.25L6.75 8.75L8.25 13L13.5 2.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 8.75L13.5 2.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
