export function formatStaffDisplayDate(date = new Date()): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getStaffShiftLabel(date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) return "Morning Shift";
  if (hour < 17) return "Afternoon Shift";
  return "Evening Shift";
}

export function formatStaffDateShiftLine(date = new Date()): string {
  return `${formatStaffDisplayDate(date)} · ${getStaffShiftLabel(date)}`;
}
