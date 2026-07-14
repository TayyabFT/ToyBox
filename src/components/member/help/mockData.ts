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
    answer:
      "Founding Member is our highest membership tier. It includes priority vehicle storage and retrieval, first access to curated drives and private events, dedicated concierge support, preferred Clubhouse reservations, and early access to new services. Your membership card and dashboard reflect your tier status, and your concierge team can walk you through any benefits specific to your account.",
  },
  {
    id: "add-vehicle",
    question: "How do I add a new vehicle to my collection?",
    answer:
      "Go to Garage from your dashboard or sidebar, then choose Vehicle Sourcing to submit a new acquisition request. Share the make, model, and any preferences you have — our team will source options, coordinate inspections, and guide you through onboarding once the vehicle is approved. After it is added, it will appear in Your Collection with documents, health status, and service history.",
  },
  {
    id: "clubhouse-guest",
    question: "Can I bring a guest to the Clubhouse?",
    answer:
      "Yes. Members may invite guests to the Clubhouse for restaurant, lounge, and suite reservations, subject to availability and the guest policy for each space. When booking, enter the number of guests in your party — the team may ask for guest names in advance for private dining or suite experiences. For larger groups or special occasions, contact Concierge and they will arrange everything with the Clubhouse team.",
  },
  {
    id: "events-curated",
    question: "How are events curated?",
    answer:
      "Events are hand-picked for members who share a passion for exceptional cars and experiences. Our team works with partners, manufacturers, and private hosts to create drives, dinners, track days, and cultural evenings that fit the Toy Box standard. Invitations appear in Your Diary and Events — RSVP early, as places are often limited. Founding Members typically receive priority access to the most exclusive listings.",
  },
  {
    id: "ask-steve",
    question: "What does Ask Steve actually do?",
    answer:
      "Ask Steve is your private in-app intelligence. You can ask about upcoming events, vehicle care, drive ideas, club services, or general questions about your membership. Steve draws on your profile and club context to give tailored answers — and can point you to Concierge when something needs a human touch. Open Ask Steve from the sidebar, type your question, and continue the conversation anytime.",
  },
];
