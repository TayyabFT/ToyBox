export const memberRequestModalOverlayClass =
  "fixed inset-0 z-[60] flex items-end sm:items-center justify-center m-2 sm:p-4";

export const memberRequestModalBackdropClass =
  "absolute inset-0 bg-black/70";

export const memberRequestModalPanelClass =
  "relative z-10 flex w-full max-h-[92dvh] sm:max-h-[92vh] max-w-full sm:max-w-[500px] flex-col overflow-hidden  rounded-[20px] sm:rounded-[28px] border border-accent/20 bg-background shadow-[var(--shadow-modal)]";

export const memberRequestModalHeaderClass =
  "relative shrink-0 border-b border-accent/10 px-4 sm:px-6 pb-3.5 sm:pb-5 pt-4 sm:pt-6";

export const memberRequestModalBodyClass =
  "Custom__Scrollbar min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 py-3.5 sm:py-5";

export const memberRequestModalFooterClass =
  "shrink-0 border-t border-accent/10 px-2 sm:px-6 py-3 sm:py-5";

export const memberRequestModalCloseClass =
  "absolute right-4 top-4 sm:right-5 sm:top-5 cursor-pointer text-secondary transition-colors hover:text-foreground text-[15px] sm:text-base";

export const memberRequestModalPrimaryButtonClass =
  "font-roboto flex flex-1 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-gold-bright to-primary py-3 sm:py-3.5 text-[12px] sm:text-[13px] font-bold tracking-[0.08em] text-dark";

export const memberRequestModalPrimaryButtonFullClass =
  `${memberRequestModalPrimaryButtonClass} w-full flex-none`;

export const memberRequestModalSecondaryButtonClass =
  "font-roboto flex flex-1 cursor-pointer items-center justify-center rounded-full border border-accent/25 bg-surface py-3 sm:py-3.5 text-[12px] sm:text-sm font-bold tracking-[0.08em] text-foreground transition-colors hover:border-primary/40 hover:text-primary";
