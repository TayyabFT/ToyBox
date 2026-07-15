import type { MemberDesignation } from "@/types/api";

export const VALIDITY_MONTHS_OPTIONS = [6, 12, 24, 36] as const;

export type ValidityMonths = (typeof VALIDITY_MONTHS_OPTIONS)[number];

export const MEMBER_DESIGNATION_OPTIONS: {
  label: string;
  value: MemberDesignation;
}[] = [
  { label: "Access Member", value: "access" },
  { label: "Private Member", value: "private" },
  { label: "Principle Member", value: "principal" },
  { label: "Black Card Member", value: "black_card" },
];

export const DEFAULT_MEMBER_DESIGNATION: MemberDesignation = "black_card";
export const DEFAULT_VALIDITY_MONTHS: ValidityMonths = 12;

export function formatValidityMonthsLabel(months: number): string {
  return `${months} Months`;
}

export const validityMonthDropdownOptions = VALIDITY_MONTHS_OPTIONS.map(
  (months) => ({
    label: formatValidityMonthsLabel(months),
    value: String(months),
  }),
);
