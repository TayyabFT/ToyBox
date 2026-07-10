const EMAIL_ONLY = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const EMAIL_PREFIX = /^Email:\s*(.+)$/i;
const WEBSITE_PREFIX = /^Website:\s*(.+)$/i;
const PHONE_PREFIX = /^(Telephone|Phone):\s*(.+)$/i;

function normalizeWebsiteUrl(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function TermsParagraph({ text }: { text: string }) {
  const trimmed = text.trim();

  if (EMAIL_ONLY.test(trimmed)) {
    return (
      <p className="font-roboto text-[15px] leading-[1.85] tracking-[0.01em] text-muted">
        <a
          href={`mailto:${trimmed}`}
          className="inline-flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/8 px-3 py-2 text-primary transition-colors hover:border-accent/35 hover:bg-accent/12"
        >
          <span className="text-[10px] font-semibold tracking-[0.14em] text-secondary uppercase">
            Email
          </span>
          <span className="font-medium normal-case tracking-[0.02em]">
            {trimmed}
          </span>
        </a>
      </p>
    );
  }

  const emailMatch = trimmed.match(EMAIL_PREFIX);
  if (emailMatch) {
    const email = emailMatch[1].trim();

    return (
      <p className="font-roboto text-[15px] leading-[1.85] tracking-[0.01em] text-muted">
        <span className="text-secondary">Email: </span>
        <a
          href={`mailto:${email}`}
          className="font-medium text-primary underline decoration-accent/40 underline-offset-4"
        >
          {email}
        </a>
      </p>
    );
  }

  const websiteMatch = trimmed.match(WEBSITE_PREFIX);
  if (websiteMatch) {
    const website = websiteMatch[1].trim();

    return (
      <p className="font-roboto text-[15px] leading-[1.85] tracking-[0.01em] text-muted">
        <span className="text-secondary">Website: </span>
        <a
          href={normalizeWebsiteUrl(website)}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary underline decoration-accent/40 underline-offset-4"
        >
          {website}
        </a>
      </p>
    );
  }

  const phoneMatch = trimmed.match(PHONE_PREFIX);
  if (phoneMatch) {
    const phone = phoneMatch[2].trim();

    return (
      <p className="font-roboto text-[15px] leading-[1.85] tracking-[0.01em] text-muted">
        <span className="text-secondary">{phoneMatch[1]}: </span>
        <a
          href={`tel:${phone.replace(/\s+/g, "")}`}
          className="font-medium text-primary underline decoration-accent/40 underline-offset-4"
        >
          {phone}
        </a>
      </p>
    );
  }

  return (
    <p className="font-roboto max-w-3xl text-[15px] leading-[1.85] tracking-[0.01em] text-muted">
      {text}
    </p>
  );
}

export function TermsBullet({
  text,
  variant = "default",
}: {
  text: string;
  variant?: "default" | "data-field";
}) {
  if (variant === "data-field") {
    return (
      <li className="flex items-start gap-3">
        <span className="font-roboto mt-0.5 shrink-0 rounded-md border border-accent/18 bg-accent/8 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-primary uppercase">
          {text}
        </span>
      </li>
    );
  }

  return (
    <li className="font-roboto text-[15px] leading-[1.85] tracking-[0.01em] text-muted">
      {text}
    </li>
  );
}
