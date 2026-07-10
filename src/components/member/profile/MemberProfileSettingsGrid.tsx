"use client";

import { useEffect, useState } from "react";
import { MemberProfileSettingsIcon } from "./MemberProfileSettingsIcons";
import { MemberProfileSettingsToggle } from "./MemberProfileSettingsToggle";
import type {
  MemberProfileDetailField,
  MemberProfileSettingsAction,
  MemberProfileSettingsItem,
  MemberProfileSettingsSection,
} from "./types";

function SettingsChevron({ open }: { open?: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={`shrink-0 text-accent/50 transition-transform ${
        open ? "rotate-90" : ""
      }`}
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
  expanded,
  canExpand,
}: {
  action: MemberProfileSettingsAction;
  itemId: string;
  toggleEnabled: boolean;
  onToggle: (id: string, enabled: boolean) => void;
  expanded: boolean;
  canExpand: boolean;
}) {
  if (action.type === "link") {
    return <SettingsChevron open={expanded} />;
  }

  if (action.type === "status") {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <span className="font-roboto text-[10px] font-semibold tracking-[0.1em] text-accent uppercase">
          {action.value}
        </span>
        {canExpand ? <SettingsChevron open={expanded} /> : null}
      </div>
    );
  }

  return (
    <div
      className="shrink-0"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <MemberProfileSettingsToggle
        enabled={toggleEnabled}
        onChange={(enabled) => onToggle(itemId, enabled)}
      />
    </div>
  );
}

function SettingsDetailPanel({
  fields,
  expanded,
}: {
  fields: MemberProfileDetailField[];
  expanded: boolean;
}) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
        expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <div className="mx-4 mb-4 rounded-xl border border-accent/12 bg-elevated px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          {fields.map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between gap-4 border-b border-accent/8 py-3 last:border-b-0"
            >
              <span className="font-roboto inline-flex items-center gap-2 text-[10px] tracking-[0.1em] text-secondary uppercase">
                <span className="size-1 shrink-0 rounded-full bg-accent/60" />
                {field.label}
              </span>
              <span className="font-roboto max-w-[58%] text-right text-[11.5px] font-medium tracking-[0.02em] text-foreground">
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsRow({
  item,
  toggleEnabled,
  onToggle,
  expanded,
  onExpand,
}: {
  item: MemberProfileSettingsItem;
  toggleEnabled: boolean;
  onToggle: (id: string, enabled: boolean) => void;
  expanded: boolean;
  onExpand: (id: string) => void;
}) {
  const canExpand = Boolean(item.detailFields?.length);
  const isInteractive = canExpand;

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
        expanded={expanded}
        canExpand={canExpand}
      />
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={() => onExpand(item.id)}
        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-1 py-3.5 text-left transition-colors ${
          expanded ? "bg-accent/8" : "hover:bg-accent/5"
        }`}
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
  openItemId,
  onExpand,
}: {
  section: MemberProfileSettingsSection;
  toggleState: Record<string, boolean>;
  onToggle: (id: string, enabled: boolean) => void;
  openItemId: string | null;
  onExpand: (id: string) => void;
}) {
  return (
    <section className="space-y-2">
      <h2 className="font-roboto px-1 text-[10px] font-medium tracking-[0.18em] text-section-label uppercase">
        {section.title}
      </h2>

      <div className="overflow-hidden rounded-2xl border border-accent/12 bg-card">
        {section.items.map((item, index) => {
          const expanded = openItemId === item.id;

          return (
            <div
              key={item.id}
              className={index > 0 ? "border-t border-accent/8" : ""}
            >
              <div className="px-4 py-1">
                <SettingsRow
                  item={item}
                  toggleEnabled={
                    item.action.type === "toggle"
                      ? toggleState[item.id]
                      : false
                  }
                  onToggle={onToggle}
                  expanded={expanded}
                  onExpand={onExpand}
                />
              </div>

              {item.detailFields?.length ? (
                <SettingsDetailPanel
                  fields={item.detailFields}
                  expanded={expanded}
                />
              ) : null}
            </div>
          );
        })}
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
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  useEffect(() => {
    setToggleState(buildInitialToggleState(sections));
  }, [sections]);

  function handleToggle(id: string, enabled: boolean) {
    setToggleState((current) => ({ ...current, [id]: enabled }));
  }

  function handleExpand(id: string) {
    setOpenItemId((current) => (current === id ? null : id));
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {sections.map((section) => (
        <SettingsSectionCard
          key={section.id}
          section={section}
          toggleState={toggleState}
          onToggle={handleToggle}
          openItemId={openItemId}
          onExpand={handleExpand}
        />
      ))}
    </div>
  );
}
