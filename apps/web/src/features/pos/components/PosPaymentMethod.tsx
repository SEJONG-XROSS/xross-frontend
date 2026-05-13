import CreditCardIcon from "@/assets/icons/credit-card.svg?react";
import BanknoteIcon from "@/assets/icons/banknote.svg?react";
import SmartphoneIcon from "@/assets/icons/smartphone.svg?react";
import type { PaymentMethod } from "@/features/pos/types/pos.types";

const PAYMENT_CONFIG: Record<
  PaymentMethod,
  {
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    colorClass: string;
  }
> = {
  card: {
    label: "카드",
    icon: CreditCardIcon,
    colorClass: "text-monitor-accent-blue",
  },
  cash: {
    label: "현금",
    icon: BanknoteIcon,
    colorClass: "text-monitor-accent-green",
  },
  mobile: {
    label: "모바일",
    icon: SmartphoneIcon,
    colorClass: "text-monitor-accent-purple",
  },
  qr_code: {
    label: "QR",
    icon: SmartphoneIcon,
    colorClass: "text-monitor-accent-purple",
  },
};

interface PosPaymentMethodProps {
  method: PaymentMethod;
}

export default function PosPaymentMethod({ method }: PosPaymentMethodProps) {
  const config = PAYMENT_CONFIG[method];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-[6px] ${config.colorClass} text-[13px] leading-4`}>
      <Icon className="h-[14px] w-[14px] shrink-0" />
      <span className="text-monitor-text">{config.label}</span>
    </span>
  );
}
