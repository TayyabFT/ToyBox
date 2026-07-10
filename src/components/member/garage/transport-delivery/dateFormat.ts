const YEAR = 2025;

function resolveMonth(day: string): { monthIndex: number; monthLabel: string } {
  if (day === "30") {
    return { monthIndex: 3, monthLabel: "April" };
  }

  return { monthIndex: 4, monthLabel: "May" };
}

export function formatFullDate(day: string): string {
  const { monthIndex, monthLabel } = resolveMonth(day);
  const date = new Date(YEAR, monthIndex, Number(day));
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });

  return `${weekday}, ${day} ${monthLabel} ${YEAR}`;
}

export function formatShortDate(day: string): string {
  const { monthLabel } = resolveMonth(day);
  return `${day} ${monthLabel}`;
}
