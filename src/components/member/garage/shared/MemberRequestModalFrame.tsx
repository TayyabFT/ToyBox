import type { ReactNode } from "react";
import {
  memberRequestModalBackdropClass,
  memberRequestModalBodyClass,
  memberRequestModalCloseClass,
  memberRequestModalFooterClass,
  memberRequestModalHeaderClass,
  memberRequestModalOverlayClass,
  memberRequestModalPanelClass,
} from "./memberRequestModal";

type MemberRequestModalFrameProps = {
  open: boolean;
  onClose: () => void;
  titleBefore: string;
  titleAfter: string;
  garageLabel?: string;
  headerSubtitle?: string;
  stepper?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function MemberRequestModalFrame({
  open,
  onClose,
  garageLabel,
  headerSubtitle,
  titleBefore,
  titleAfter,
  stepper,
  children,
  footer,
}: MemberRequestModalFrameProps) {
  if (!open) return null;

  return (
    <div className={memberRequestModalOverlayClass}>
      <div className={memberRequestModalBackdropClass} onClick={onClose} />

      <div className={memberRequestModalPanelClass}>
        <div className={memberRequestModalHeaderClass}>
          <button
            type="button"
            onClick={onClose}
            className={memberRequestModalCloseClass}
            aria-label="Close"
          >
            ✕
          </button>

          {garageLabel ? (
            <p className="font-roboto text-[10px] tracking-[0.18em] text-primary uppercase">
              {garageLabel}
            </p>
          ) : null}

          <h2
            className={`font-copperplate text-[20px] leading-none tracking-[0.04em] uppercase ${
              garageLabel ? "mt-1" : ""
            }`}
          >
            <span className="text-foreground-soft">{titleBefore}</span>
            <span className="text-primary">{titleAfter}</span>
          </h2>

          {headerSubtitle ? (
            <p className="font-roboto mt-2 text-[11px] font-medium tracking-[0.12em] text-primary uppercase">
              {headerSubtitle}
            </p>
          ) : null}

          {stepper ? <div className="mt-5">{stepper}</div> : null}
        </div>

        <div className={memberRequestModalBodyClass}>{children}</div>

        {footer ? (
          <div className={memberRequestModalFooterClass}>{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
