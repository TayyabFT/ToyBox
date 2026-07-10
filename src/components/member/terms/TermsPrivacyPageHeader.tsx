import { termsLastUpdated } from "./mockData";

export function TermsPrivacyPageHeader() {
  return (
    <div className="space-y-2">
      <p className="font-roboto text-[11px] tracking-[0.18em] text-secondary uppercase">
        Account · Legal
      </p>
      <h1 className="font-copperplate text-[26px] leading-tight tracking-[0.04em] uppercase">
        <span className="text-foreground">Terms and </span>
        <span className="text-primary">Privacy</span>
      </h1>
      <p className="font-roboto text-[12px] tracking-[0.02em] text-secondary">
        {termsLastUpdated}
      </p>
    </div>
  );
}
