"use client";

import { useState } from "react";
import { MemberProfileSettingsIcon } from "./MemberProfileSettingsIcons";
import { MemberProfileSettingsToggle } from "./MemberProfileSettingsToggle";
import type {
  MemberProfileSettingsAction,
  MemberProfileSettingsItem,
  MemberProfileSettingsSection,
} from "./types";

function SettingsChevron() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className="shrink-0 text-accent/50"
    >
      <path
        d="M3 2L6.5 5L3 8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsRowAction({
  action,
  itemId,
  toggleEnabled,
  onToggle,
}: {
  action: MemberProfileSettingsAction;
  itemId: string;
  toggleEnabled: boolean;
  onToggle: (id: string, enabled: boolean) => void;
}) {
  if (action.type === "link") {
    return <SettingsChevron />;
  }

  if (action.type === "status") {
    return (
      <span className="font-roboto shrink-0 text-[10px] font-semibold tracking-[0.1em] text-accent uppercase">
        {action.value}
      </span>
    );
  }

  return (
    <MemberProfileSettingsToggle
      enabled={toggleEnabled}
      onChange={(enabled) => onToggle(itemId, enabled)}
    />
  );
}

function SettingsRow({
  item,
  toggleEnabled,
  onToggle,
}: {
  item: MemberProfileSettingsItem;
  toggleEnabled: boolean;
  onToggle: (id: string, enabled: boolean) => void;
}) {
  const isInteractive = item.action.type === "link";

  const content = (
    <>
      <MemberProfileSettingsIcon name={item.icon} />
      <div className="min-w-0 flex-1">
        <p className="font-roboto text-[12px] font-medium tracking-[0.04em] text-foreground">
          {item.title}
        </p>
        <p className="font-roboto mt-0.5 text-[9px] tracking-[0.1em] text-secondary uppercase">
          {item.subtitle}
        </p>
      </div>
      <SettingsRowAction
        action={item.action}
        itemId={item.id}
        toggleEnabled={toggleEnabled}
        onToggle={onToggle}
      />
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-1 py-3.5 text-left transition-colors hover:bg-accent/5"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 px-1 py-3.5">{content}</div>
  );
}

function SettingsSectionCard({
  section,
  toggleState,
  onToggle,
}: {
  section: MemberProfileSettingsSection;
  toggleState: Record<string, boolean>;
  onToggle: (id: string, enabled: boolean) => void;
}) {
  return (
    <section className="space-y-2">
      <h2 className="font-roboto px-1 text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
        {section.title}
      </h2>

      <div className="rounded-2xl border border-accent/12 bg-card px-4 py-1">
        {section.items.map((item) => (
          <SettingsRow
            key={item.id}
            item={item}
            toggleEnabled={
              item.action.type === "toggle"
                ? toggleState[item.id]
                : false
            }
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}

type MemberProfileSettingsGridProps = {
  sections: MemberProfileSettingsSection[];
};

function buildInitialToggleState(
  sections: MemberProfileSettingsSection[],
): Record<string, boolean> {
  const state: Record<string, boolean> = {};

  for (const section of sections) {
    for (const item of section.items) {
      if (item.action.type === "toggle") {
        state[item.id] = item.action.enabled;
      }
    }
  }

  return state;
}

export function MemberProfileSettingsGrid({
  sections,
}: MemberProfileSettingsGridProps) {
  const [toggleState, setToggleState] = useState(() =>
    buildInitialToggleState(sections),
  );

  function handleToggle(id: string, enabled: boolean) {
    setToggleState((current) => ({ ...current, [id]: enabled }));
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {sections.map((section) => (
        <SettingsSectionCard
          key={section.id}
          section={section}
          toggleState={toggleState}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
