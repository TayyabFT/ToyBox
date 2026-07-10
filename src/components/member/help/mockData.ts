export type HelpTopic = {
  id: string;
  title: string;
  articleCount: number;
};

export type HelpFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const helpTopics: HelpTopic[] = [
  { id: "vehicles", title: "VEHICLES", articleCount: 12 },
  { id: "events", title: "EVENTS & RSVPs", articleCount: 8 },
  { id: "billing", title: "BILLING", articleCount: 6 },
  { id: "membership", title: "MEMBERSHIP", articleCount: 9 },
];

export const helpFaqItems: HelpFaqItem[] = [
  {
    id: "summon-vehicle",
    question: "How do I summon a vehicle?",
    answer:
      "Open your dashboard, select the vehicle you need, and tap the Summon icon. Your car will be prepared and brought to the collection point within 30 minutes. Climate is set to 21°C by default — adjust in vehicle preferences if needed.",
  },
  {
    id: "founding-member",
    question: "What does the Founding Member tier include?",
    answer: "",
  },
  {
    id: "add-vehicle",
    question: "How do I add a new vehicle to my collection?",
    answer: "",
  },
  {
    id: "clubhouse-guest",
    question: "Can I bring a guest to the Clubhouse?",
    answer: "",
  },
  {
    id: "events-curated",
    question: "How are events curated?",
    answer: "",
  },
  {
    id: "ask-steve",
    question: "What does Ask Steve actually do?",
    answer: "",
  },
];
