import CheckCircleIcon from "@/assets/icons/check-circle.svg?react";
import ShieldAlertIcon from "@/assets/icons/shield-alert.svg?react";
import TriangleAlertIcon from "@/assets/icons/triangle-alert.svg?react";
import type { TransactionStatus } from "@/features/pos/types/pos.types";

const STATUS_CONFIG: Record<
  TransactionStatus,
  {
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    textClass: string;
    bgClass: string;
    borderClass: string;
  }
> = {
  normal: {
    label: "정상 결제",
    icon: CheckCircleIcon,
    textClass: "text-event-safe",
    bgClass: "bg-event-safe/10",
    borderClass: "border-event-safe/20",
  },
  unpaid: {
    label: "미결제 의심",
    icon: ShieldAlertIcon,
    textClass: "text-event-critical",
    bgClass: "bg-event-critical/10",
    borderClass: "border-event-critical/20",
  },
  mismatch: {
    label: "장바구니 불일치",
    icon: TriangleAlertIcon,
    textClass: "text-event-warning",
    bgClass: "bg-event-warning/10",
    borderClass: "border-event-warning/20",
  },
};

interface PosStatusBadgeProps {
  status: TransactionStatus;
}

export default function PosStatusBadge({ status }: PosStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-badge border px-2 py-[3px] text-12 font-medium whitespace-nowrap ${config.textClass} ${config.bgClass} ${config.borderClass}`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {config.label}
    </span>
  );
}
