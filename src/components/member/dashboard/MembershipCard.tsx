import { ToyBoxLogoIcon } from "@/components/common/Svgs";

type MembershipCardProps = {
  memberName: string;
  memberNumber: string;
  membershipTier: string;
  memberSince: string;
  validityDate?: string; // e.g. "VALID 01/26 — 01/31"
};

export function MembershipCard({
  memberName,
  memberNumber,
  memberSince,
  validityDate,
}: MembershipCardProps) {
  // Split name into first + last, make last name gold
  const [firstName, ...rest] = memberName.trim().split(/\s+/);
  const lastName = rest.join(" ");

  return (
    /*
     * Figma specs:
     *   Width: 642px  Height: 405px  Radius: 20px  Border: 5px gold gradient
     *
     * The 5px gradient border is done with the padding-trick:
     *   - outer div: rounded-[20px] p-[5px] with gold gradient background
     *   - inner div: rounded-[16px] (20 - 5 = 15 ~ 16) dark background
     */
    <div
      className="w-full rounded-[20px] p-[5px]"
      style={{
        background:
          "linear-gradient(145deg, #C9A84C 0%, #8B6F2A 28%, #3a2e1a 50%, #8B6F2A 72%, #C9A84C 100%)",
        aspectRatio: "642 / 405",
        maxHeight: "405px",
      }}
    >
      {/* Inner dark card surface */}
      <div
        className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[16px] px-8 py-6"
        style={{
          background:
            "radial-gradient(ellipse at 18% 60%, #1e1810 0%, #141009 45%, #0d0b07 100%)",
        }}
      >
        {/* ── Top Row ──────────────────────────────────── */}
        <div className="flex items-center justify-between">
          {/* Logo mark + wordmark */}
          <div className="flex items-center gap-2.5">
            <ToyBoxLogoIcon className="size-[21px]" />
            <span
              className="font-copperplate text-[13px] tracking-[0.22em]"
              style={{ color: "#fff" }}
            >
              TOY BOX
            </span>
          </div>

          {/* NO chip in top right — Figma shows none */}
        </div>

        {/* ── Member Name ────────────────────────────────
         *  Figma: single line, first name white + last name GOLD
         */}
        <div className="py-2">
          <h2
            className="font-copperplate uppercase leading-none tracking-[0.04em]"
            style={{ fontSize: "clamp(30px, 5vw, 46px)" }}
          >
            <span style={{ color: "#EDE4CE" }}>{firstName} </span>
            <span style={{ color: "#C9A84C" }}>{lastName}</span>
          </h2>
        </div>

        {/* ── Bottom Row ───────────────────────────────── */}
        <div className="flex items-end justify-between">
          {/* Member number */}
          <div className="space-y-1">
            <p
              className="font-roboto text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "rgba(201,168,76,0.55)" }}
            >
              Member
            </p>
            <p
              className="font-roboto text-[15px] tracking-[0.06em]"
              style={{ color: "rgba(237,228,206,0.75)" }}
            >
              {memberNumber}
            </p>
          </div>

          {/* Founding + validity date OR "Since" */}
          <div className="space-y-1 text-right">
            <p
              className="font-roboto text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "rgba(201,168,76,0.55)" }}
            >
              Founding
            </p>
            <p
              className="font-roboto text-[15px] tracking-[0.06em]"
              style={{ color: "rgba(237,228,206,0.75)" }}
            >
              {validityDate ?? memberSince}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
