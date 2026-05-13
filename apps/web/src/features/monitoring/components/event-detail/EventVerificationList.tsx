import { cn } from "@/shared/lib/utils";
import type {
  VerificationItem,
  VerificationStatus,
  LogEntrySource,
} from "@/features/monitoring/types/monitoring.types";
import EyeIcon from "@/assets/icons/eye.svg?react";
import BalanceScaleIcon from "@/assets/icons/balance-scale.svg?react";
import DatabaseIcon from "@/assets/icons/database.svg?react";
import GitCompareIcon from "@/assets/icons/git-compare.svg?react";

const STATUS_LABEL: Record<VerificationStatus, string> = {
  detected: "DETECTED",
  anomaly: "ANOMALY",
  match: "MATCH",
  mismatch: "MISMATCH",
  "n/a": "N/A",
  pending: "PENDING",
};

/** mismatch는 border 강조, anomaly는 굵게 */
const STATUS_BADGE_EXTRA: Partial<Record<VerificationStatus, string>> = {
  mismatch: "border border-event-critical/20 font-bold",
  anomaly: "font-bold",
};

/**
 * source별 기본 색상.
 * status가 anomaly(warning) 또는 mismatch(critical)이면 아이콘과 detail 색이 override된다.
 */
const SOURCE_CONFIG: Record<
  LogEntrySource,
  { Icon: React.FC<React.SVGProps<SVGSVGElement>>; bg: string; color: string }
> = {
  vision: {
    Icon: EyeIcon,
    bg: "bg-monitor-accent-blue/10",
    color: "text-monitor-accent-blue",
  },
  weight: {
    Icon: BalanceScaleIcon,
    bg: "bg-monitor-accent-green/10",
    color: "text-monitor-accent-green",
  },
  pos: {
    Icon: DatabaseIcon,
    bg: "bg-monitor-accent-purple/10",
    color: "text-monitor-accent-purple",
  },
  system: {
    Icon: GitCompareIcon,
    bg: "bg-monitor-border",
    color: "text-monitor-text-muted",
  },
};

/** status에 따른 아이콘·detail 색상 오버라이드 (없으면 source 기본색 사용) */
function resolveAccentColor(
  status: VerificationStatus,
): { bg: string; color: string } | null {
  if (status === "mismatch")
    return { bg: "bg-event-critical/10", color: "text-event-critical" };
  if (status === "anomaly")
    return { bg: "bg-event-warning/10", color: "text-event-warning" };
  return null;
}

interface EventVerificationListProps {
  items: VerificationItem[];
}

export default function EventVerificationList({
  items,
}: EventVerificationListProps) {
  return (
    <div className="border-monitor-border border-b px-4 py-4 sm:px-6 sm:py-6">
      {/* 섹션 헤더 */}
      <div className="mb-4 flex items-center gap-[8px]">
        <GitCompareIcon className="text-monitor-text-dim h-4 w-4 shrink-0" />
        <span className="text-monitor-text-dim text-[12px] font-bold tracking-[1.2px] uppercase">
          시스템 교차 검증 요약
        </span>
      </div>

      {/* 검증 항목 목록 */}
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const src = SOURCE_CONFIG[item.source];
          const { Icon } = src;
          const accent = resolveAccentColor(item.status) ?? {
            bg: src.bg,
            color: src.color,
          };

          return (
            <div
              key={item.source}
              className={cn(
                "bg-monitor-card-bg flex items-start gap-3 rounded-[10px] border px-[17px] py-[17px]",
                item.status === "mismatch"
                  ? "border-event-critical/30"
                  : "border-monitor-border",
              )}
            >
              {/* 아이콘 */}
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
                  accent.bg,
                  accent.color,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* 텍스트 */}
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-monitor-text text-[14px] leading-5 font-bold tracking-[-0.15px]">
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "rounded-[4px] px-2 py-[1.5px] font-mono text-[10px] leading-[15px]",
                      accent.bg,
                      accent.color,
                      STATUS_BADGE_EXTRA[item.status],
                    )}
                  >
                    {STATUS_LABEL[item.status]}
                  </span>
                </div>
                {/* detail 텍스트 */}
                <span className={cn("text-[12px] leading-4", accent.color)}>
                  {item.detail}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
