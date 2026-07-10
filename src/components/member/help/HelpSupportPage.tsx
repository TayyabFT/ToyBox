"use client";

import { useMemo, useState } from "react";
import { HelpBrowseTopics } from "./HelpBrowseTopics";
import { HelpFaqSection } from "./HelpFaqSection";
import { HelpHeroSection } from "./HelpHeroSection";
import { HelpPageHeader } from "./HelpPageHeader";
import { HelpQuickActions } from "./HelpQuickActions";
import {
  filterHelpFaqItems,
  filterHelpTopics,
  normalizeHelpSearchQuery,
} from "./helpSearch";
import { helpFaqItems, helpTopics } from "./mockData";

export function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = normalizeHelpSearchQuery(searchQuery);
  const isSearching = normalizedQuery.length > 0;

  const filteredTopics = useMemo(
    () => filterHelpTopics(helpTopics, normalizedQuery),
    [normalizedQuery],
  );

  const filteredFaqs = useMemo(
    () => filterHelpFaqItems(helpFaqItems, normalizedQuery),
    [normalizedQuery],
  );

  const showTopics = !isSearching || filteredTopics.length > 0;
  const showFaqs = !isSearching || filteredFaqs.length > 0;
  const showEmptyState =
    isSearching && filteredTopics.length === 0 && filteredFaqs.length === 0;

  return (
    <div className="space-y-8 p-8">
      <HelpPageHeader />
      <HelpHeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <HelpQuickActions />

      {showEmptyState ? (
        <p className="font-roboto text-center text-[13px] tracking-[0.02em] text-secondary">
          No articles, FAQs, or topics match your search.
        </p>
      ) : null}

      {showTopics ? <HelpBrowseTopics topics={filteredTopics} /> : null}
      {showFaqs ? (
        <HelpFaqSection items={filteredFaqs} searchQuery={normalizedQuery} />
      ) : null}
    </div>
  );
}
