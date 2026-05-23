export type EventSeverity = 'critical' | 'warning' | 'behavior' | 'info';

export type EventTagType =
  | 'ai-pick'
  | 'sensor'
  | 'pos-mismatch'
  | 'pos-pending'
  | 'pos-match';

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
  enters: number;
  payments: number;
}

export type VerificationStatus =
  | 'detected'
  | 'anomaly'
  | 'match'
  | 'mismatch'
  | 'n/a'
  | 'pending';

export type LogEntrySource = 'vision' | 'weight' | 'pos' | 'system';

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
  alert?: 'critical' | 'warning';
}

export interface EventDetail extends DetectionEvent {
  cameraId: string;
  cameraName: string;
  confidence: number;
  verification?: VerificationItem[];
  logEntries: LogEntry[];
  showActions?: boolean;
}
