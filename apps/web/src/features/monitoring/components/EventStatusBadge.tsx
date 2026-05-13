import { cn } from "@/shared/lib/utils";
import type { EventTagType } from "@/features/monitoring/types/monitoring.types";

const TAG_STYLES: Record<
  EventTagType,
  { text: string; bg: string; border: string }
> = {
  "ai-pick": {
    text: "text-event-safe",
    bg: "bg-[rgba(0,188,125,0.1)]",
    border: "border-[rgba(0,188,125,0.2)]",
  },
  sensor: {
    text: "text-event-safe",
    bg: "bg-[rgba(0,188,125,0.1)]",
    border: "border-[rgba(0,188,125,0.2)]",
  },
  "pos-mismatch": {
    text: "text-event-critical",
    bg: "bg-[rgba(251,44,54,0.1)]",
    border: "border-[rgba(251,44,54,0.2)]",
  },
  "pos-pending": {
    text: "text-event-warning",
    bg: "bg-[rgba(254,154,0,0.1)]",
    border: "border-[rgba(254,154,0,0.2)]",
  },
  "pos-match": {
    text: "text-event-safe",
    bg: "bg-[rgba(0,188,125,0.1)]",
    border: "border-[rgba(0,188,125,0.2)]",
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
        "rounded-[4px] border px-[6px] py-[3px] font-mono text-[9px] leading-[13.5px]",
        style.text,
        style.bg,
        style.border,
      )}
    >
      {label}
    </span>
  );
}
