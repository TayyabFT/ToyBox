"use client";

import { useEffect, useMemo, useState } from "react";
import { adminCommunicationsApi } from "@/api/adminCommunications.api";
import { Bell, ChevronDown, ClockSmall, Message } from "@/components/common/Svgs";
import { getAudienceReachCount } from "@/lib/communicationsAudience";
import {
  buildCreateBulletinPayload,
  validateCreateBulletinForm,
} from "@/lib/communicationsBulletinPayload";
import { showError, showSuccess } from "@/lib/toast";
import type { AudienceSegment, BulletinDraftPreview, ComposeMode } from "./types";

const COMPOSE_MODES: { id: ComposeMode; label: string }[] = [
  { id: "draft", label: "Draft" },
  { id: "bulletin", label: "Bulletin" },
  { id: "alert", label: "Alert" },
];

const CHANNELS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: "app", label: "App", icon: <Message className="size-3.5" /> },
  { id: "email", label: "Email", icon: <ChevronDown className="size-3" /> },
  { id: "push", label: "Push", icon: <Bell className="size-3.5" /> },
];

type ComposeBulletinProps = {
  audienceSegments: AudienceSegment[];
  loadingAudience?: boolean;
  onBulletinCreated?: () => void;
  onDraftChange?: (draft: BulletinDraftPreview) => void;
};

function toggleSelection<T extends string>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function chipClass(active: boolean) {
  return active
    ? "admin-gold-cta"
    : "border border-accent/25 text-accent hover:border-accent/40";
}

export function ComposeBulletin({
  audienceSegments,
  loadingAudience = false,
  onBulletinCreated,
  onDraftChange,
}: ComposeBulletinProps) {
  const [mode, setMode] = useState<ComposeMode>("bulletin");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<string[]>(["all"]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    "app",
    "email",
    "push",
  ]);
  const [submitting, setSubmitting] = useState(false);

  const reachCount = useMemo(
    () => getAudienceReachCount(audienceSegments, selectedAudience),
    [audienceSegments, selectedAudience],
  );

  useEffect(() => {
    onDraftChange?.({ title, body, mode });
  }, [title, body, mode, onDraftChange]);

  async function handleScheduleSend() {
    const validationError = validateCreateBulletinForm({
      title,
      body,
      audienceSegmentIds: selectedAudience,
      channels: selectedChannels,
    });

    if (validationError) {
      showError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const payload = buildCreateBulletinPayload({
        title,
        body,
        mode,
        audienceSegmentIds: selectedAudience,
        channels: selectedChannels,
      });

      await adminCommunicationsApi.createBulletin(payload);

      showSuccess(
        mode === "draft"
          ? "Draft saved successfully."
          : mode === "alert"
            ? "Alert scheduled successfully."
            : "Bulletin scheduled successfully.",
      );

      setTitle("");
      setBody("");
      setSelectedAudience(["all"]);
      setSelectedChannels(["app", "email", "push"]);
      setMode("bulletin");
      onBulletinCreated?.();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Failed to send bulletin.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="flex flex-col rounded-2xl border border-accent/20 bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-copperplate text-[18px] tracking-[0.04em] uppercase">
            <span className="text-foreground">Compose </span>
            <span className="text-accent">Bulletin</span>
          </h2>
          <p className="mt-1.5 font-copperplate-body text-[10px] tracking-[0.14em] text-secondary uppercase">
            Reaches {loadingAudience ? "—" : reachCount} members
          </p>
        </div>

        <div className="flex flex-nowrap items-center gap-2">
          {COMPOSE_MODES.map((item) => {
            const active = mode === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`font-copperplate-body cursor-pointer rounded-full px-4 py-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors ${chipClass(active)}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <label className="font-copperplate-body block text-[10px] tracking-[0.16em] text-secondary uppercase">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter bulletin title"
          className="font-copperplate-body w-full rounded-xl border border-accent/20 bg-input-muted px-4 py-3 text-[13px] tracking-[0.02em] text-foreground transition-colors placeholder:text-muted/50 focus:border-accent/40 focus:outline-none"
        />
      </div>

      <div className="mt-5 space-y-2">
        <label className="font-copperplate-body block text-[10px] tracking-[0.16em] text-secondary uppercase">
          Body
        </label>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={6}
          placeholder="Write your bulletin message"
          className="Custom__Scrollbar font-copperplate-body w-full resize-none rounded-xl border border-accent/20 bg-input-muted px-4 py-3 text-[13px] leading-relaxed tracking-[0.02em] text-foreground-soft transition-colors placeholder:text-muted/50 focus:border-accent/40 focus:outline-none"
        />
      </div>

      <div className="mt-5 space-y-2.5">
        <label className="font-copperplate-body block text-[10px] tracking-[0.16em] text-secondary uppercase">
          Audience
        </label>
        <div className="flex flex-wrap gap-2.5">
          {audienceSegments.map((segment) => {
            const active = selectedAudience.includes(segment.id);

            return (
              <button
                key={segment.id}
                type="button"
                onClick={() =>
                  setSelectedAudience((current) =>
                    toggleSelection(current, segment.id),
                  )
                }
                className={`font-copperplate-body inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors ${chipClass(active)}`}
              >
                {segment.label}
                <span className={active ? "opacity-80" : "text-section-label"}>
                  {loadingAudience ? "—" : segment.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-accent/20 pt-5">
        <div className="flex flex-wrap items-center gap-2.5">
          {CHANNELS.map((channel) => {
            const active = selectedChannels.includes(channel.id);

            return (
              <button
                key={channel.id}
                type="button"
                onClick={() =>
                  setSelectedChannels((current) =>
                    toggleSelection(current, channel.id),
                  )
                }
                className={`font-copperplate-body inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors [&_svg]:size-3.5 ${chipClass(active)}`}
              >
                {channel.icon}
                {channel.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => void handleScheduleSend()}
          disabled={submitting}
          className="admin-gold-cta font-copperplate-body inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-[10px] font-semibold tracking-[0.16em] uppercase disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:size-3.5"
        >
          {submitting ? "Sending..." : "Schedule Send"}
          <ClockSmall color="currentColor" />
        </button>
      </div>
    </section>
  );
}
