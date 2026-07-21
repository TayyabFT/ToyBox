"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/api/auth.api";
import { memberSourcingApi } from "@/api/memberSourcing.api";
import type { SourcingRequestRaw, MemberSourcingRequestsData } from "@/types/api";

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractRequests(data: MemberSourcingRequestsData): SourcingRequestRaw[] {
  if (Array.isArray(data)) return data as SourcingRequestRaw[];
  if ("requests" in data && Array.isArray(data.requests)) return data.requests;
  if ("items" in data && Array.isArray(data.items)) return data.items;
  if ("data" in data && Array.isArray(data.data)) return data.data;
  return [];
}

function formatBudget(min?: number, max?: number): string {
  if (!min && !max) return "";
  const fmt = (n: number) =>
    n >= 1_000_000 ? `AED ${n / 1_000_000}M` : `AED ${(n / 1000).toFixed(0)}K`;
  if (!max) return `${fmt(min!)}+`;
  return `${fmt(min!)} – ${fmt(max)}`;
}

function formatYearRange(min?: number, max?: number): string {
  if (!min && !max) return "";
  if (min === max) return String(min);
  if (!max) return `${min}+`;
  if (!min) return String(max);
  return `${min}–${max}`;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function resolveStatusLabel(status?: string): string {
  switch (status?.toLowerCase()) {
    case "in_review":
    case "in-review":
    case "review":
      return "In Review";
    case "pending":
      return "Pending";
    case "searching":
      return "Searching";
    case "offer_ready":
    case "offer-ready":
      return "Offer Ready";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "cancelled":
    case "canceled":
      return "Cancelled";
    default:
      return status ? status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Pending";
  }
}

function resolveStatusTone(status?: string): string {
  const s = status?.toLowerCase() ?? "";
  if (s.includes("complet")) return "text-teal border-teal/30 bg-teal/10";
  if (s.includes("offer") || s.includes("option")) return "text-info border-info/30 bg-info/10";
  if (s.includes("cancel")) return "text-pink border-pink/30 bg-pink/10";
  return "text-primary border-primary/30 bg-primary/10";
}

function getInitials(name?: string): string {
  if (!name) return "—";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RequestCard({ req }: { req: SourcingRequestRaw }) {
  const yearRange = formatYearRange(req.yearMin, req.yearMax);
  const budget = formatBudget(req.budgetMin, req.budgetMax);
  const tags = [yearRange, req.colour, budget].filter(Boolean) as string[];

  // The member-facing API (toSummary) does not include assignee/staff data.
  // "Toybox Concierge" is the correct static label until the backend exposes it.
  const assigneeName = "Toybox Concierge";
  const assigneeInitials = "TC";

  const matchCount = Array.isArray(req.matches) ? req.matches.length : 0;
  const assigneeNote = matchCount > 0
    ? `${matchCount} option${matchCount > 1 ? "s" : ""} ready to review`
    : "Reviewing your brief";

  const statusLabel = resolveStatusLabel(req.status);
  const statusClass = resolveStatusTone(req.status);

  return (
    <div className="rounded-2xl border border-accent/12 bg-elevated p-4 space-y-3">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-copperplate text-[15px] leading-tight text-foreground uppercase truncate">
            {req.make} {req.model}
          </p>
          <p className="font-roboto mt-0.5 text-[10px] text-secondary">
            Submitted {formatDate(req.createdAt)}
          </p>
        </div>
        <span
          className={`font-roboto shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase ${statusClass}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-roboto rounded-full border border-accent/15 px-2.5 py-1 text-[10px] text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Assignee row */}
      <div className="flex items-center justify-between gap-3 border-t border-accent/8 pt-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-roboto text-[9px] font-semibold text-primary">
            {assigneeInitials}
          </span>
          <div className="min-w-0">
            <p className="font-roboto text-[11px] font-semibold text-foreground truncate">
              {assigneeName}
            </p>
            <p className="font-roboto text-[10px] text-secondary">{assigneeNote}</p>
          </div>
        </div>

   
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0 text-secondary"
        >
          <path
            d="M2 3.5C2 2.67 2.67 2 3.5 2H12.5C13.33 2 14 2.67 14 3.5V9.5C14 10.33 13.33 11 12.5 11H5L2 14V3.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type VehicleSourcingLandingStepProps = {
  onNewRequest: () => void;
};

export function VehicleSourcingLandingStep({ onNewRequest }: VehicleSourcingLandingStepProps) {
  const [requests, setRequests] = useState<SourcingRequestRaw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const profile = await authApi.getProfile();
        const memberId = profile.data.id;

        if (!memberId) {
          setLoading(false);
          return;
        }

        const res = await memberSourcingApi.listRequests(memberId);
        if (!cancelled) setRequests(extractRequests(res.data));
      } catch {
        if (!cancelled) setRequests([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5">
      {/* Hero image */}
      <div className="relative h-[140px] sm:h-[180px] w-full overflow-hidden rounded-xl bg-elevated">
        <img
          src="/images/sourcing-hero.png"
          alt="Vehicle sourcing"
          className="h-full w-full object-cover object-center"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806cc] via-transparent to-transparent" />
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-accent/15 bg-accent/6 px-4 py-3.5">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="mt-0.5 shrink-0 text-primary"
        >
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 7v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="8" cy="5.5" r="0.75" fill="currentColor" />
        </svg>
        <p className="font-roboto text-[11px] leading-relaxed text-foreground/80">
          Our acquisition team responds within{" "}
          <span className="font-semibold text-foreground">24 hours</span> with curated
          options matched to your brief.
        </p>
      </div>

      {/* Requests list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-[120px] animate-pulse rounded-2xl bg-elevated"
            />
          ))}
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-3">
          <p className="font-roboto text-[9px] tracking-[0.18em] text-secondary uppercase">
            Your Requests
          </p>
          {requests.map((req) => (
            <RequestCard key={String(req.id)} req={req} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
