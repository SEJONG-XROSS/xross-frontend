import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useQueries } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import {
  useAlert,
  getAlertSeverity,
  getEvent,
  monitoringQueryKeys,
  cn,
} from '@xross/core';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/navigation/types';
import type { EventResponse, AlertPriority, AlertStatus } from '@xross/core';
import { DetailHeader } from '../components/DetailHeader';
import { EventTimeline } from '../components/EventTimeline';
import { CCTVPlaybackView } from '../components/CCTVPlaybackView';

type Props = NativeStackScreenProps<RootStackParamList, 'AlertDetail'>;

const PRIORITY_CONFIG: Record<AlertPriority, { label: string; bgClass: string; textClass: string; borderClass: string }> = {
  CRITICAL: { label: '긴급', bgClass: 'bg-[rgba(255,100,103,0.1)]', textClass: 'text-event-critical', borderClass: 'border-[rgba(255,100,103,0.3)]' },
  WARNING:  { label: '경고', bgClass: 'bg-[rgba(254,154,0,0.1)]',   textClass: 'text-event-warning',  borderClass: 'border-[rgba(254,154,0,0.3)]' },
};

const STATUS_CONFIG: Record<AlertStatus, { label: string; bgClass: string; textClass: string; borderClass: string }> = {
  PENDING:      { label: '미확인',   bgClass: 'bg-[rgba(255,100,103,0.08)]',  textClass: 'text-event-critical',         borderClass: 'border-[rgba(255,100,103,0.3)]' },
  SENT:         { label: '전송됨',   bgClass: 'bg-monitor-border/30',          textClass: 'text-monitor-text-muted',     borderClass: 'border-monitor-border' },
  FAILED:       { label: '전송 실패', bgClass: 'bg-[rgba(254,154,0,0.1)]',    textClass: 'text-event-warning',           borderClass: 'border-[rgba(254,154,0,0.3)]' },
  ACKNOWLEDGED: { label: '확인 완료', bgClass: 'bg-[rgba(0,212,146,0.1)]',    textClass: 'text-monitor-accent-green',   borderClass: 'border-[rgba(0,212,146,0.3)]' },
};

const EVENT_SOURCE_LABEL: Record<string, string> = {
  CEILING_CAMERA: '비전 AI (천장)',
  FREEZER_CAMERA: '비전 AI (냉동고)',
  WEIGHT_SENSOR: '무게 센서',
  POS: 'POS',
};

const EVENT_TYPE_LABEL: Record<string, string> = {
  ENTER: '고객 입장', LOCATION_UPDATE: '위치 업데이트', SENSOR_TRIGGER: '센서 감지',
  PICK: '상품 집기 감지', PUT: '상품 반납', BROWSE_ONLY: '진열대 탐색',
  CART_UPDATED: '장바구니 변경', PAYMENT_RECEIVED: '결제 완료', PAYMENT_MATCHED: '결제 일치',
  PAYMENT_MISMATCH: '장바구니 불일치', UNPAID_SUSPICIOUS: '미결제 의심 퇴장',
  EXIT_LINE_CROSSED: '퇴장 라인 통과', LONG_STAY: '장시간 체류',
  FALL_DETECTED: '낙상 감지', ALERT_SENT: '알림 발송',
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('ko-KR')} ${d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
}

export function AlertDetailScreen({ route }: Props) {
  const { id } = route.params;
  const { data: alert, isLoading: alertLoading } = useAlert(id);

  const eventQueries = useQueries({
    queries: (alert?.relatedEventIds ?? []).map((eid) => ({
      queryKey: monitoringQueryKeys.event(eid),
      queryFn: () => getEvent(eid),
      enabled: !!alert,
    })),
  });

  const isLoading = alertLoading || (!!alert?.relatedEventIds?.length && eventQueries.some((q) => q.isLoading));

  const relatedEvents = eventQueries
    .map((q) => q.data as EventResponse | undefined)
    .filter((e): e is EventResponse => e != null)
    .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());

  const severity = alert ? getAlertSeverity(alert.priority) : 'info';
  const priorityCfg = alert ? PRIORITY_CONFIG[alert.priority] : null;
  const statusCfg = alert ? STATUS_CONFIG[alert.status] : null;

  const cameraSource = relatedEvents.find(
    (e) => e.source === 'CEILING_CAMERA' || e.source === 'FREEZER_CAMERA',
  )?.source ?? relatedEvents[0]?.source ?? 'CEILING_CAMERA';
  const cameraName = EVENT_SOURCE_LABEL[cameraSource] ?? cameraSource;

  // 로그 타임라인 데이터로 변환
  const logEntries = relatedEvents.map((e) => ({
    time: formatTime(e.occurredAt),
    source: (e.source?.includes('CAMERA') ? 'vision' : e.source === 'WEIGHT_SENSOR' ? 'weight' : e.source === 'POS' ? 'pos' : 'system') as 'vision' | 'weight' | 'pos' | 'system',
    message: EVENT_TYPE_LABEL[e.type] ?? e.type,
    alert: e.type === 'UNPAID_SUSPICIOUS' || e.type === 'FALL_DETECTED' ? 'critical' as const :
           e.type === 'PICK' || e.type === 'PAYMENT_MISMATCH' ? 'warning' as const : undefined,
  }));

  return (
    <View className="flex-1 bg-monitor-bg">
      <DetailHeader
        title={alert ? alert.title : `알림 #${id}`}
        subtitle={`ALERT #${id}`}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#51a2ff" />
        </View>
      ) : !alert ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-monitor-text-muted text-sm">알림 데이터가 없습니다.</Text>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* 영상 복기 플레이어 */}
          <CCTVPlaybackView alertId={id} cameraName={cameraName} />

          {/* 알림 정보 */}
          <View className="bg-monitor-card-bg border-b border-monitor-border px-4 py-4">
            <View className="flex-row items-start gap-3 mb-2">
              <Ionicons
                name={severity === 'critical' ? 'shield-outline' : 'warning-outline'}
                size={20}
                color={severity === 'critical' ? '#ff6467' : '#fe9a00'}
                style={{ marginTop: 2 }}
              />
              <Text className="flex-1 text-[17px] font-bold leading-[23px] tracking-tight text-monitor-text">
                {alert.title}
              </Text>
              <View className="flex-row gap-1.5">
                {priorityCfg && (
                  <View className={cn('rounded-[4px] border px-2 py-[3px]', priorityCfg.bgClass, priorityCfg.borderClass)}>
                    <Text className={cn('text-[10px] font-bold leading-[14px] tracking-wide', priorityCfg.textClass)}>
                      {priorityCfg.label}
                    </Text>
                  </View>
                )}
                {statusCfg && (
                  <View className={cn('rounded-[4px] border px-2 py-[3px]', statusCfg.bgClass, statusCfg.borderClass)}>
                    <Text className={cn('text-[10px] font-medium leading-[14px]', statusCfg.textClass)}>
                      {statusCfg.label}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <Text className="text-[13px] leading-[21px] text-monitor-text-muted mb-3">
              {alert.message}
            </Text>

            <View className="gap-1.5">
              <View className="flex-row justify-between">
                <Text className="text-xs text-monitor-text-dim">발생 시각</Text>
                <Text className="text-xs text-monitor-text-muted font-mono">{formatDateTime(alert.createdAt)}</Text>
              </View>
              {alert.customer && (
                <View className="flex-row justify-between">
                  <Text className="text-xs text-monitor-text-dim">추적 ID</Text>
                  <Text className="text-xs text-monitor-text-muted font-mono">#{alert.customer.trackingKey}</Text>
                </View>
              )}
            </View>
          </View>

          {/* 관련 이벤트 타임라인 */}
          <View className="px-4 py-4">
            <View className="flex-row items-center gap-2 mb-5">
              <Ionicons name="list-outline" size={14} color="#62748e" />
              <Text className="text-[12px] font-bold uppercase tracking-[1.2px] text-monitor-text-dim">
                관련 이벤트 타임라인
              </Text>
              {relatedEvents.length > 0 && (
                <Text className="ml-auto font-mono text-[11px] text-monitor-text-dim">
                  {relatedEvents.length}건
                </Text>
              )}
            </View>
            {relatedEvents.length === 0 ? (
              <Text className="text-[13px] text-monitor-text-dim">관련 이벤트가 없습니다.</Text>
            ) : (
              <EventTimeline entries={logEntries} />
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
