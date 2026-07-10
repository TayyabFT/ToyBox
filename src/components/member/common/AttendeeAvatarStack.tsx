import { getNameInitials } from "@/lib/nameInitials";

const MAX_VISIBLE = 3;

type AttendeeAvatarStackProps = {
  count: number;
  names?: string[];
  initials?: string[];
  maxVisible?: number;
  sizeClassName?: string;
  ringClassName?: string;
};

export function AttendeeAvatarStack({
  count,
  names,
  initials,
  maxVisible = MAX_VISIBLE,
  sizeClassName = "size-7",
  ringClassName = "border-card",
}: AttendeeAvatarStackProps) {
  if (count <= 0) return null;

  const visibleCount = Math.min(count, maxVisible);
  const overflow = count - maxVisible;

  const resolvedInitials = Array.from({ length: visibleCount }, (_, i) => {
    if (initials?.[i]) return initials[i];
    if (names?.[i]) return getNameInitials(names[i]);
    return "?";
  });

  return (
    <div className="flex -space-x-2">
      {resolvedInitials.map((initial, i) => (
        <span
          key={i}
          className={`flex ${sizeClassName} items-center justify-center rounded-full border-2 ${ringClassName} bg-gradient-to-b from-gold-bright to-gold-deep text-[8px] font-bold text-dark`}
        >
          {initial}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={`flex ${sizeClassName} items-center justify-center rounded-full border-2 ${ringClassName} bg-gradient-to-b from-gold-bright to-gold-deep text-[8px] font-bold text-dark`}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
