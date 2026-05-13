import { cn } from "@/shared/lib/utils";
import type { LogEntry, LogEntrySource } from "@/features/monitoring/types/monitoring.types";
import LogsIcon from "@/assets/icons/logs.svg?react";

const SOURCE_CONFIG: Record<
  LogEntrySource,
  { label: string; dotColor: string; badgeBg: string; badgeText: string }
> = {
  vision: {
    label: "Vision",
    dotColor: "var(--color-monitor-accent-blue)",
    badgeBg: "bg-monitor-accent-blue/10",
    badgeText: "text-monitor-accent-blue",
  },
  weight: {
    label: "Weight",
    dotColor: "var(--color-monitor-accent-green)",
    badgeBg: "bg-monitor-accent-green/10",
    badgeText: "text-monitor-accent-green",
  },
  pos: {
    label: "POS",
    dotColor: "var(--color-monitor-accent-purple)",
    badgeBg: "bg-monitor-accent-purple/10",
    badgeText: "text-monitor-accent-purple",
  },
  system: {
    label: "System",
    dotColor: "var(--color-monitor-border-strong)",
    badgeBg: "bg-monitor-border",
    badgeText: "text-monitor-text",
  },
};

interface EventDetailTimelineProps {
  entries: LogEntry[];
}

export default function EventDetailTimeline({
  entries,
}: EventDetailTimelineProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
      {/* 섹션 헤더 */}
      <div className="mb-6 flex items-center gap-[8px]">
        <LogsIcon className="h-4 w-4 shrink-0 text-monitor-text-dim" />
        <span className="text-[12px] font-bold uppercase tracking-[1.2px] text-monitor-text-dim">
          상세 로그 타임라인
        </span>
      </div>

      {/* 타임라인 */}
      <div className="relative">
        {/* 수직 연결선 */}
        <div className="absolute left-[11px] top-2 h-[calc(100%-40px)] w-[2px] bg-monitor-border" />

        <div className="flex flex-col gap-[24px]">
          {entries.map((entry, idx) => {
            const src = SOURCE_CONFIG[entry.source];
            const dotColor =
              entry.alert === "critical" ? "var(--color-event-critical)" :
              entry.alert === "warning"  ? "var(--color-event-warning)" :
              src.dotColor;
            const innerColor = entry.alert ? "var(--color-monitor-text)" : "var(--color-monitor-bg)";

            return (
              <div key={idx} className="flex items-start gap-4">
                {/* 타임라인 도트 */}
                <div
                  className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-4 border-monitor-bg"
                  style={{ backgroundColor: dotColor }}
                >
                  <div
                    className="h-[6px] w-[6px] rounded-full"
                    style={{ backgroundColor: innerColor }}
                  />
                </div>

                {/* 내용 */}
                <div className="flex flex-col gap-1 pt-[2px]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] leading-[15px] text-monitor-text-dim">
                      {entry.time}
                    </span>
                    <span
                      className={cn(
                        "rounded-[4px] px-[6px] py-[1.5px] font-mono text-[9px] uppercase tracking-[0.45px]",
                        src.badgeBg,
                        src.badgeText,
                      )}
                    >
                      {src.label}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-[14px] leading-[19px] tracking-[-0.15px]",
                      entry.alert === "critical" && "font-semibold text-event-critical",
                      entry.alert === "warning"  && "font-semibold text-event-warning",
                      !entry.alert && "text-monitor-text-muted",
                    )}
                  >
                    {entry.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
