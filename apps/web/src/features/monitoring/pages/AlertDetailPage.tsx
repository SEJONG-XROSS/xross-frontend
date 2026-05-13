import { useParams, Navigate, useNavigate } from "react-router";
import { useQueries } from "@tanstack/react-query";
import EventDetailHeader from "@/features/monitoring/components/event-detail/EventDetailHeader";
import EventCCTVPlayer from "@/features/monitoring/components/event-detail/EventCCTVPlayer";
import { useAlert } from "@/features/monitoring/hooks/useAlert";
import { getEvent } from "@/features/monitoring/api/monitoring.api";
import { monitoringQueryKeys } from "@/features/monitoring/lib/queryKeys";
import { getAlertSeverity } from "@/features/monitoring/lib/mappers";
import { cn } from "@/shared/lib/utils";
import ShieldAlertIcon from "@/assets/icons/shield-alert.svg?react";
import TriangleAlertIcon from "@/assets/icons/triangle-alert.svg?react";
import LogsIcon from "@/assets/icons/logs.svg?react";
import type { EventResponse, AlertPriority, AlertStatus } from "@/features/monitoring/api/monitoring.types";

/* ── 뱃지 helpers ──────────────────────────── */

const PRIORITY_CONFIG: Record<AlertPriority, { label: string; cls: string }> = {
  CRITICAL: {
    label: "긴급",
    cls: "border-event-critical/30 bg-event-critical/10 text-event-critical",
  },
  WARNING: {
    label: "경고",
    cls: "border-event-warning/30 bg-event-warning/10 text-event-warning",
  },
};

const STATUS_CONFIG: Record<AlertStatus, { label: string; cls: string }> = {
  PENDING:      { label: "미확인",   cls: "border-[rgba(251,44,54,0.3)] bg-[rgba(251,44,54,0.08)] text-[#ff6467]" },
  SENT:         { label: "전송됨",   cls: "border-monitor-border bg-monitor-border/30 text-monitor-text-muted" },
  FAILED:       { label: "전송 실패", cls: "border-event-warning/30 bg-event-warning/10 text-event-warning" },
  ACKNOWLEDGED: { label: "확인 완료", cls: "border-monitor-accent-green/30 bg-monitor-accent-green/10 text-monitor-accent-green" },
};

const EVENT_SOURCE_LABEL: Record<string, { label: string; dotCls: string; badgeCls: string }> = {
  CEILING_CAMERA: {
    label: "비전 AI (천장)",
    dotCls: "bg-monitor-accent-blue",
    badgeCls: "bg-monitor-accent-blue/10 text-monitor-accent-blue",
  },
  FREEZER_CAMERA: {
    label: "비전 AI (냉동고)",
    dotCls: "bg-monitor-accent-blue",
    badgeCls: "bg-monitor-accent-blue/10 text-monitor-accent-blue",
  },
  WEIGHT_SENSOR: {
    label: "무게 센서",
    dotCls: "bg-monitor-accent-green",
    badgeCls: "bg-monitor-accent-green/10 text-monitor-accent-green",
  },
  POS: {
    label: "POS",
    dotCls: "bg-monitor-accent-purple",
    badgeCls: "bg-monitor-accent-purple/10 text-monitor-accent-purple",
  },
};

const EVENT_TYPE_LABEL: Record<string, string> = {
  ENTER: "고객 입장",
  LOCATION_UPDATE: "위치 업데이트",
  SENSOR_TRIGGER: "센서 감지",
  PICK: "상품 집기 감지",
  PUT: "상품 반납",
  BROWSE_ONLY: "진열대 탐색",
  CART_UPDATED: "장바구니 변경",
  PAYMENT_RECEIVED: "결제 완료",
  PAYMENT_MATCHED: "결제 일치 확인",
  PAYMENT_MISMATCH: "장바구니 불일치",
  UNPAID_SUSPICIOUS: "미결제 의심 퇴장",
  EXIT_LINE_CROSSED: "퇴장 라인 통과",
  LONG_STAY: "장시간 체류",
  FALL_DETECTED: "낙상 감지",
  ALERT_SENT: "알림 발송",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("ko-KR")} ${d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}`;
}

/* ── 관련 이벤트 타임라인 항목 ──────────────── */
interface EventTimelineEntryProps {
  event: EventResponse;
  isLast: boolean;
}

function EventTimelineEntry({ event, isLast }: EventTimelineEntryProps) {
  const src = EVENT_SOURCE_LABEL[event.source] ?? {
    label: event.source,
    dotCls: "bg-monitor-border",
    badgeCls: "bg-monitor-border text-monitor-text-muted",
  };
  const typeLabel = EVENT_TYPE_LABEL[event.type] ?? event.type;
  const isCritical = event.type === "UNPAID_SUSPICIOUS" || event.type === "FALL_DETECTED";
  const isWarning = event.type === "PICK" || event.type === "PAYMENT_MISMATCH" || event.type === "EXIT_LINE_CROSSED";

  return (
    <div className="flex items-start gap-4">
      {/* 도트 + 연결선 */}
      <div className="relative flex w-6 shrink-0 flex-col items-center">
        <div className={cn("relative z-10 h-3 w-3 rounded-full border-2 border-monitor-bg mt-[5px]", src.dotCls)} />
        {!isLast && (
          <div className="absolute top-[18px] h-full w-[2px] bg-monitor-border" />
        )}
      </div>

      {/* 내용 */}
      <div className="flex flex-col gap-[5px] pb-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-monitor-text-dim">
            {formatTime(event.occurredAt)}
          </span>
          <span className={cn("rounded-[4px] px-[6px] py-[1.5px] font-mono text-[9px] uppercase tracking-[0.4px]", src.badgeCls)}>
            {src.label}
          </span>
        </div>
        <p className={cn(
          "text-[14px] leading-[19px] tracking-[-0.15px]",
          isCritical ? "font-semibold text-event-critical" :
          isWarning  ? "font-semibold text-event-warning" :
          "text-monitor-text-muted",
        )}>
          {typeLabel}
          {event.product?.name && (
            <span className="ml-1 text-monitor-text-dim text-[12px]">— {event.product.name}</span>
          )}
        </p>
        {event.message && (
          <p className="text-[12px] text-monitor-text-dim leading-[17px]">{event.message}</p>
        )}
        {event.confidence != null && (
          <span className="text-[11px] text-monitor-text-dim">
            신뢰도 {Math.round(event.confidence * 100)}%
          </span>
        )}
      </div>
    </div>
  );
}

/* ── AlertDetailPage ─────────────────────── */
export default function AlertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const alertId = Number(id);

  if (!alertId) return <Navigate to="/monitoring" replace />;

  const { data: alert, isLoading: alertLoading } = useAlert(alertId);

  const eventQueries = useQueries({
    queries: (alert?.relatedEventIds ?? []).map((eid) => ({
      queryKey: monitoringQueryKeys.event(eid),
      queryFn: () => getEvent(eid),
      enabled: !!alert,
    })),
  });

  const eventsLoading = eventQueries.some((q) => q.isLoading);
  const isLoading = alertLoading || (!!alert?.relatedEventIds?.length && eventsLoading);

  if (isLoading) {
    return (
      <div className="bg-monitor-card-bg flex h-full items-center justify-center">
        <span className="text-monitor-text-muted text-sm">로딩 중...</span>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="bg-monitor-card-bg flex h-full flex-col items-center justify-center gap-4">
        <span className="text-monitor-text-muted text-sm">알림 데이터가 없습니다.</span>
        <button type="button" onClick={() => navigate(-1)} className="text-monitor-accent-blue text-sm hover:underline">
          뒤로가기
        </button>
      </div>
    );
  }

  const severity = getAlertSeverity(alert.priority);
  const PriorityIcon = severity === "critical" ? ShieldAlertIcon : TriangleAlertIcon;
  const priorityCfg = PRIORITY_CONFIG[alert.priority];
  const statusCfg = STATUS_CONFIG[alert.status];

  const relatedEvents = eventQueries
    .map((q) => q.data as EventResponse | undefined)
    .filter((e): e is EventResponse => e != null)
    .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());

  const cameraSource = relatedEvents.find(
    (e) => e.source === "CEILING_CAMERA" || e.source === "FREEZER_CAMERA",
  )?.source ?? relatedEvents[0]?.source ?? "CEILING_CAMERA";

  return (
    <div className="bg-monitor-card-bg flex h-full flex-col overflow-hidden">
      <EventDetailHeader eventId={`ALERT #${alertId}`} />

      <main className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        <EventCCTVPlayer
          cameraId={cameraSource}
          cameraName={
            EVENT_SOURCE_LABEL[cameraSource]?.label ?? cameraSource
          }
          timestamp={relatedEvents[0] ? formatTime(relatedEvents[0].occurredAt) : ""}
        />

        {/* 우: 알림 정보 + 이벤트 타임라인 */}
        <div className="flex w-full shrink-0 flex-col overflow-hidden border-t border-monitor-border bg-monitor-bg md:h-full md:w-[540px] md:border-l md:border-t-0">

          {/* 알림 정보 섹션 */}
          <div className="shrink-0 border-b border-monitor-border bg-monitor-card-bg px-4 pb-5 pt-4 sm:px-6 sm:pt-6">
            <div className="mb-3 flex items-start gap-3">
              <PriorityIcon className={cn("mt-[3px] h-5 w-5 shrink-0", severity === "critical" ? "text-event-critical" : "text-event-warning")} />
              <h2 className="flex-1 text-[17px] font-bold leading-[23px] tracking-[-0.4px] text-monitor-text">
                {alert.title}
              </h2>
              <div className="flex shrink-0 items-center gap-[6px]">
                <span className={cn("rounded-[4px] border px-2 py-[3px] text-[10px] font-bold leading-[14px] tracking-[0.3px]", priorityCfg.cls)}>
                  {priorityCfg.label}
                </span>
                <span className={cn("rounded-[4px] border px-2 py-[3px] text-[10px] font-medium leading-[14px]", statusCfg.cls)}>
                  {statusCfg.label}
                </span>
              </div>
            </div>

            <p className="text-[13px] leading-[21px] text-monitor-text-muted">
              {alert.message}
            </p>

            <div className="mt-3 flex flex-col gap-[6px]">
              <div className="flex justify-between text-[12px]">
                <span className="text-monitor-text-dim">발생 시각</span>
                <span className="text-monitor-text-muted font-mono">{formatDateTime(alert.createdAt)}</span>
              </div>
              {alert.customer && (
                <div className="flex justify-between text-[12px]">
                  <span className="text-monitor-text-dim">추적 ID</span>
                  <span className="text-monitor-text-muted font-mono">#{alert.customer.trackingKey}</span>
                </div>
              )}
              {alert.acknowledgedBy && (
                <div className="flex justify-between text-[12px]">
                  <span className="text-monitor-text-dim">확인 처리자</span>
                  <span className="text-monitor-text-muted">{alert.acknowledgedBy.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* 관련 이벤트 타임라인 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-5 flex items-center gap-[8px]">
              <LogsIcon className="h-4 w-4 shrink-0 text-monitor-text-dim" />
              <span className="text-[12px] font-bold uppercase tracking-[1.2px] text-monitor-text-dim">
                관련 이벤트 타임라인
              </span>
              {relatedEvents.length > 0 && (
                <span className="ml-auto font-mono text-[11px] text-monitor-text-dim">
                  {relatedEvents.length}건
                </span>
              )}
            </div>

            {relatedEvents.length === 0 ? (
              <p className="text-[13px] text-monitor-text-dim">관련 이벤트가 없습니다.</p>
            ) : (
              <div className="relative">
                {relatedEvents.map((event, idx) => (
                  <EventTimelineEntry
                    key={event.id}
                    event={event}
                    isLast={idx === relatedEvents.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
