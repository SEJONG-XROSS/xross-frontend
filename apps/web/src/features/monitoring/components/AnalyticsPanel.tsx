import ChartAnalyticsIcon from "@/assets/icons/chart-analytics.svg?react";
import AnalyticsChart from "@/features/monitoring/components/AnalyticsChart";
import type { AnalyticsDataPoint } from "@/features/monitoring/types/monitoring.types";
import { cn } from "@/shared/lib/utils";

interface AnalyticsStat {
  label: string;
  value: string;
  variant?: "default" | "danger" | "success";
}

interface AnalyticsPanelProps {
  stats: AnalyticsStat[];
  chartData: AnalyticsDataPoint[];
  /** 모바일 탭에서 독립 뷰로 표시될 때 true */
  standalone?: boolean;
}

const STAT_VALUE_COLOR = {
  default: "text-white",
  danger: "text-event-critical",
  success: "text-monitor-accent-green",
};

export default function AnalyticsPanel({
  stats,
  chartData,
  standalone,
}: AnalyticsPanelProps) {
  return (
    <div
      className={cn(
        "border-monitor-border bg-monitor-bg flex flex-col px-4 pt-4",
        standalone ? "pb-4" : "shrink-0 border-t",
      )}
    >
      {/* 헤더 */}
      <div className="shrink-0 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-monitor-text-muted flex items-center gap-[6px]">
          <ChartAnalyticsIcon className="h-5 w-5 shrink-0" />
          <span className="text-[12px] leading-4 font-bold tracking-[1.2px] uppercase">
            매장 행동 분석 통계 (금일)
          </span>
        </div>

        {/* 통계 수치 */}
        <div className="flex flex-wrap items-start gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "flex flex-col items-end",
                i > 0 && "border-monitor-border-strong border-l pl-4 sm:pl-6",
              )}
            >
              <span className="text-monitor-text-dim font-mono text-[11px] leading-[16.5px]">
                {stat.label}
              </span>
              <span
                className={cn(
                  "font-mono text-[14px] leading-5 font-bold",
                  STAT_VALUE_COLOR[stat.variant ?? "default"],
                )}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 차트 — standalone일 때 적절한 높이, 아닐 때 고정 높이 */}
      <div className="mt-3 min-w-0">
        <AnalyticsChart data={chartData} height={standalone ? 240 : 132} />
      </div>
    </div>
  );
}
