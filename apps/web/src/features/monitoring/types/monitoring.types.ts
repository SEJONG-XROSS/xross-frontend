/**
 * 이벤트 심각도 — 아이콘·색상·UI 분기의 단일 기준.
 *
 * - critical : Pick·은닉 등 절도 확정, 즉각 대응 필요
 * - warning  : 절도 의심·검증 대기 등 주의 필요
 * - safety   : 쓰러짐·장기체류 등 고객 이상행동 (안전 관련)
 * - info     : Put Back·정상 반환 등 참고용 로그
 */
export type EventSeverity = "critical" | "warning" | "behavior" | "info";

export type EventTagType =
  | "ai-pick"
  | "sensor"
  | "pos-mismatch"
  | "pos-pending"
  | "pos-match";

export interface EventTag {
  type: EventTagType;
  label: string;
}

export interface DetectionEvent {
  id: string;
  title: string;
  timestamp: string;
  severity: EventSeverity;
  description: string;
  tags?: EventTag[];
}

export interface CameraFeed {
  id: string;
  name: string;
  isOnline: boolean;
  isRecording: boolean;
}

export interface AnalyticsDataPoint {
  time: string;
  picks: number;
  suspicions: number;
}

export type VerificationStatus =
  | "detected"  // 정상 감지 확인
  | "anomaly"   // 이상 행동 패턴 감지 (은닉 등)
  | "match"     // 무게/POS 데이터 일치
  | "mismatch"  // POS 데이터 불일치 (절도 확정)
  | "n/a"       // 해당 없음 또는 검증 불필요
  | "pending";  // 검증 대기 중

/** 이벤트를 감지한 시스템 소스 */
export type LogEntrySource = "vision" | "weight" | "pos" | "system";

export interface VerificationItem {
  source: LogEntrySource;
  label: string;
  status: VerificationStatus;
  detail: string;
}

export interface LogEntry {
  time: string;
  source: LogEntrySource;
  message: string;
  /** 강조 표시 수준 — 미지정 시 일반 로그 */
  alert?: "critical" | "warning";
}

/** 이벤트 목록 카드용 DetectionEvent에 상세 정보를 추가한 확장 타입 */
export interface EventDetail extends DetectionEvent {
  cameraId: string;
  cameraName: string;
  confidence: number;
  /** 안전 관련 이벤트(behavior)는 verification 섹션이 없음 */
  verification?: VerificationItem[];
  logEntries: LogEntry[];
  /** 검증이 완료된 이벤트만 액션 버튼 표시 (확정 절도 등) */
  showActions?: boolean;
}
