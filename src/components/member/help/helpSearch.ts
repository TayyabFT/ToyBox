import type { HelpFaqItem, HelpTopic } from "./mockData";

export function normalizeHelpSearchQuery(query: string) {
  return query.trim().toLowerCase();
}

function matchesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query);
}

export function filterHelpTopics(topics: HelpTopic[], query: string) {
  if (!query) return topics;

  return topics.filter(
    (topic) =>
      matchesQuery(topic.title, query) || matchesQuery(topic.id, query),
  );
}

export function filterHelpFaqItems(items: HelpFaqItem[], query: string) {
  if (!query) return items;

  return items.filter(
    (item) =>
      matchesQuery(item.question, query) ||
      (item.answer ? matchesQuery(item.answer, query) : false),
  );
}
