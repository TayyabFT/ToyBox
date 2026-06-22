export type ResourceId = string | number;

/** Normalize API resource IDs (numeric or UUID) to a string for URLs and bodies. */
export function toResourceId(value: ResourceId | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

export function hasResourceId(
  value: ResourceId | null | undefined,
): value is ResourceId {
  return toResourceId(value) !== "";
}

/** Sort IDs newest-first for numeric IDs, otherwise lexicographic descending. */
export function compareResourceIdsDesc(
  left: ResourceId,
  right: ResourceId,
): number {
  const leftText = String(left);
  const rightText = String(right);
  const leftNumber = Number(leftText);
  const rightNumber = Number(rightText);

  if (
    /^\d+$/.test(leftText) &&
    /^\d+$/.test(rightText) &&
    !Number.isNaN(leftNumber) &&
    !Number.isNaN(rightNumber)
  ) {
    return rightNumber - leftNumber;
  }

  return rightText.localeCompare(leftText);
}
