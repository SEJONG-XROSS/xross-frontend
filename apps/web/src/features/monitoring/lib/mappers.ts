import type {
  EventResponse,
  EventDetailResponse,
  EventType,
  EventDetailType,
  EventSource,
  EventDetailStatus,
  AlertPriority,
} from "@/features/monitoring/api/monitoring.types";
import type {
  DetectionEvent,
  EventSeverity,
  EventTag,
  VerificationItem,
  LogEntry,
  LogEntrySource,
  VerificationStatus,
} from "@/features/monitoring/types/monitoring.types";

const EVENT_TYPE_LABEL: Record<EventType, string> = {
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

const DETAIL_TYPE_LABEL: Record<EventDetailType, string> = {
  CUSTOMER_ENTER: "고객 입장",
  CUSTOMER_EXIT: "고객 퇴장",
  ITEM_PICKED: "상품 집기",
  ITEM_RETURNED: "상품 반납",
  WEIGHT_CHANGE: "무게 변화",
  PAYMENT_COMPLETED: "결제 완료",
};

export function getAlertSeverity(priority: AlertPriority): "critical" | "warning" | "info" {
  if (priority === "CRITICAL") return "critical";
  if (priority === "WARNING") return "warning";
  return "info";
}

function getSeverity(type: EventType): EventSeverity {
  if (type === "UNPAID_SUSPICIOUS" || type === "FALL_DETECTED") return "critical";
  if (type === "PICK" || type === "PAYMENT_MISMATCH" || type === "EXIT_LINE_CROSSED") return "warning";
  return "info";
}

function getTag(source: EventSource): EventTag | null {
  if (source === "CEILING_CAMERA" || source === "FREEZER_CAMERA") {
    return { type: "ai-pick", label: "AI 감지" };
  }
  if (source === "WEIGHT_SENSOR") {
    return { type: "sensor", label: "무게 센서" };
  }
  if (source === "POS") {
    return { type: "pos-match", label: "POS" };
  }
  return null;
}

function buildEventDescription(e: EventResponse): string {
  switch (e.type) {
    case "ENTER":
      return "매장에 고객이 입장했습니다.";
    case "LOCATION_UPDATE":
      return "고객 위치가 업데이트되었습니다.";
    case "SENSOR_TRIGGER":
      return "센서가 감지되었습니다.";
    case "PICK":
      return `${e.product?.name ?? "상품"}을(를) 집었습니다.${e.freezer ? ` (${e.freezer.code})` : ""}`;
    case "PUT":
      return `${e.product?.name ?? "상품"}을(를) 반납했습니다.`;
    case "BROWSE_ONLY":
      return "고객이 진열대를 탐색했습니다.";
    case "CART_UPDATED":
      return "장바구니가 변경되었습니다.";
    case "PAYMENT_RECEIVED":
      return "POS 결제가 완료되었습니다.";
    case "PAYMENT_MATCHED":
      return "결제 내역이 장바구니와 일치합니다.";
    case "PAYMENT_MISMATCH":
      return e.message ?? "장바구니 불일치 결제가 감지되었습니다.";
    case "UNPAID_SUSPICIOUS":
      return e.message ?? "미결제 의심 퇴장이 감지되었습니다.";
    case "EXIT_LINE_CROSSED":
      return "고객이 퇴장 라인을 통과했습니다.";
    case "LONG_STAY":
      return "고객이 장시간 체류 중입니다.";
    case "FALL_DETECTED":
      return "낙상이 감지되었습니다.";
    case "ALERT_SENT":
      return e.message ?? "알림이 발송되었습니다.";
  }
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function mapEventToDetectionEvent(e: EventResponse): DetectionEvent {
  const tag = getTag(e.source);
  return {
    id: String(e.id),
    title: EVENT_TYPE_LABEL[e.type],
    timestamp: formatTime(e.occurredAt),
    severity: getSeverity(e.type),
    description: buildEventDescription(e),
    tags: tag ? [tag] : undefined,
  };
}

type SourceMapping = { logSource: LogEntrySource; label: string };

const SOURCE_MAP: Record<EventSource, SourceMapping> = {
  CEILING_CAMERA: { logSource: "vision", label: "비전 AI 감지 (천장)" },
  FREEZER_CAMERA: { logSource: "vision", label: "비전 AI 감지 (냉동고)" },
  WEIGHT_SENSOR: { logSource: "weight", label: "무게 센서" },
  POS: { logSource: "pos", label: "POS 결제" },
};

function mapDetailStatus(status: EventDetailStatus): VerificationStatus {
  if (status === "MATCHED") return "match";
  if (status === "PROCESSED") return "detected";
  if (status === "PENDING") return "pending";
  return "n/a";
}

function buildDetailText(d: EventDetailResponse): string {
  if (d.weightDeltaG != null) {
    return `무게 변화: ${d.weightDeltaG > 0 ? "+" : ""}${d.weightDeltaG}g`;
  }
  if (d.detectedProductSku) {
    return `감지 SKU: ${d.detectedProductSku}`;
  }
  if (d.confidence != null) {
    return `신뢰도: ${Math.round(d.confidence * 100)}%`;
  }
  return DETAIL_TYPE_LABEL[d.type];
}

export function mapEventDetailsToVerification(
  details: EventDetailResponse[],
): VerificationItem[] {
  return details
    .filter((d) => d.status !== "IGNORED")
    .map((d) => {
      const mapping = SOURCE_MAP[d.source];
      return {
        source: mapping.logSource,
        label: mapping.label,
        status: mapDetailStatus(d.status),
        detail: buildDetailText(d),
      };
    });
}

export function mapEventDetailsToLogEntries(
  details: EventDetailResponse[],
): LogEntry[] {
  return [...details]
    .sort(
      (a, b) =>
        new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
    )
    .map((d) => {
      const { logSource, label } = SOURCE_MAP[d.source];
      const typeLabel = DETAIL_TYPE_LABEL[d.type];
      const isAlert = d.status === "PENDING" || d.status === "ERROR";
      return {
        time: formatTime(d.occurredAt),
        source: logSource,
        message: `${label}: ${typeLabel}`,
        alert: isAlert ? ("warning" as const) : undefined,
      };
    });
}

export function mapEventsToLogEntries(events: EventResponse[]): LogEntry[] {
  return [...events]
    .sort(
      (a, b) =>
        new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
    )
    .map((e) => {
      const { logSource, label } = SOURCE_MAP[e.source];
      const severity = getSeverity(e.type);
      return {
        time: formatTime(e.occurredAt),
        source: logSource,
        message: `${label}: ${EVENT_TYPE_LABEL[e.type]}`,
        alert:
          severity === "critical"
            ? ("critical" as const)
            : severity === "warning"
              ? ("warning" as const)
              : undefined,
      };
    });
}
