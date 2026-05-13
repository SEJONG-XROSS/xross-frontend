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
    bgClass: "bg-[rgba(0,188,125,0.1)]",
    borderClass: "border-[rgba(0,188,125,0.2)]",
  },
  unpaid: {
    label: "미결제 의심",
    icon: ShieldAlertIcon,
    textClass: "text-[#fb2c36]",
    bgClass: "bg-[rgba(251,44,54,0.1)]",
    borderClass: "border-[rgba(251,44,54,0.2)]",
  },
  mismatch: {
    label: "장바구니 불일치",
    icon: TriangleAlertIcon,
    textClass: "text-event-warning",
    bgClass: "bg-[rgba(254,154,0,0.1)]",
    borderClass: "border-[rgba(254,154,0,0.2)]",
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
      className={`inline-flex items-center gap-[6px] rounded-[5px] border px-[8px] py-[3px] text-[12px] leading-[18px] font-medium ${config.textClass} ${config.bgClass} ${config.borderClass}`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {config.label}
    </span>
  );
}
