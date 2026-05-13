import type { EventDetail, EventSeverity } from "@/features/monitoring/types/monitoring.types";
import EventVerificationList from "./EventVerificationList";
import EventDetailTimeline from "./EventDetailTimeline";
import EventDetailActions from "./EventDetailActions";
import ShieldAlertIcon from "@/assets/icons/shield-alert.svg?react";
import TriangleAlertIcon from "@/assets/icons/triangle-alert.svg?react";
import EventInfoIcon from "@/assets/icons/event-info.svg?react";
import PersonStandingIcon from "@/assets/icons/person-standing.svg?react";

const SEVERITY_CONFIG: Record<
  EventSeverity,
  { Icon: React.FC<React.SVGProps<SVGSVGElement>>; iconColor: string }
> = {
  critical: { Icon: ShieldAlertIcon,    iconColor: "text-event-critical" },
  warning:  { Icon: TriangleAlertIcon,  iconColor: "text-event-warning" },
  behavior: { Icon: PersonStandingIcon, iconColor: "text-event-warning" },
  info:     { Icon: EventInfoIcon,      iconColor: "text-monitor-text-muted" },
};

const CONFIDENCE_BADGE: Record<EventSeverity, string> = {
  critical:
    "border border-event-critical/20 bg-event-critical/10 text-event-critical",
  warning:
    "border border-event-warning/20 bg-event-warning/10 text-event-warning",
  behavior:
    "border border-event-warning/20 bg-event-warning/10 text-event-warning",
  info: "border border-monitor-border bg-monitor-border/30 text-monitor-text-muted",
};

interface EventDetailPanelProps {
  event: EventDetail;
}

export default function EventDetailPanel({ event }: EventDetailPanelProps) {
  const { Icon, iconColor } = SEVERITY_CONFIG[event.severity];

  return (
    <div className="flex w-full shrink-0 flex-col overflow-hidden border-t border-monitor-border bg-monitor-bg md:h-full md:w-[540px] md:border-l md:border-t-0">
      {/* 이벤트 제목 섹션 */}
      <div className="shrink-0 border-b border-monitor-border bg-monitor-card-bg px-4 pb-1 pt-4 sm:px-6 sm:pt-6">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-[10px]">
            <Icon className={`mt-[2px] h-6 w-6 shrink-0 ${iconColor}`} />
            <h2 className="text-[16px] font-bold leading-[22px] tracking-[-0.45px] text-monitor-text sm:text-[20px] sm:leading-[25px]">
              {event.title}
            </h2>
          </div>
          <span
            className={`shrink-0 rounded-[4px] px-2 py-[5px] text-[12px] font-bold leading-4 ${CONFIDENCE_BADGE[event.severity]}`}
          >
            신뢰도 {event.confidence}%
          </span>
        </div>
        <p className="pb-5 text-[14px] leading-[22px] tracking-[-0.15px] text-monitor-text-muted">
          {event.description}
        </p>
      </div>

      {/* 시스템 교차 검증 — behavior 이벤트는 없음 */}
      {event.verification && event.verification.length > 0 && (
        <EventVerificationList items={event.verification} />
      )}

      {/* 상세 로그 타임라인 */}
      <EventDetailTimeline entries={event.logEntries} />

      {/* 액션 버튼 — 검증 완료된 이벤트만 표시 */}
      {event.showActions && <EventDetailActions />}
    </div>
  );
}
