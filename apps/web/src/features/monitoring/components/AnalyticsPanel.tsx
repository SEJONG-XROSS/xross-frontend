import { useState } from "react";
import ChartAnalyticsIcon from "@/assets/icons/chart-analytics.svg?react";
import LogsIcon from "@/assets/icons/logs.svg?react";
import AnalyticsChart from "@/features/monitoring/components/AnalyticsChart";
import type { AnalyticsDataPoint } from "@/features/monitoring/types/monitoring.types";
import { cn } from "@xross/core";

interface AnalyticsStat {
  label: string;
  value: string;
  variant?: "default" | "danger" | "success";
}

interface AnalyticsPanelProps {
  behaviorStats: AnalyticsStat[];
  paymentStats: AnalyticsStat[];
  chartData: AnalyticsDataPoint[];
  date: string;
  standalone?: boolean;
  onOpenEventLog?: () => void;
}

const STAT_VALUE_COLOR = {
  default: "text-white",
  danger: "text-event-critical",
  success: "text-monitor-accent-green",
};

const CHART_HEIGHT = {
  compact: 110,
  standalone: 180,
};

type ChartMode = "hourly" | "cumulative";

function toCumulative(data: AnalyticsDataPoint[]): AnalyticsDataPoint[] {
  let picks = 0, suspicions = 0, enters = 0, payments = 0;
  return data.map((d) => {
    picks += d.picks;
    suspicions += d.suspicions;
    enters += d.enters;
    payments += d.payments;
    return { ...d, picks, suspicions, enters, payments };
  });
}

function formatDate(dateStr: string): string {
  const today = new Date().toISOString().slice(0, 10);
  if (dateStr === today) return "금일";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function StatRow({ stats }: { stats: AnalyticsStat[] }) {
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={cn(
            "flex flex-col",
            i > 0 && "border-monitor-border-strong border-l pl-4 sm:pl-6",
          )}
        >
          <span className="text-monitor-text-dim font-mono text-11">
            {stat.label}
          </span>
          <span
            className={cn(
              "font-mono text-14 font-bold",
              STAT_VALUE_COLOR[stat.variant ?? "default"],
            )}
          >
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPanel({
  behaviorStats,
  paymentStats,
  chartData,
  date,
  standalone,
  onOpenEventLog,
}: AnalyticsPanelProps) {
  const [mode, setMode] = useState<ChartMode>("hourly");
  const chartH = standalone ? CHART_HEIGHT.standalone : CHART_HEIGHT.compact;
  const displayData = mode === "cumulative" ? toCumulative(chartData) : chartData;

  return (
    <div
      className={cn(
        "border-monitor-border bg-monitor-bg flex flex-col px-4 pt-4",
        standalone ? "pb-4" : "shrink-0 border-t",
      )}
    >
      {/* 헤더 */}
      <div className="shrink-0 flex items-center justify-between">
        <div className="text-monitor-text-muted flex items-center gap-[6px]">
          <ChartAnalyticsIcon className="h-4 w-4 shrink-0" />
          <span className="font-mono text-11 font-bold tracking-caps uppercase">
            매장 행동 분석 통계 ({formatDate(date)})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 이벤트 로그 버튼 */}
          {onOpenEventLog && (
            <button
              type="button"
              onClick={onOpenEventLog}
              className="flex items-center gap-1 rounded-md border border-monitor-border bg-monitor-card-bg px-2.5 py-1 text-10 font-semibold text-monitor-text-dim transition-colors hover:border-monitor-accent-blue/40 hover:text-monitor-accent-blue"
            >
              <LogsIcon className="h-3 w-3 shrink-0" />
              이벤트 로그
            </button>
          )}

          {/* 시간대별 / 누적 토글 */}
          <div className="flex items-center rounded-md border border-monitor-border bg-monitor-card-bg p-[3px]">
            {(["hourly", "cumulative"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "rounded px-2 py-0.5 font-mono text-10 font-semibold transition-all",
                  mode === m
                    ? "bg-monitor-accent-blue text-white"
                    : "text-monitor-text-dim hover:text-monitor-text-muted",
                )}
              >
                {m === "hourly" ? "시간대별" : "누적"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 차트 1 — Pick 행동 / 미결제 의심 */}
      <div className="mt-3 min-w-0">
        <div className="flex items-end justify-between mb-1">
          <p className="text-monitor-text-dim font-mono text-10 tracking-caps uppercase">
            Pick 행동 · 미결제 의심
          </p>
          <StatRow stats={behaviorStats} />
        </div>
        <AnalyticsChart data={displayData} height={chartH} variant="behavior" />
      </div>

      {/* 차트 2 — 총 입장 / 결제 완료 */}
      <div className="mt-3 min-w-0">
        <div className="flex items-end justify-between mb-1">
          <p className="text-monitor-text-dim font-mono text-10 tracking-caps uppercase">
            총 입장 · 결제 완료
          </p>
          <StatRow stats={paymentStats} />
        </div>
        <AnalyticsChart data={displayData} height={chartH} variant="payment" />
      </div>
    </div>
  );
}
