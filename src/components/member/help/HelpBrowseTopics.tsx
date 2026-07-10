import {
  HelpTopicBilling,
  HelpTopicEvents,
  HelpTopicMembership,
  HelpTopicVehicles,
} from "@/components/common/Svgs";
import type { HelpTopic } from "./mockData";

const topicIcons = {
  vehicles: HelpTopicVehicles,
  events: HelpTopicEvents,
  billing: HelpTopicBilling,
  membership: HelpTopicMembership,
} as const;

type HelpBrowseTopicsProps = {
  topics: HelpTopic[];
};

export function HelpBrowseTopics({ topics }: HelpBrowseTopicsProps) {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <h2 className="font-copperplate text-[22px] tracking-[0.04em] uppercase">
          <span className="text-foreground">Browse </span>
          <span className="text-primary">Topics</span>
        </h2>
        <p className="font-roboto text-[11px] tracking-[0.16em] text-secondary uppercase">
          35 articles across 4 categories
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {topics.map((topic) => {
          const Icon = topicIcons[topic.id as keyof typeof topicIcons];

          return (
            <button
              key={topic.id}
              type="button"
              className="member-page-card flex cursor-pointer items-center gap-4 rounded-2xl p-6 text-left"
            >
              <span className="member-page-icon-box flex size-12 shrink-0 items-center justify-center rounded-xl">
                <Icon stroke="currentColor" className="size-5" />
              </span>

              <span className="min-w-0 space-y-0.5">
                <span className="font-roboto block text-xs font-semibold tracking-[0.12em] text-foreground uppercase">
                  {topic.title}
                </span>
                <span className="font-roboto block text-[11px] tracking-[0.1em] text-secondary uppercase">
                  {topic.articleCount} articles
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
