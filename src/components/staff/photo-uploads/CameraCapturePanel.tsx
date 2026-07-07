"use client";

import {
  CaptureModeBurst,
  CaptureModeFlash,
  CaptureModePhoto,
  CaptureModeScan,
  CaptureModeVideo,
  CaptureModeZoom,
  CaptureServiceDamageReport,
  CaptureServiceDetailing,
  CaptureServicePreService,
  CaptureServiceSignOff,
  CaptureServiceTransport,
  CaptureShutterButton,
} from "@/components/common/Svgs";
import { RecDotIcon } from "./icons";
import type { CameraContext, CaptureMode, ServiceTypeTab } from "./types";

const SERVICE_TABS: {
  id: ServiceTypeTab;
  label: string;
  icon: typeof CaptureServicePreService;
  iconClassName?: string;
}[] = [
  {
    id: "pre-service",
    label: "Pre-Service Inspection",
    icon: CaptureServicePreService,
    iconClassName: "h-2.5 w-3 shrink-0",
  },
  {
    id: "detailing",
    label: "Detailing",
    icon: CaptureServiceDetailing,
    iconClassName: "h-3 w-2.5 shrink-0",
  },
  {
    id: "transport",
    label: "Transport",
    icon: CaptureServiceTransport,
    iconClassName: "h-2 w-3.5 shrink-0",
  },
  {
    id: "damage-report",
    label: "Damage Report",
    icon: CaptureServiceDamageReport,
    iconClassName: "h-3 w-2.5 shrink-0",
  },
  {
    id: "sign-off",
    label: "Sign-Off",
    icon: CaptureServiceSignOff,
    iconClassName: "size-2.5 shrink-0",
  },
];

const CAPTURE_MODES: {
  id: CaptureMode;
  label: string;
  icon: typeof CaptureModePhoto;
}[] = [
  { id: "photo", label: "Photo", icon: CaptureModePhoto },
  { id: "video", label: "Video", icon: CaptureModeVideo },
  { id: "burst", label: "Burst", icon: CaptureModeBurst },
  { id: "zoom", label: "Zoom", icon: CaptureModeZoom },
  { id: "flash", label: "Flash", icon: CaptureModeFlash },
  { id: "scan", label: "Scan", icon: CaptureModeScan },
];

type CameraCapturePanelProps = {
  cameraContext: CameraContext;
  activeService: ServiceTypeTab;
  activeMode: CaptureMode;
  previewUrl?: string | null;
  previewZoom?: number;
  actionLoading?: boolean;
  showRecBadge?: boolean;
  onServiceChange: (tab: ServiceTypeTab) => void;
  onModeChange: (mode: CaptureMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onShutter: () => void;
};

export function CameraCapturePanel({
  cameraContext,
  activeService,
  activeMode,
  previewUrl = null,
  previewZoom = 1,
  actionLoading = false,
  showRecBadge = false,
  onServiceChange,
  onModeChange,
  onZoomIn,
  onZoomOut,
  onShutter,
}: CameraCapturePanelProps) {
  const leftModes = CAPTURE_MODES.slice(0, 3);
  const rightModes = CAPTURE_MODES.slice(3);

  return (
    <>
      <section className="">
        <div className="mb-4 space-y-2">
          <h2 className="font-copperplate text-[15px] tracking-[0.04em] uppercase">
            <span className="text-foreground">Camera </span>
            <span className="text-primary">Capture</span>
          </h2>
          <p className="font-roboto text-[11px] tracking-[0.12em] text-secondary uppercase font-semibold">
            Tap Shutter · Auto-Tagged to Active Job
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          {SERVICE_TABS.map((tab) => {
            const isActive = activeService === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onServiceChange(tab.id)}
                className={`font-roboto flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-semibold tracking-[0.08em] uppercase transition-colors ${
                  isActive
                    ? "border-primary/35 bg-primary/10 text-primary"
                    : "border-accent/15 bg-surface text-secondary hover:border-primary/25 hover:text-primary"
                }`}
              >
                <Icon
                  className={tab.iconClassName}
                  color="currentColor"
                />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative mb-5 h-[360px] overflow-hidden rounded-xl border border-accent/12 bg-dark">
          <CornerBrackets />

          {showRecBadge ? (
            <span className="font-roboto absolute right-5 top-5 z-20 flex items-center gap-1.5 rounded-full border border-[#D899994D] bg-[#D8999926] px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] text-pink uppercase">
              <RecDotIcon className="size-2 text-pink" />
              Rec
            </span>
          ) : null}

          {previewUrl ? (
            <div className="absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Capture preview"
                className="h-full w-full object-cover transition-transform duration-200"
                style={{
                  transform: `scale(${previewZoom})`,
                  transformOrigin: "center center",
                }}
                draggable={false}
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="relative size-10">
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent" />
                <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-accent" />
              </div>
            </div>
          )}

          {previewUrl ? (
            <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2">
              <button
                type="button"
                aria-label="Zoom in"
                onClick={onZoomIn}
                disabled={previewZoom >= 3}
                className="font-roboto flex size-8 cursor-pointer items-center justify-center rounded-lg border border-accent/20 bg-surface/90 text-sm font-semibold text-primary transition-colors hover:border-primary/35 disabled:cursor-not-allowed disabled:opacity-50"
              >
                +
              </button>
              <button
                type="button"
                aria-label="Zoom out"
                onClick={onZoomOut}
                disabled={previewZoom <= 1}
                className="font-roboto flex size-8 cursor-pointer items-center justify-center rounded-lg border border-accent/20 bg-surface/90 text-sm font-semibold text-primary transition-colors hover:border-primary/35 disabled:cursor-not-allowed disabled:opacity-50"
              >
                −
              </button>
            </div>
          ) : null}

          <p className="font-roboto absolute bottom-4 left-5 z-20 text-[10px] tracking-[0.1em] text-[#D4A84780] uppercase">
            {cameraContext.caption}
          </p>
        </div>
      </section>
      <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_auto_repeat(3,minmax(0,1fr))] items-center gap-2 bg-[#1A1612] px-3 py-5 rounded-xl border border-[#D4A84714]">
        {leftModes.map((mode) => (
          <CaptureModeButton
            key={mode.id}
            mode={mode}
            active={activeMode === mode.id}
            onSelect={() => onModeChange(mode.id)}
          />
        ))}

        <button
          type="button"
          aria-label={`Shutter ${activeMode}`}
          disabled={actionLoading}
          onClick={onShutter}
          className="flex size-16 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CaptureShutterButton className="size-[22px] text-dark" />
        </button>

        {rightModes.map((mode) => (
          <CaptureModeButton
            key={mode.id}
            mode={mode}
            active={activeMode === mode.id}
            onSelect={() => onModeChange(mode.id)}
          />
        ))}
      </div>
    </>
  );
}

function CaptureModeButton({
  mode,
  active,
  onSelect,
}: {
  mode: { id: CaptureMode; label: string; icon: typeof CaptureModePhoto };
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = mode.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`font-roboto flex w-full cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[9px] tracking-[0.08em] uppercase transition-colors ${
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-transparent text-secondary hover:border-[#D4A8472E] hover:bg-[#D4A84714] hover:text-[#D4A847]"
      }`}
    >
      <Icon className="size-5" color="currentColor" />
      {mode.label}
    </button>
  );
}

function CornerBrackets() {
  const corner = "absolute size-5 border-accent";

  return (
    <>
      <span className={`${corner} left-3 top-3 border-l border-t rounded-tl`} />
      <span className={`${corner} right-3 top-3 border-r border-t rounded-tr`} />
      <span className={`${corner} left-3 bottom-3 border-l border-b rounded-bl`} />
      <span className={`${corner} right-3 bottom-3 border-r border-b rounded-br`} />
    </>
  );
}
