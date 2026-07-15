export const memberRequestModalOverlayClass =
  "fixed inset-0 z-50 flex items-center justify-center p-4";

export const memberRequestModalBackdropClass =
  "absolute inset-0 bg-black/60 backdrop-blur-sm";

export const memberRequestModalPanelClass =
  "relative z-10 flex max-h-[92vh] w-full max-w-[500px] flex-col overflow-hidden rounded-[28px] border border-accent/20 bg-background shadow-[var(--shadow-modal)]";

export const memberRequestModalHeaderClass =
  "relative shrink-0 border-b border-accent/10 px-6 pb-5 pt-6";

export const memberRequestModalBodyClass =
  "Custom__Scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5";

export const memberRequestModalFooterClass =
  "shrink-0 border-t border-accent/10 px-6 py-5";

export const memberRequestModalCloseClass =
  "absolute right-5 top-5 cursor-pointer text-secondary transition-colors hover:text-foreground";

export const memberRequestModalPrimaryButtonClass =
  "font-roboto flex flex-1 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-gold-bright to-primary py-3.5 text-[13px] font-bold tracking-[0.08em] text-dark";

export const memberRequestModalPrimaryButtonFullClass =
  `${memberRequestModalPrimaryButtonClass} w-full flex-none`;

export const memberRequestModalSecondaryButtonClass =
  "font-roboto flex flex-1 cursor-pointer items-center justify-center rounded-2xl border border-accent/25 bg-surface py-3.5 text-sm font-bold tracking-[0.08em] text-foreground transition-colors hover:border-primary/40 hover:text-primary";
