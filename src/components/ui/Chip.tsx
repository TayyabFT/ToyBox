//
// ── Chip ──────────────────────────────────────────────────────────────────────
//
// Single shared primitive for every chip / pill / tag / badge in the product.
//
// Design decisions
// ────────────────────────────────────────────────────────────────────────────
//  • All colours are expressed via CSS custom properties so they flip
//    automatically between dark and light themes — zero JS theme checks.
//
//  • Three visual contexts:
//    "inline"    – standard tinted pill, lives inside card bodies or lists.
//    "overlay"   – glass pill overlaid on an image (dark backdrop + blur).
//    "subtle"    – barely-there tag for secondary metadata (year, specs…).
//
//  • Three shapes:
//    "pill"  – rounded-full  (status, category, count badges)
//    "tag"   – rounded-md    (spec strips, FEATURED labels, feed tags)
//    "label" – rounded       (very tight micro-badges: "Latest", tier)
//
//  • Seven colour tones (all values pulled from CSS vars):
//    gold | teal | pink | info | purple | neutral | ghost
//
//  • Optional dot    – size-1.5 circle before the label
//  • Optional icon   – arbitrary ReactNode slot (replaces dot when provided)
//  • Optional count  – appended after label, slightly muted
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChipContext = "inline" | "overlay" | "subtle";
export type ChipShape  = "pill" | "tag" | "label";
export type ChipTone   =
  | "gold"    // accent / primary warm gold
  | "teal"    // success / active / ready
  | "pink"    // error / overdue / urgent
  | "info"    // in-review / vehicle-blue
  | "purple"  // track-repairs / quiet
  | "neutral" // generic dark-glass (overlay) or muted (inline)
  | "ghost";  // barely-visible secondary metadata

// ─── Class maps ───────────────────────────────────────────────────────────────

// Padding per shape
const SHAPE_PAD: Record<ChipShape, string> = {
  pill:  "px-2.5 py-1",
  tag:   "px-2   py-1",
  label: "px-1.5 py-0.5",
};

// Border-radius per shape
const SHAPE_RADIUS: Record<ChipShape, string> = {
  pill:  "rounded-full",
  tag:   "rounded-md",
  label: "rounded",
};

// Font size per shape (labels and tags are tighter)
const SHAPE_TEXT: Record<ChipShape, string> = {
  pill:  "text-[9px]",
  tag:   "text-[9px]",
  label: "text-[8px]",
};

// ── Inline tones ──────────────────────────────────────────────────────────────
// Standard tinted pill that sits inside card bodies or list rows.
// Uses CSS vars so dark/light themes both work without overrides.
const INLINE_TONE: Record<ChipTone, string> = {
  gold:    "border border-accent/30 bg-accent/10  text-accent",
  teal:    "border border-teal/30   bg-teal/10    text-teal",
  pink:    "border border-pink/30   bg-pink/10    text-pink",
  info:    "border border-info/30   bg-info/10    text-info",
  purple:  "border border-[color:var(--tag-purple)]/30 bg-[color:var(--tag-purple)]/10 text-[color:var(--tag-purple)]",
  neutral: "border border-secondary/25 bg-elevated text-secondary",
  ghost:   "border border-accent/15 bg-elevated   text-foreground/60",
};

// ── Overlay tones ─────────────────────────────────────────────────────────────
// Dark glass pill placed on top of images.  Always readable in both themes
// because the dark scrim beneath the text is explicit (not theme-adaptive).
const OVERLAY_TONE: Record<ChipTone, string> = {
  gold:    "border border-accent/50  bg-black/70  text-accent  backdrop-blur-sm",
  teal:    "border border-teal/45    bg-black/70  text-teal    backdrop-blur-sm",
  pink:    "border border-pink/45    bg-black/70  text-pink    backdrop-blur-sm",
  info:    "border border-info/40    bg-black/70  text-info    backdrop-blur-sm",
  purple:  "border border-[color:var(--tag-purple)]/40 bg-black/70 text-[color:var(--tag-purple)] backdrop-blur-sm",
  neutral: "border border-white/15   bg-black/75  text-white/85 backdrop-blur-sm",
  ghost:   "border border-white/10   bg-black/65  text-white/70 backdrop-blur-sm",
};

// ── Subtle tones ──────────────────────────────────────────────────────────────
// Near-invisible tags for secondary metadata (year chip, spec strip, etc.)
const SUBTLE_TONE: Record<ChipTone, string> = {
  gold:    "border border-accent/20 bg-elevated text-foreground/60",
  teal:    "border border-teal/20   bg-elevated text-foreground/60",
  pink:    "border border-pink/20   bg-elevated text-foreground/60",
  info:    "border border-info/20   bg-elevated text-foreground/60",
  purple:  "border border-[color:var(--tag-purple)]/20 bg-elevated text-foreground/60",
  neutral: "border border-accent/15 bg-elevated text-foreground/55",
  ghost:   "border border-accent/10 bg-elevated text-foreground/45",
};

const CONTEXT_MAP: Record<ChipContext, Record<ChipTone, string>> = {
  inline:  INLINE_TONE,
  overlay: OVERLAY_TONE,
  subtle:  SUBTLE_TONE,
};

// Dot colour per tone (used when showDot=true)
const DOT_TONE: Record<ChipTone, string> = {
  gold:    "bg-accent",
  teal:    "bg-teal",
  pink:    "bg-pink",
  info:    "bg-info",
  purple:  "bg-[color:var(--tag-purple)]",
  neutral: "bg-secondary",
  ghost:   "bg-foreground/40",
};

// ─── Component ────────────────────────────────────────────────────────────────

export type ChipProps = {
  /** Text label shown inside the chip */
  label: string;
  /** Visual context — where the chip lives */
  context?: ChipContext;
  /** Colour tone */
  tone?: ChipTone;
  /** Border-radius + padding variant */
  shape?: ChipShape;
  /** Show a small coloured dot before the label */
  showDot?: boolean;
  /** Arbitrary icon/SVG node — replaces the dot when provided */
  icon?: ReactNode;
  /** Count appended after label (muted, slightly smaller) */
  count?: number | string;
  /** Extra Tailwind classes — mainly for absolute positioning by the caller */
  className?: string;
};

export function Chip({
  label,
  context  = "inline",
  tone     = "gold",
  shape    = "pill",
  showDot  = false,
  icon,
  count,
  className = "",
}: ChipProps) {
  const toneClass   = CONTEXT_MAP[context][tone];
  const padClass    = SHAPE_PAD[shape];
  const radiusClass = SHAPE_RADIUS[shape];
  const textClass   = SHAPE_TEXT[shape];
  const dotClass    = DOT_TONE[tone];

  return (
    <span
      className={[
        "font-roboto inline-flex items-center gap-1.5 select-none",
        "font-semibold tracking-[0.12em] uppercase",
        radiusClass,
        padClass,
        textClass,
        toneClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Leading icon OR dot */}
      {icon ? (
        <span className="shrink-0 flex items-center">{icon}</span>
      ) : showDot ? (
        <span className={`size-1.5 shrink-0 rounded-full ${dotClass}`} />
      ) : null}

      {/* Label */}
      {label}

      {/* Optional trailing count */}
      {count != null && (
        <span className="ml-0.5 text-[0.85em] opacity-60">{count}</span>
      )}
    </span>
  );
}
