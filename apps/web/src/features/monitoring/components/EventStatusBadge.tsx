import { cn } from "@xross/core";
import type { EventTagType } from "@/features/monitoring/types/monitoring.types";

const TAG_STYLES: Record<
  EventTagType,
  { text: string; bg: string; border: string }
> = {
  "ai-pick": {
    text: "text-event-safe",
    bg: "bg-event-safe/10",
    border: "border-event-safe/20",
  },
  sensor: {
    text: "text-event-safe",
    bg: "bg-event-safe/10",
    border: "border-event-safe/20",
  },
  "pos-mismatch": {
    text: "text-event-critical",
    bg: "bg-event-critical/10",
    border: "border-event-critical/20",
  },
  "pos-pending": {
    text: "text-event-warning",
    bg: "bg-event-warning/10",
    border: "border-event-warning/20",
  },
  "pos-match": {
    text: "text-event-safe",
    bg: "bg-event-safe/10",
    border: "border-event-safe/20",
  },
};

interface EventStatusBadgeProps {
  type: EventTagType;
  label: string;
}

export default function EventStatusBadge({ type, label }: EventStatusBadgeProps) {
  const style = TAG_STYLES[type];
  return (
    <span
      className={cn(
        "rounded-badge border px-[6px] py-[3px] font-mono text-10",
        style.text,
        style.bg,
        style.border,
      )}
    >
      {label}
    </span>
  );
}
