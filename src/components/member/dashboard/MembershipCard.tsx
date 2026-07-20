import { useTheme } from "@/components/common/ThemeProvider";
import Image from "next/image";


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
  const [firstName, ...rest] = memberName.trim().split(/\s+/);
  const lastName = rest.join(" ");
  const { theme } = useTheme();
  const isLight = theme === "light";

  /* ── Light mode card ─────────────────────────────────────────────────
   * Figma: flat warm-clay surface, no gold border, all text dark
   */
  if (isLight) {
    return (
      <div
        className="w-full rounded-[20px] border border-foreground/10 overflow-hidden"
        style={{
          aspectRatio: "642 / 405",
          maxHeight: "405px",
          background:
            "radial-gradient(ellipse at 60% 30%, #e8e3d8 0%, #cdc8bc 55%, #c2bdb1 100%)",
        }}
      >
        <div className="relative flex h-full w-full flex-col justify-between px-5 py-5 sm:px-8 sm:py-6">
          {/* Top */}
          <div className="flex items-center justify-between">
            <Image
              src="/images/lightlogo.png"
              alt="Toy Box"
              width={100}
              height={50}
              className="h-9 w-auto sm:h-14"
            />
          </div>

          {/* Name — both words dark, no gold split */}
          <div className="py-1 sm:py-2">
            <h2
              className="font-copperplate uppercase leading-tight tracking-[0.04em] text-[clamp(18px,6vw,35px)]"
              style={{ color: "#1a1816" }}
            >
              {firstName} {lastName}
            </h2>
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between gap-2">
            <div className="space-y-1 min-w-0">
              <p
                className="font-roboto text-[8px] sm:text-[9px] tracking-[0.22em] uppercase"
                style={{ color: "rgba(26,24,22,0.45)" }}
              >
                Member
              </p>
              <p
                className="font-roboto text-[11px] sm:text-[15px] tracking-[0.06em] truncate"
                style={{ color: "rgba(26,24,22,0.70)" }}
              >
                {memberNumber}
              </p>
            </div>
            <div className="space-y-1 text-right shrink-0">
              <p
                className="font-roboto text-[8px] sm:text-[9px] tracking-[0.22em] uppercase"
                style={{ color: "rgba(26,24,22,0.45)" }}
              >
                Founding
              </p>
              <p
                className="font-roboto text-[11px] sm:text-[15px] tracking-[0.06em]"
                style={{ color: "rgba(26,24,22,0.70)" }}
              >
                {validityDate ?? memberSince}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Dark mode card ──────────────────────────────────────────────────
   * Gold gradient border (padding trick) + dark radial surface
   */
  return (
    <div
      className="w-full rounded-[20px] p-[5px]"
      style={{
        background:
          "linear-gradient(145deg, #C9A84C 0%, #8B6F2A 28%, #3a2e1a 50%, #8B6F2A 72%, #C9A84C 100%)",
        aspectRatio: "642 / 405",
        maxHeight: "405px",
      }}
    >
      <div
        className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[16px] px-5 py-5 sm:px-8 sm:py-6"
        style={{
          background:
            "radial-gradient(ellipse at 18% 60%, #1e1810 0%, #141009 45%, #0d0b07 100%)",
        }}
      >
        {/* Top */}
        <div className="flex items-center justify-between">
          <Image
            src="/images/logo.png"
            alt="Toy Box"
            width={100}
            height={50}
            className="h-9 w-auto sm:h-14"
          />
        </div>

        {/* Name — first white, last gold */}
        <div className="py-1 sm:py-2">
          <h2
            className="font-copperplate uppercase leading-tight tracking-[0.04em] text-[clamp(18px,6vw,35px)]"
          >
            <span style={{ color: "#EDE4CE" }}>{firstName} </span>
            <span style={{ color: "#C9A84C" }}>{lastName}</span>
          </h2>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <p
              className="font-roboto text-[8px] sm:text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "rgba(201,168,76,0.55)" }}
            >
              Member
            </p>
            <p
              className="font-roboto text-[11px] sm:text-[15px] tracking-[0.06em] truncate"
              style={{ color: "rgba(237,228,206,0.75)" }}
            >
              {memberNumber}
            </p>
          </div>
          <div className="space-y-1 text-right shrink-0">
            <p
              className="font-roboto text-[8px] sm:text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "rgba(201,168,76,0.55)" }}
            >
              Founding
            </p>
            <p
              className="font-roboto text-[11px] sm:text-[15px] tracking-[0.06em]"
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
