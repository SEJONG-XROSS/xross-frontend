import ReceiptIcon from "@/assets/icons/receipt.svg?react";
import CheckCircleIcon from "@/assets/icons/check-circle.svg?react";
import ShieldAlertIcon from "@/assets/icons/shield-alert.svg?react";
import TriangleAlertIcon from "@/assets/icons/triangle-alert.svg?react";
import type { PosSummaryStats } from "@/features/pos/types/pos.types";

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  sub: string;
  accentClass: string;
  borderClass: string;
  bgClass: string;
}

function SummaryCard({
  icon,
  title,
  value,
  sub,
  accentClass,
  borderClass,
  bgClass,
}: SummaryCardProps) {
  return (
    <div
      className={`flex flex-col gap-0 rounded-xl border px-3 py-3 sm:px-[17px] sm:py-[17px] ${borderClass} ${bgClass}`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[12px] leading-4 font-medium ${accentClass}`}>
          {title}
        </span>
        <span className={`flex h-4 w-4 shrink-0 items-center justify-center ${accentClass}`}>
          {icon}
        </span>
      </div>
      <div className="mt-[9px]">
        <span className="text-monitor-text text-[16px] leading-6 font-bold tracking-[-0.3px] sm:text-[22px] sm:leading-7">
          {value}
        </span>
      </div>
      <div className="mt-[6px]">
        <span className="text-monitor-text-dim text-[11px] leading-[17px]">
          {sub}
        </span>
      </div>
    </div>
  );
}

interface PosSummaryCardsProps {
  stats: PosSummaryStats;
}

export default function PosSummaryCards({ stats }: PosSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      <SummaryCard
        icon={<ReceiptIcon className="h-full w-full" aria-hidden />}
        title="총 거래"
        value={`${stats.totalCount}건`}
        sub="필터 기간 내"
        accentClass="text-monitor-accent-blue"
        borderClass="border-[rgba(81,162,255,0.25)]"
        bgClass="bg-[rgba(81,162,255,0.08)]"
      />
      <SummaryCard
        icon={<CheckCircleIcon className="h-full w-full" aria-hidden />}
        title="정상 결제"
        value={`${stats.normalCount}건`}
        sub="교차 검증 완료"
        accentClass="text-monitor-accent-green"
        borderClass="border-[rgba(0,212,146,0.25)]"
        bgClass="bg-[rgba(0,212,146,0.08)]"
      />
      <SummaryCard
        icon={<ShieldAlertIcon className="h-full w-full" aria-hidden />}
        title="미결제 의심"
        value={`${stats.unpaidCount}건`}
        sub="결제 기록 없음"
        accentClass="text-event-critical"
        borderClass="border-[rgba(255,100,103,0.25)]"
        bgClass="bg-[rgba(255,100,103,0.08)]"
      />
      <SummaryCard
        icon={<TriangleAlertIcon className="h-full w-full" aria-hidden />}
        title="장바구니 불일치"
        value={`${stats.mismatchCount}건`}
        sub="수량·품목 불일치"
        accentClass="text-event-warning"
        borderClass="border-[rgba(254,154,0,0.25)]"
        bgClass="bg-[rgba(254,154,0,0.08)]"
      />
    </div>
  );
}
