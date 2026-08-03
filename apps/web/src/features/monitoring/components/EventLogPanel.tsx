import { useMemo, useState } from "react";
import type { AlertResponse } from "@/features/monitoring/api/monitoring.types";
import EventCard from "@/features/monitoring/components/EventCard";
import LogsIcon from "@/assets/icons/logs.svg?react";
import { cn, sortAlerts, type AlertSortKey } from "@xross/core";

interface EventLogPanelProps {
  alerts: AlertResponse[];
  connected?: boolean;
  /** 모바일 탭에서 독립 뷰로 표시될 때 true — 보더/고정폭 제거 */
  standalone?: boolean;
}

const SORT_OPTIONS: { key: AlertSortKey; label: string }[] = [
  { key: "recent", label: "최신순" },
  { key: "priority", label: "중요도순" },
];

export default function EventLogPanel({
  alerts,
  connected,
  standalone,
}: EventLogPanelProps) {
  const [sortKey, setSortKey] = useState<AlertSortKey>("recent");

  const sortedAlerts = useMemo(
    () => sortAlerts(alerts, sortKey),
    [alerts, sortKey],
  );

  const criticalCount = alerts.filter(
    (a) => a.status === "PENDING" || a.status === "SENT",
  ).length;

  return (
    <div
      className={cn(
        "bg-monitor-bg flex flex-col",
        standalone
          ? "flex-1 overflow-hidden"
          : "border-monitor-border w-full shrink-0 border-t lg:h-full lg:w-[360px] lg:border-l lg:border-t-0",
      )}
    >
      {/* 헤더 — standalone 모바일 탭에서는 탭 바가 역할을 대신하므로 숨김 */}
      {!standalone && (
        <div className="border-monitor-border bg-monitor-card-bg flex h-14 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <LogsIcon
              className="text-monitor-text-muted h-4 w-4 shrink-0"
              aria-hidden
            />
            <span className="text-monitor-text text-14 font-bold">
              실시간 탐지 로그
            </span>
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                connected ? "bg-monitor-accent-green" : "bg-monitor-text-dim",
              )}
              title={connected ? "실시간 연결됨" : "연결 중..."}
            />
          </div>
          {criticalCount > 0 && (
            <span className="text-event-critical border-event-critical/20 bg-event-critical/10 rounded-badge border px-2 py-[3px] text-10 font-bold">
              {criticalCount}건 검토 필요
            </span>
          )}
        </div>
      )}

      {/* 정렬 토글 */}
      <div
        className={cn(
          "shrink-0 px-4 py-2",
          standalone ? "" : "border-monitor-border border-b",
        )}
        role="group"
        aria-label="알림 정렬"
      >
        <div className="flex gap-1 rounded-control bg-white/5 p-1">
          {SORT_OPTIONS.map(({ key, label }) => {
            const active = sortKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSortKey(key)}
                aria-pressed={active}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-11 font-semibold transition-colors",
                  active
                    ? "bg-monitor-card-bg text-monitor-accent-blue"
                    : "text-monitor-text-dim hover:text-monitor-text-muted",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 이벤트 목록 */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {sortedAlerts.length === 0 ? (
          <div className="text-monitor-text-dim flex flex-1 items-center justify-center text-12">
            탐지된 이벤트가 없습니다.
          </div>
        ) : (
          sortedAlerts.map((alert) => (
            <EventCard key={alert.id} alert={alert} />
          ))
        )}
      </div>
    </div>
  );
}
