export type AskSteveSuggestion = {
  id: string;
  prompt: string;
  category: string;
  icon:
    | "activity"
    | "drive"
    | "acquisition"
    | "recommendations"
    | "vehicles"
    | "advisory";
};

export const askSteveSuggestions: AskSteveSuggestion[] = [
  {
    id: "activity",
    prompt: "Summarise my week at the club",
    category: "ACTIVITY",
    icon: "activity",
  },
  {
    id: "drive",
    prompt: "Plan a sunset drive for two",
    category: "DRIVE PLANNING",
    icon: "drive",
  },
  {
    id: "acquisition",
    prompt: "Find a 1973 911 RS for sale",
    category: "ACQUISITION",
    icon: "acquisition",
  },
  {
    id: "recommendations",
    prompt: "What events match my tastes?",
    category: "RECOMMENDATIONS",
    icon: "recommendations",
  },
  {
    id: "vehicles",
    prompt: "Compare service intervals across my cars",
    category: "VEHICLES",
    icon: "vehicles",
  },
  {
    id: "advisory",
    prompt: "Should I bid on the Ferrari 250 GTO?",
    category: "ADVISORY",
    icon: "advisory",
  },
];
